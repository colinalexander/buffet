import { debounce, formatShortDate, truncate, uniq } from "./core.js";
import { fetchRecordByPath, loadIndex } from "./data.js";
import { buildGovernanceSummary, outcomeLabel, OUTCOME_CONTEXT } from "./governance.js";
import { setActiveNav, wireOnboarding } from "./page.js";

let indexRecords = [];
let selectedMeta = null;
let compareMeta = null;
const selectedIds = new Set();

const els = {
  recordList: document.getElementById("record-list"),
  detailPanel: document.getElementById("record-detail"),
  rawLink: document.getElementById("raw-link"),
  detailOutcomeBadge: document.getElementById("detail-outcome-badge"),
  comparePrimary: document.getElementById("compare-primary"),
  compareSecondary: document.getElementById("compare-secondary"),
  compareSelect: document.getElementById("compare-select"),
  filterMandate: document.getElementById("filter-mandate"),
  filterProcedure: document.getElementById("filter-procedure"),
  filterOutcome: document.getElementById("filter-outcome"),
  filterFrom: document.getElementById("filter-from"),
  filterTo: document.getElementById("filter-to"),
  filterSearch: document.getElementById("filter-search"),
  filteredCount: document.getElementById("filtered-count"),
  selectedCount: document.getElementById("selected-count"),
  selectAll: document.getElementById("select-all"),
  clearSelection: document.getElementById("clear-selection"),
  exportCsv: document.getElementById("export-csv"),
  exportPdf: document.getElementById("export-pdf"),
  downloadAudit: document.getElementById("download-audit"),
  contextPanel: document.getElementById("context-panel"),
  rawJson: document.getElementById("raw-json"),
};

function option(label, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function buildFilters() {
  const mandates = uniq(indexRecords.map((r) => r.mandate_id));
  const procedures = uniq(indexRecords.map((r) => r.procedure_id));
  const outcomes = uniq(indexRecords.map((r) => r.outcome_type));

  els.filterMandate.replaceChildren(option("All mandates", ""), ...mandates.map((m) => option(m, m)));
  els.filterProcedure.replaceChildren(option("All procedures", ""), ...procedures.map((p) => option(p, p)));
  els.filterOutcome.replaceChildren(
    option("All judgment types", ""),
    ...outcomes.map((o) => option(outcomeLabel(o), o))
  );
}

function withinDateRange(record, fromDate, toDate) {
  if (!fromDate && !toDate) {
    return true;
  }
  const date = formatShortDate(record.timestamp);
  if (!date) {
    return true;
  }
  if (fromDate && date < fromDate) {
    return false;
  }
  if (toDate && date > toDate) {
    return false;
  }
  return true;
}

function matchesSearch(record, query) {
  if (!query) {
    return true;
  }
  const haystack = [
    record.record_id,
    record.timestamp,
    record.mandate_id,
    record.procedure_id,
    record.outcome_type,
    record.confidence_level,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function filteredRecords() {
  const fromDate = els.filterFrom.value;
  const toDate = els.filterTo.value;
  const query = els.filterSearch.value.trim();
  return indexRecords.filter((record) => {
    if (els.filterMandate.value && record.mandate_id !== els.filterMandate.value) {
      return false;
    }
    if (els.filterProcedure.value && record.procedure_id !== els.filterProcedure.value) {
      return false;
    }
    if (els.filterOutcome.value && record.outcome_type !== els.filterOutcome.value) {
      return false;
    }
    if (!withinDateRange(record, fromDate, toDate)) {
      return false;
    }
    if (!matchesSearch(record, query)) {
      return false;
    }
    return true;
  });
}

function updateCounts() {
  const filtered = filteredRecords();
  if (els.filteredCount) {
    els.filteredCount.textContent = String(filtered.length);
  }
  if (els.selectedCount) {
    els.selectedCount.textContent = String(selectedIds.size);
  }
}

function renderList() {
  els.recordList.replaceChildren();

  const items = filteredRecords();
  updateCounts();

  if (!items.length) {
    const empty = document.createElement("li");
    empty.textContent = "No records match the current filters.";
    els.recordList.appendChild(empty);
    return;
  }

  items.forEach((record) => {
    const li = document.createElement("li");
    li.className = selectedMeta && selectedMeta.record_id === record.record_id ? "active" : "";

    const row = document.createElement("div");
    row.className = "record-row";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "record-check";
    checkbox.checked = selectedIds.has(record.record_id);
    checkbox.setAttribute("aria-label", `Select record ${record.record_id}`);
    checkbox.addEventListener("click", (event) => event.stopPropagation());
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        selectedIds.add(record.record_id);
      } else {
        selectedIds.delete(record.record_id);
      }
      updateCounts();
    });

    const button = document.createElement("button");
    button.type = "button";
    button.className = "record-btn";
    button.addEventListener("click", () => selectRecord(record));

    const date = formatShortDate(record.timestamp);
    const confidence = record.confidence_level;
    const confidenceText =
      confidence === undefined || confidence === null ? "" : ` · confidence ${Number(confidence).toFixed(2)}`;

    button.innerHTML = `
      <div class="record-top">
        <strong>${record.mandate_id}</strong>
        <span class="badge ${record.outcome_type}">${record.outcome_type}</span>
      </div>
      <div class="meta">${record.procedure_id} · ${date}${confidenceText}</div>
    `;

    row.appendChild(checkbox);
    row.appendChild(button);
    li.appendChild(row);
    els.recordList.appendChild(li);
  });
}

function renderContext(outcomeType) {
  const ctx = OUTCOME_CONTEXT[outcomeType] || null;
  if (!ctx) {
    els.contextPanel.innerHTML = `
      <h2>Governance context</h2>
      <p class="muted">Select a record to view role-based interpretation guidance.</p>
    `;
    return;
  }

  els.contextPanel.innerHTML = `
    <h2>Governance context</h2>
    <div class="context-title">
      <span class="badge ${outcomeType}">${outcomeType}</span>
      <div class="context-heading">${ctx.title}</div>
    </div>
    <div class="context-section">
      <h3>Meaning</h3>
      <p>${ctx.governance_meaning}</p>
    </div>
    <div class="context-section">
      <h3>Why it matters</h3>
      <p>${ctx.why_it_matters}</p>
    </div>
    <div class="context-section">
      <h3>Who acts</h3>
      <ul>${(ctx.who_acts || []).map((role) => `<li>${role}</li>`).join("")}</ul>
    </div>
    <div class="context-section">
      <h3>Typical next steps</h3>
      <ol>${(ctx.typical_next_steps || []).map((line) => `<li>${line}</li>`).join("")}</ol>
    </div>
  `;
}

function renderDetail(data, recordPath, meta) {
  if (!data) {
    els.detailPanel.textContent = "Select a record.";
    els.rawLink.href = "#";
    els.detailOutcomeBadge.textContent = "";
    els.detailOutcomeBadge.className = "badge";
    els.detailOutcomeBadge.style.display = "none";
    els.rawJson.textContent = "";
    renderContext(null);
    return;
  }

  const summary = buildGovernanceSummary(meta, data);
  const outcomeType = summary.outcome_type || "unknown";

  els.detailOutcomeBadge.textContent = outcomeType;
  els.detailOutcomeBadge.className = `badge ${outcomeType}`;
  els.detailOutcomeBadge.style.display = "inline-flex";
  els.rawLink.href = recordPath || "#";

  const facts =
    summary.key_facts && summary.key_facts.length
      ? `<div class="fact-list">${summary.key_facts
          .map((fact) => `<span class="fact-chip">${fact}</span>`)
          .join("")}</div>`
      : "";

  const callout =
    outcomeType === "escalate"
      ? '<div class="callout"><strong>Human authority required.</strong> Automation is suspended until reviewed.</div>'
      : outcomeType === "recommend_adjustment"
        ? '<div class="callout callout-warn"><strong>Human review required.</strong> This viewer never executes trades.</div>'
        : '<div class="callout callout-ok"><strong>In policy.</strong> Record affirms alignment under documented authority.</div>';

  const authority = data.authority || {};

  els.detailPanel.innerHTML = `
    <section class="summary-card">
      <div class="summary-header">
        <div>
          <div class="summary-kicker">${summary.date} · ${authority.mandate_id} (v${authority.mandate_version})</div>
          <h3 class="summary-title">${summary.headline}</h3>
        </div>
        <div class="summary-badges">
          <span class="badge ${outcomeType}">${outcomeType}</span>
        </div>
      </div>
      <p class="summary-action">${summary.required_action}</p>
      ${summary.description ? `<p class="summary-desc">${summary.description}</p>` : ""}
      ${facts}
      ${callout}
      <div class="summary-why">
        <h4>Why this matters to governance</h4>
        <p>${summary.governance_why}</p>
      </div>
    </section>

    <section>
      <h4>Authority bindings</h4>
      <p>Mandate: <strong>${authority.mandate_id}</strong> (v${authority.mandate_version})</p>
      <p>Procedure: <strong>${authority.procedure_id}</strong> (${authority.procedure_version})</p>
    </section>

    <section>
      <h4>Invocation</h4>
      <p>Trigger: ${data.invocation?.trigger_type || "unknown"}</p>
      <p class="muted">${data.invocation?.trigger_description || ""}</p>
      ${data.invocation?.persistence_evidence ? `<p class="muted">Evidence: ${data.invocation.persistence_evidence}</p>` : ""}
    </section>

    <section>
      <h4>Confidence</h4>
      <p>${data.confidence?.level ?? "unknown"} (${data.confidence?.trend || "unknown"})</p>
      ${data.confidence?.attribution ? `<p class="muted">${truncate(data.confidence.attribution, 220)}</p>` : ""}
    </section>

    <section>
      <h4>Constraints</h4>
      <p>Hard breached: ${String(data.constraints?.hard_constraints_breached ?? "unknown")}</p>
      <p>At risk: ${Array.isArray(data.constraints?.constraints_at_risk) && data.constraints.constraints_at_risk.length
        ? data.constraints.constraints_at_risk.join(", ")
        : "none"}</p>
    </section>

    <section>
      <h4>Behavior</h4>
      <p>Escalated: ${String(data.behavior?.escalated ?? "unknown")}</p>
      <p>Inaction: ${String(data.behavior?.inaction ?? "unknown")}</p>
      <p>Decision latency: ${data.behavior?.decision_latency_ms ?? "unknown"} ms</p>
    </section>
  `;

  if (data.outcome?.type === "recommend_adjustment" && data.adjustment) {
    const changes = Array.isArray(data.adjustment.recommended_changes) ? data.adjustment.recommended_changes : [];
    els.detailPanel.innerHTML += `
      <section>
        <h4>Recommended changes</h4>
        ${
          changes.length
            ? `<ul class="change-list">${changes.map((c) => `<li>${c}</li>`).join("")}</ul>`
            : "<p class=\"muted\">None.</p>"
        }
      </section>
    `;
  }

  if (data.outcome?.type === "affirm_alignment" && data.inaction) {
    els.detailPanel.innerHTML += `
      <section>
        <h4>Inaction justification</h4>
        <p class="muted">${truncate(data.inaction.justification || "", 320)}</p>
      </section>
    `;
  }

  if (data.outcome?.type === "escalate" && data.escalation) {
    els.detailPanel.innerHTML += `
      <section>
        <h4>Escalation</h4>
        <p>${truncate(data.escalation.escalation_reason || "", 320)}</p>
        ${
          Array.isArray(data.escalation.human_authority_required) && data.escalation.human_authority_required.length
            ? `<p class="muted">Human authority required: ${data.escalation.human_authority_required.join(", ")}</p>`
            : ""
        }
      </section>
    `;
  }

  if (data._published_from || data._published_at) {
    els.detailPanel.innerHTML += `
      <section>
        <h4>Publication</h4>
        <p class="muted">Published from: ${data._published_from || "unknown"}</p>
        <p class="muted">Published at: ${data._published_at || "unknown"}</p>
      </section>
    `;
  }

  els.rawJson.textContent = JSON.stringify(data, null, 2);
  renderContext(outcomeType);
}

function compareSummary(data, meta) {
  if (!data || !meta) {
    return "<p class=\"muted\">Select a record.</p>";
  }
  const summary = buildGovernanceSummary(meta, data);
  return `
    <p><strong>${summary.mandate_id}</strong> · ${summary.procedure_id}</p>
    <p>Outcome: <span class="badge ${summary.outcome_type}">${summary.outcome_type}</span></p>
    <p class="muted">${summary.required_action}</p>
  `;
}

async function updateCompare() {
  const primary = selectedMeta ? await fetchRecordByPath(selectedMeta.path) : null;
  const secondary = compareMeta ? await fetchRecordByPath(compareMeta.path) : null;
  els.comparePrimary.innerHTML = compareSummary(primary, selectedMeta);
  els.compareSecondary.innerHTML = compareSummary(secondary, compareMeta);
}

async function selectRecord(recordMeta) {
  selectedMeta = recordMeta;
  const data = await fetchRecordByPath(recordMeta.path);
  renderDetail(data, recordMeta.path, recordMeta);
  renderList();
  updateCompare();

  const url = new URL(window.location.href);
  url.searchParams.set("record", recordMeta.record_id);
  window.history.replaceState({}, "", url);
}

function renderCompareOptions() {
  els.compareSelect.replaceChildren(option("None", ""));
  indexRecords.forEach((record) => {
    const label = `${record.mandate_id} · ${formatShortDate(record.timestamp)} · ${record.outcome_type}`;
    els.compareSelect.appendChild(option(label, record.record_id));
  });
}

function recordById(recordId) {
  return indexRecords.find((record) => record.record_id === recordId) || null;
}

function collectSelectedMetas() {
  const byId = new Map(indexRecords.map((r) => [r.record_id, r]));
  return Array.from(selectedIds)
    .map((id) => byId.get(id))
    .filter(Boolean);
}

async function exportCsvTimeline() {
  const { toCsv, downloadBlob } = await import("./core.js");
  const metas = collectSelectedMetas();
  if (!metas.length) {
    alert("Select one or more records to export.");
    return;
  }

  const rows = [
    ["timestamp", "date", "mandate_id", "procedure_id", "outcome_type", "confidence_level", "record_id", "path"],
    ...metas.map((m) => [
      m.timestamp,
      formatShortDate(m.timestamp),
      m.mandate_id,
      m.procedure_id,
      m.outcome_type,
      m.confidence_level ?? "",
      m.record_id,
      m.path,
    ]),
  ];
  const csv = toCsv(rows);
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), "mandateos_judgment_timeline.csv");
}

async function exportPdfSummaries() {
  const metas = collectSelectedMetas();
  if (!metas.length) {
    alert("Select one or more records to export.");
    return;
  }

  if (!window.jspdf?.jsPDF) {
    alert("PDF export library is not available. Use the Download page or refresh with network enabled.");
    return;
  }

  const doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
  const margin = 48;
  let y = margin;

  const writeLine = (text, { size = 12, bold = false } = {}) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, 612 - margin * 2);
    lines.forEach((line) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 4;
    });
  };

  writeLine("MandateOS — Judgment Record Summary Pack", { size: 16, bold: true });
  writeLine(`Generated: ${new Date().toISOString()}`, { size: 10 });
  y += 12;

  for (const meta of metas) {
    const data = await fetchRecordByPath(meta.path);
    const summary = buildGovernanceSummary(meta, data);

    writeLine(`${summary.headline}`, { size: 13, bold: true });
    writeLine(
      `${summary.date} · ${summary.mandate_id} · ${summary.procedure_id} · ${summary.outcome_type}`,
      { size: 10 }
    );
    writeLine(`Required action: ${summary.required_action}`, { size: 10 });
    if (summary.description) {
      writeLine(`Record description: ${summary.description}`, { size: 10 });
    }
    if (data?.escalation?.escalation_reason) {
      writeLine(`Escalation reason: ${truncate(data.escalation.escalation_reason, 260)}`, { size: 10 });
    }
    if (data?.adjustment?.recommended_changes?.length) {
      writeLine(`Recommended changes: ${data.adjustment.recommended_changes.join("; ")}`, { size: 10 });
    }
    y += 12;
  }

  doc.save("mandateos_judgment_summaries.pdf");
}

async function downloadAuditPackage() {
  const metas = collectSelectedMetas();
  if (!metas.length) {
    alert("Select one or more records to include in the audit package.");
    return;
  }

  if (!window.JSZip) {
    alert("Zip library is not available. Use the Download page or refresh with network enabled.");
    return;
  }

  const zip = new window.JSZip();
  const manifest = {
    generated_at: new Date().toISOString(),
    selected_record_ids: metas.map((m) => m.record_id),
    viewer_filters: {
      mandate_id: els.filterMandate.value || null,
      procedure_id: els.filterProcedure.value || null,
      outcome_type: els.filterOutcome.value || null,
      from_date: els.filterFrom.value || null,
      to_date: els.filterTo.value || null,
      search: els.filterSearch.value.trim() || null,
    },
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  const recordsFolder = zip.folder("records");
  const authorityRefs = {
    mandates: new Map(),
    procedures: new Map(),
  };
  for (const meta of metas) {
    const data = await fetchRecordByPath(meta.path);
    recordsFolder.file(`${meta.record_id}.json`, JSON.stringify(data, null, 2));
    const authority = data?.authority || {};
    if (authority.mandate_id && authority.mandate_version) {
      authorityRefs.mandates.set(`${authority.mandate_id}@@${authority.mandate_version}`, {
        mandate_id: authority.mandate_id,
        version: String(authority.mandate_version),
      });
    }
    if (authority.procedure_id && authority.procedure_version) {
      authorityRefs.procedures.set(`${authority.procedure_id}@@${authority.procedure_version}`, {
        procedure_id: authority.procedure_id,
        version: String(authority.procedure_version),
      });
    }
  }

  try {
    const glossaryResponse = await fetch("data/glossary.json", { cache: "no-store" });
    if (glossaryResponse.ok) {
      const glossary = await glossaryResponse.json();
      zip.file("glossary.json", JSON.stringify(glossary, null, 2));
    }
  } catch {
    // ignore
  }

  try {
    const sourcesResponse = await fetch("data/authority_sources.json", { cache: "no-store" });
    if (sourcesResponse.ok) {
      const sources = await sourcesResponse.json();
      zip.file("authority_sources.json", JSON.stringify(sources, null, 2));

      const fetchTextOrNull = async (url) => {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (!response.ok) {
            return null;
          }
          return await response.text();
        } catch {
          return null;
        }
      };

      const attachmentsReadme = [];
      for (const ref of authorityRefs.mandates.values()) {
        const entry =
          sources.mandates?.find((m) => m.mandate_id === ref.mandate_id && m.version === ref.version) ||
          sources.mandates?.find((m) => m.mandate_id === ref.mandate_id);
        if (!entry?.published_path) {
          attachmentsReadme.push(`Missing mandate attachment: ${ref.mandate_id} v${ref.version}`);
          continue;
        }
        const content = await fetchTextOrNull(entry.published_path);
        if (content === null) {
          attachmentsReadme.push(`Failed to fetch mandate attachment: ${entry.published_path}`);
          continue;
        }
        zip.file(`attachments/mandates/${entry.mandate_id}/${entry.version}/mandate.yaml`, content);
      }

      for (const ref of authorityRefs.procedures.values()) {
        const entry =
          sources.procedures?.find((p) => p.procedure_id === ref.procedure_id && p.version === ref.version) ||
          sources.procedures?.find((p) => p.procedure_id === ref.procedure_id);
        if (!entry?.published_path) {
          attachmentsReadme.push(`Missing procedure attachment: ${ref.procedure_id} ${ref.version}`);
          continue;
        }
        const content = await fetchTextOrNull(entry.published_path);
        if (content === null) {
          attachmentsReadme.push(`Failed to fetch procedure attachment: ${entry.published_path}`);
          continue;
        }
        zip.file(`attachments/procedures/${entry.procedure_id}/${entry.version}/procedure.md`, content);
        if (entry.thresholds_published_path) {
          const thresholds = await fetchTextOrNull(entry.thresholds_published_path);
          if (thresholds !== null) {
            zip.file(`attachments/procedures/${entry.procedure_id}/${entry.version}/thresholds.yaml`, thresholds);
          }
        }
      }

      if (attachmentsReadme.length) {
        zip.file("attachments/README.txt", attachmentsReadme.join("\n"));
      }
    }
  } catch {
    // ignore
  }

  zip.file(
    "README.txt",
    [
      "MandateOS audit package",
      "",
      "Contents:",
      "- manifest.json: generation metadata + selection criteria",
      "- records/: selected Judgment Records as JSON",
      "- glossary.json: term definitions and interpretation guidance (if available)",
      "- authority_sources.json: mapping to mandate/procedure attachments (if available)",
      "",
      "Note: This package contains audit artifacts only; it does not represent trades or execution.",
    ].join("\n")
  );

  const blob = await zip.generateAsync({ type: "blob" });
  const { downloadBlob } = await import("./core.js");
  downloadBlob(blob, "mandateos_audit_package.zip");
}

function wireSelectionActions() {
  if (els.selectAll) {
    els.selectAll.addEventListener("click", () => {
      filteredRecords().forEach((r) => selectedIds.add(r.record_id));
      renderList();
      updateCounts();
    });
  }
  if (els.clearSelection) {
    els.clearSelection.addEventListener("click", () => {
      selectedIds.clear();
      renderList();
      updateCounts();
    });
  }
}

function wireExportActions() {
  if (els.exportCsv) {
    els.exportCsv.addEventListener("click", exportCsvTimeline);
  }
  if (els.exportPdf) {
    els.exportPdf.addEventListener("click", exportPdfSummaries);
  }
  if (els.downloadAudit) {
    els.downloadAudit.addEventListener("click", downloadAuditPackage);
  }
}

function wireFilters() {
  const onChange = () => renderList();
  els.filterMandate.addEventListener("change", onChange);
  els.filterProcedure.addEventListener("change", onChange);
  els.filterOutcome.addEventListener("change", onChange);
  els.filterFrom.addEventListener("change", onChange);
  els.filterTo.addEventListener("change", onChange);
  els.filterSearch.addEventListener(
    "input",
    debounce(() => renderList(), 180)
  );
}

function applyRecordFromUrl() {
  const url = new URL(window.location.href);
  const recordId = url.searchParams.get("record");
  if (!recordId) {
    return false;
  }
  const meta = recordById(recordId);
  if (meta) {
    selectRecord(meta);
    return true;
  }
  return false;
}

export async function initViewer() {
  setActiveNav();
  wireOnboarding();

  const index = await loadIndex();
  indexRecords = index.records || [];

  buildFilters();
  renderCompareOptions();
  renderList();
  wireFilters();
  wireSelectionActions();
  wireExportActions();

  els.compareSelect.addEventListener("change", () => {
    compareMeta = recordById(els.compareSelect.value);
    updateCompare();
  });

  if (applyRecordFromUrl()) {
    return;
  }

  const first = indexRecords[0];
  if (first) {
    selectRecord(first);
  } else {
    renderDetail(null, null, null);
  }
}
