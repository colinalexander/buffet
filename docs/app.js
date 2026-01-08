const indexUrl = "data/index.json";

let records = [];
let recordCache = new Map();
let selectedRecord = null;
let compareRecord = null;

const recordList = document.getElementById("record-list");
const detailPanel = document.getElementById("record-detail");
const rawLink = document.getElementById("raw-link");
const detailOutcomeBadge = document.getElementById("detail-outcome-badge");
const comparePrimary = document.getElementById("compare-primary");
const compareSecondary = document.getElementById("compare-secondary");
const compareSelect = document.getElementById("compare-select");

const filterMandate = document.getElementById("filter-mandate");
const filterProcedure = document.getElementById("filter-procedure");
const filterOutcome = document.getElementById("filter-outcome");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function uniq(values) {
  return Array.from(new Set(values)).sort();
}

function option(label, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function buildFilters() {
  const mandates = uniq(records.map((r) => r.mandate_id));
  const procedures = uniq(records.map((r) => r.procedure_id));
  const outcomes = uniq(records.map((r) => r.outcome_type));

  filterMandate.replaceChildren(option("All", ""), ...mandates.map((m) => option(m, m)));
  filterProcedure.replaceChildren(option("All", ""), ...procedures.map((p) => option(p, p)));
  filterOutcome.replaceChildren(option("All", ""), ...outcomes.map((o) => option(o, o)));
}

function filteredRecords() {
  return records.filter((record) => {
    if (filterMandate.value && record.mandate_id !== filterMandate.value) {
      return false;
    }
    if (filterProcedure.value && record.procedure_id !== filterProcedure.value) {
      return false;
    }
    if (filterOutcome.value && record.outcome_type !== filterOutcome.value) {
      return false;
    }
    return true;
  });
}

function truncate(value, maxLength) {
  const text = String(value);
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

function formatRecommendedChanges(changes) {
  if (!Array.isArray(changes) || changes.length === 0) {
    return "<p>None</p>";
  }
  const items = changes.map((change) => {
    if (typeof change === "string") {
      return `<li>${escapeHtml(change)}</li>`;
    }
    if (change && typeof change === "object") {
      const action =
        change.action ||
        change.type ||
        change.recommendation ||
        change.change ||
        "Adjustment";
      const magnitude =
        change.magnitude ||
        change.delta ||
        change.amount ||
        change.target ||
        "";
      const summary = `${action} ${magnitude}`.trim();
      const rationale = change.rationale || change.note || "";
      const note = rationale
        ? `<div class="change-note">${escapeHtml(truncate(rationale, 120))}</div>`
        : "";
      return `<li>${escapeHtml(summary)}${note}</li>`;
    }
    return "<li>Unspecified adjustment</li>";
  });
  return `<ul class="change-list">${items.join("")}</ul>`;
}

function renderList() {
  recordList.replaceChildren();
  const items = filteredRecords();
  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "No records match filters.";
    recordList.appendChild(empty);
    return;
  }
  items.forEach((record) => {
    const li = document.createElement("li");
    li.className = selectedRecord && selectedRecord.record_id === record.record_id ? "active" : "";
    li.innerHTML = `
      <div>
        <strong>${record.mandate_id}</strong>
        <span class="badge ${record.outcome_type}">${record.outcome_type}</span>
      </div>
      <span class="meta">${record.procedure_id} · ${record.timestamp}</span>
    `;
    li.addEventListener("click", () => selectRecord(record));
    recordList.appendChild(li);
  });
}

async function fetchRecord(record) {
  if (recordCache.has(record.path)) {
    return recordCache.get(record.path);
  }
  const response = await fetch(record.path);
  const data = await response.json();
  recordCache.set(record.path, data);
  return data;
}

function renderDetail(data, recordPath) {
  if (!data) {
    detailPanel.textContent = "Select a record.";
    rawLink.href = "#";
    detailOutcomeBadge.textContent = "";
    detailOutcomeBadge.className = "badge";
    detailOutcomeBadge.style.display = "none";
    return;
  }
  const outcomeType = data.outcome.type || "unknown";
  detailOutcomeBadge.textContent = outcomeType;
  detailOutcomeBadge.className = `badge ${outcomeType}`;
  detailOutcomeBadge.style.display = "inline-flex";
  rawLink.href = recordPath || "#";
  detailPanel.innerHTML = `
    <section>
      <h4>Authority</h4>
      <p>Mandate: ${escapeHtml(data.authority.mandate_id)} (v${escapeHtml(
        data.authority.mandate_version
      )})</p>
      <p>Procedure: ${escapeHtml(data.authority.procedure_id)} (${escapeHtml(
        data.authority.procedure_version
      )})</p>
    </section>
    <section>
      <h4>Invocation</h4>
      <p>Trigger: ${escapeHtml(data.invocation.trigger_type)}</p>
      <p>${escapeHtml(data.invocation.trigger_description)}</p>
    </section>
    <section>
      <h4>Outcome</h4>
      <p><span class="badge ${escapeHtml(data.outcome.type)}">${escapeHtml(
        data.outcome.type
      )}</span></p>
      <p>${escapeHtml(data.outcome.description)}</p>
    </section>
    <section>
      <h4>Confidence</h4>
      <p>${escapeHtml(data.confidence.level)} (${escapeHtml(data.confidence.trend)})</p>
    </section>
    <section>
      <h4>Constraints</h4>
      <p>Hard breached: ${escapeHtml(data.constraints.hard_constraints_breached)}</p>
      <p>At risk: ${escapeHtml(
        (data.constraints.constraints_at_risk || []).join(", ") || "none"
      )}</p>
    </section>
    <section>
      <h4>Behavior</h4>
      <p>Inaction: ${escapeHtml(data.behavior.inaction)}</p>
      <p>Escalated: ${escapeHtml(data.behavior.escalated)}</p>
      <p>Decision latency: ${escapeHtml(data.behavior.decision_latency_ms)} ms</p>
    </section>
  `;

  if (data._published_from || data._published_at) {
    detailPanel.innerHTML += `
      <section>
        <h4>Publication</h4>
        <p>Published from: ${escapeHtml(data._published_from || "unknown")}</p>
        <p>Published at: ${escapeHtml(data._published_at || "unknown")}</p>
      </section>
    `;
  }

  if (data.outcome.type === "recommend_adjustment" && data.adjustment) {
    detailPanel.innerHTML += `
      <section>
        <h4>Recommended Changes</h4>
        ${formatRecommendedChanges(data.adjustment.recommended_changes)}
      </section>
    `;
  }

  if (data.outcome.type === "affirm_alignment" && data.inaction) {
    detailPanel.innerHTML += `
      <section>
        <h4>Inaction Justification</h4>
        <p>${escapeHtml(data.inaction.justification)}</p>
      </section>
    `;
  }

  if (data.outcome.type === "escalate" && data.escalation) {
    detailPanel.innerHTML += `
      <section>
        <h4>Escalation</h4>
        <p>${escapeHtml(data.escalation.escalation_reason)}</p>
      </section>
    `;
  }
}

function compareSummary(data) {
  if (!data) {
    return "<p>Select a record.</p>";
  }
  return `
    <p><strong>${data.authority.mandate_id}</strong></p>
    <p>Outcome: <span class="badge ${data.outcome.type}">${data.outcome.type}</span></p>
    <p>Procedure: ${data.authority.procedure_id}</p>
    <p>Confidence: ${data.confidence.level}</p>
    <p>Escalated: ${data.behavior.escalated}</p>
    <p>Inaction: ${data.behavior.inaction}</p>
  `;
}

async function updateCompare() {
  const primary = selectedRecord ? await fetchRecord(selectedRecord) : null;
  const secondary = compareRecord ? await fetchRecord(compareRecord) : null;
  comparePrimary.innerHTML = compareSummary(primary);
  compareSecondary.innerHTML = compareSummary(secondary);
}

async function selectRecord(record) {
  selectedRecord = record;
  const data = await fetchRecord(record);
  renderDetail(data, record.path);
  renderList();
  updateCompare();
}

function renderCompareOptions() {
  compareSelect.replaceChildren(option("None", ""));
  records.forEach((record) => {
    const opt = option(`${record.mandate_id} · ${record.timestamp}`, record.record_id);
    compareSelect.appendChild(opt);
  });
}

function recordById(recordId) {
  return records.find((record) => record.record_id === recordId);
}

async function init() {
  const response = await fetch(indexUrl);
  const data = await response.json();
  records = data.records || [];
  records.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  buildFilters();
  renderCompareOptions();
  renderList();

  const first = records[0];
  if (first) {
    selectRecord(first);
  }
}

filterMandate.addEventListener("change", () => {
  renderList();
});
filterProcedure.addEventListener("change", () => {
  renderList();
});
filterOutcome.addEventListener("change", () => {
  renderList();
});
compareSelect.addEventListener("change", () => {
  compareRecord = recordById(compareSelect.value);
  updateCompare();
});

init();
