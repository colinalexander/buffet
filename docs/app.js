import { initViewer } from "./js/viewer.js";

const STORAGE_KEY = "mandateos.viewer.showAllEmissions";

const toggle = document.getElementById("toggle-emissions");
let showAllEmissions = false;
try {
  showAllEmissions = window.localStorage.getItem(STORAGE_KEY) === "1";
} catch {
  showAllEmissions = false;
}

if (toggle) {
  toggle.checked = showAllEmissions;
}

let rawIndexData = null;
const groupByRepresentativeId = new Map();
const representativeByEmissionId = new Map();

function rebuildGroupMaps() {
  groupByRepresentativeId.clear();
  representativeByEmissionId.clear();

  const groups = rawIndexData && Array.isArray(rawIndexData.groups) ? rawIndexData.groups : [];
  for (const group of groups) {
    const emissions = Array.isArray(group?.emissions) ? group.emissions : [];
    const representative = emissions[0];
    if (!representative?.record_id) {
      continue;
    }
    const representativeId = String(representative.record_id);
    groupByRepresentativeId.set(representativeId, group);
    emissions.forEach((emission) => {
      if (emission?.record_id) {
        representativeByEmissionId.set(String(emission.record_id), representativeId);
      }
    });
  }
}

function groupedRecordsForViewer(indexData) {
  const groups = Array.isArray(indexData.groups) ? indexData.groups : null;
  const records = Array.isArray(indexData.records) ? indexData.records : null;
  if (!groups || !records) {
    return null;
  }

  const recordById = new Map(records.map((record) => [String(record.record_id), record]));
  const grouped = [];
  groups.forEach((group) => {
    const emissions = Array.isArray(group?.emissions) ? group.emissions : [];
    const representative = emissions[0];
    if (!representative?.record_id) {
      return;
    }
    const representativeId = String(representative.record_id);
    const base = recordById.get(representativeId);
    if (!base) {
      grouped.push({
        path: group.representative_path || representative.path,
        record_id: representativeId,
        timestamp: group.last_timestamp || representative.timestamp,
        mandate_id: group.mandate_id,
        mandate_version: null,
        procedure_id: group.procedure_id,
        procedure_version: null,
        outcome_type: group.outcome_type,
        confidence_level: null,
      });
      return;
    }
    grouped.push({
      ...base,
      path: group.representative_path || base.path,
      timestamp: group.last_timestamp || base.timestamp,
    });
  });
  return grouped;
}

const originalFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input?.url;
  const response = await originalFetch(input, init);
  if (!url || !url.endsWith("data/index.json")) {
    return response;
  }

  try {
    rawIndexData = await response.clone().json();
    rebuildGroupMaps();
  } catch {
    return response;
  }

  if (showAllEmissions) {
    return response;
  }

  const grouped = groupedRecordsForViewer(rawIndexData);
  if (!grouped || !grouped.length) {
    return response;
  }

  const patched = { ...rawIndexData, records: grouped };
  return new Response(JSON.stringify(patched), {
    status: response.status,
    statusText: response.statusText,
    headers: { "Content-Type": "application/json" },
  });
};

function representativeRecordIdFromListItem(li) {
  const checkbox = li.querySelector("input.record-check");
  const label = checkbox?.getAttribute("aria-label") || "";
  const match = label.match(/^Select record (.+)$/);
  return match ? match[1] : null;
}

function decorateGroupedList() {
  if (showAllEmissions || !groupByRepresentativeId.size) {
    return;
  }

  const list = document.getElementById("record-list");
  if (!list) {
    return;
  }

  list.querySelectorAll("li").forEach((li) => {
    const recordId = representativeRecordIdFromListItem(li);
    if (!recordId) {
      return;
    }
    const group = groupByRepresentativeId.get(recordId);
    if (!group || Number(group.count) <= 1) {
      return;
    }

    const button = li.querySelector("button.record-btn");
    const top = button?.querySelector(".record-top");
    if (!top) {
      return;
    }

    let badgeWrap = top.querySelector(".record-badges");
    if (!badgeWrap) {
      const outcomeBadge = top.querySelector(".badge");
      badgeWrap = document.createElement("div");
      badgeWrap.className = "record-badges";
      if (outcomeBadge) {
        badgeWrap.appendChild(outcomeBadge);
      }
      top.appendChild(badgeWrap);
    }

    let repeat = badgeWrap.querySelector(".badge.repeat");
    if (!repeat) {
      repeat = document.createElement("span");
      repeat.className = "badge repeat";
      badgeWrap.appendChild(repeat);
    }
    const repeatText = `Repeated ×${group.count}`;
    if (repeat.textContent !== repeatText) {
      repeat.textContent = repeatText;
    }
  });
}

let decoratePending = false;
function scheduleDecorateGroupedList() {
  if (decoratePending) {
    return;
  }
  decoratePending = true;
  window.requestAnimationFrame(() => {
    decoratePending = false;
    decorateGroupedList();
  });
}

function selectedRecordIdFromUrl() {
  return new URL(window.location.href).searchParams.get("record");
}

function injectEmissionsSection() {
  const detail = document.getElementById("record-detail");
  if (!detail) {
    return;
  }

  const existing = detail.querySelector("[data-emissions-section]");

  if (showAllEmissions) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  const recordId = selectedRecordIdFromUrl();
  if (!recordId) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  const representativeId = groupByRepresentativeId.has(recordId) ? recordId : representativeByEmissionId.get(recordId);
  if (!representativeId) {
    if (existing) {
      existing.remove();
    }
    return;
  }
  const group = groupByRepresentativeId.get(representativeId);
  if (!group) {
    if (existing) {
      existing.remove();
    }
    return;
  }

  const emissions = Array.isArray(group.emissions) ? group.emissions : [];
  const emissionsKey = `${representativeId}:${group.count}`;

  if (existing?.getAttribute("data-emissions-key") === emissionsKey) {
    return;
  }
  if (existing) {
    existing.remove();
  }

  const section = document.createElement("section");
  section.setAttribute("data-emissions-section", "true");
  section.setAttribute("data-emissions-key", emissionsKey);

  const details = document.createElement("details");
  details.className = "emissions-details";

  const summary = document.createElement("summary");
  summary.textContent = `Emissions (append-only attestations) · ${group.count}`;
  details.appendChild(summary);

  if (!emissions.length) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "No emissions found.";
    details.appendChild(empty);
  } else {
    const list = document.createElement("ul");
    list.className = "emissions-list";
    emissions.forEach((emission) => {
      const item = document.createElement("li");

      const meta = document.createElement("div");
      meta.className = "emission-meta";

      const timestamp = document.createElement("strong");
      timestamp.textContent = emission?.timestamp || "unknown timestamp";
      meta.appendChild(timestamp);

      const from = document.createElement("span");
      from.textContent = emission?.published_from ? `from ${emission.published_from}` : "";
      meta.appendChild(from);

      const link = document.createElement("a");
      link.href = emission?.path || "#";
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Open JSON";

      item.appendChild(meta);
      item.appendChild(link);
      list.appendChild(item);
    });
    details.appendChild(list);
  }

  section.appendChild(details);
  detail.appendChild(section);
}

let detailPending = false;
function scheduleInjectEmissionsSection() {
  if (detailPending) {
    return;
  }
  detailPending = true;
  window.requestAnimationFrame(() => {
    detailPending = false;
    injectEmissionsSection();
  });
}

if (toggle) {
  toggle.addEventListener("change", () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, toggle.checked ? "1" : "0");
    } catch {
      // ignore
    }

    if (!toggle.checked && rawIndexData) {
      const url = new URL(window.location.href);
      const current = url.searchParams.get("record");
      const representativeId = current ? representativeByEmissionId.get(current) : null;
      if (representativeId) {
        url.searchParams.set("record", representativeId);
        window.history.replaceState({}, "", url);
      }
    }

    window.location.reload();
  });
}

const recordList = document.getElementById("record-list");
if (recordList) {
  new MutationObserver(() => scheduleDecorateGroupedList()).observe(recordList, { childList: true, subtree: true });
}

const detailPanel = document.getElementById("record-detail");
if (detailPanel) {
  new MutationObserver(() => scheduleInjectEmissionsSection()).observe(detailPanel, { childList: true, subtree: true });
}

initViewer();
