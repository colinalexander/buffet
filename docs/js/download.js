import { debounce, downloadBlob, formatShortDate, toCsv, uniq } from "./core.js";
import { fetchRecordByPath, loadIndex } from "./data.js";
import { buildGovernanceSummary, outcomeLabel } from "./governance.js";
import { setActiveNav, wireOnboarding } from "./page.js";

const els = {
  visible: document.getElementById("dl-visible"),
  selected: document.getElementById("dl-selected"),
  selectAll: document.getElementById("dl-select-all"),
  clear: document.getElementById("dl-clear"),
  search: document.getElementById("dl-search"),
  mandate: document.getElementById("dl-mandate"),
  procedure: document.getElementById("dl-procedure"),
  outcome: document.getElementById("dl-outcome"),
  from: document.getElementById("dl-from"),
  to: document.getElementById("dl-to"),
  rows: document.getElementById("dl-rows"),
  csvFiltered: document.getElementById("dl-csv-filtered"),
  csvSelected: document.getElementById("dl-csv-selected"),
  pdfSelected: document.getElementById("dl-pdf-selected"),
  audit: document.getElementById("dl-audit"),
  attachments: document.getElementById("dl-attachments"),
  status: document.getElementById("dl-status"),
};

let indexRecords = [];
const selectedIds = new Set();

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
  els.mandate.replaceChildren(option("All mandates", ""), ...mandates.map((m) => option(m, m)));
  els.procedure.replaceChildren(option("All procedures", ""), ...procedures.map((p) => option(p, p)));
  els.outcome.replaceChildren(
    option("All judgment types", ""),
    ...outcomes.map((o) => option(outcomeLabel(o), o))
  );
}

function withinDateRange(record, fromDate, toDate) {
  if (!fromDate && !toDate) return true;
  const date = formatShortDate(record.timestamp);
  if (!date) return true;
  if (fromDate && date < fromDate) return false;
  if (toDate && date > toDate) return false;
  return true;
}

function matchesSearch(record, query) {
  if (!query) return true;
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
  const query = els.search.value.trim();
  const fromDate = els.from.value;
  const toDate = els.to.value;

  return indexRecords.filter((record) => {
    if (els.mandate.value && record.mandate_id !== els.mandate.value) return false;
    if (els.procedure.value && record.procedure_id !== els.procedure.value) return false;
    if (els.outcome.value && record.outcome_type !== els.outcome.value) return false;
    if (!withinDateRange(record, fromDate, toDate)) return false;
    if (!matchesSearch(record, query)) return false;
    return true;
  });
}

function updateCounts(visible) {
  els.visible.textContent = String(visible.length);
  els.selected.textContent = String(selectedIds.size);
}

function renderRows() {
  const visible = filteredRecords();
  updateCounts(visible);
  els.rows.replaceChildren();

  if (!visible.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="muted">No records match the current filters.</td>`;
    els.rows.appendChild(tr);
    return;
  }

  visible.slice(0, 200).forEach((r) => {
    const tr = document.createElement("tr");
    const checked = selectedIds.has(r.record_id);
    tr.innerHTML = `
      <td><input type="checkbox" ${checked ? "checked" : ""} aria-label="Select record ${r.record_id}" /></td>
      <td>${formatShortDate(r.timestamp)}</td>
      <td>${r.mandate_id}</td>
      <td>${r.procedure_id}</td>
      <td><span class="badge ${r.outcome_type}">${r.outcome_type}</span></td>
      <td><a class="link" href="./index.html?record=${encodeURIComponent(r.record_id)}">Open</a></td>
    `;
    const checkbox = tr.querySelector("input[type=checkbox]");
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedIds.add(r.record_id);
      else selectedIds.delete(r.record_id);
      updateCounts(visible);
    });
    els.rows.appendChild(tr);
  });
}

function metasByIds(ids) {
  const byId = new Map(indexRecords.map((r) => [r.record_id, r]));
  return Array.from(ids)
    .map((id) => byId.get(id))
    .filter(Boolean);
}

function buildCsvRows(metas) {
  return [
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
}

function setStatus(message) {
  if (els.status) {
    els.status.textContent = message;
  }
}

function requireSelection() {
  if (!selectedIds.size) {
    alert("Select one or more records first.");
    return false;
  }
  return true;
}

function exportCsv(metas, filename) {
  const csv = toCsv(buildCsvRows(metas));
  downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), filename);
}

async function exportSelectedPdf() {
  if (!requireSelection()) return;
  if (!window.jspdf?.jsPDF) {
    alert("PDF export library is not available.");
    return;
  }

  const metas = metasByIds(selectedIds);
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

  writeLine("MandateOS — Judgment Summary Packet", { size: 16, bold: true });
  writeLine(`Generated: ${new Date().toISOString()}`, { size: 10 });
  y += 12;

  for (const meta of metas) {
    const data = await fetchRecordByPath(meta.path);
    const summary = buildGovernanceSummary(meta, data);
    writeLine(summary.headline, { size: 13, bold: true });
    writeLine(
      `${summary.date} · ${summary.mandate_id} · ${summary.procedure_id} · ${summary.outcome_type}`,
      { size: 10 }
    );
    writeLine(`Required action: ${summary.required_action}`, { size: 10 });
    if (summary.description) {
      writeLine(`Record description: ${summary.description}`, { size: 10 });
    }
    if (data?.escalation?.escalation_reason) {
      writeLine(`Escalation reason: ${String(data.escalation.escalation_reason)}`, { size: 10 });
    }
    if (data?.adjustment?.recommended_changes?.length) {
      writeLine(`Recommended changes: ${data.adjustment.recommended_changes.join("; ")}`, { size: 10 });
    }
    y += 12;
  }

  doc.save("mandateos_judgment_summaries.pdf");
}

async function fetchTextOrNull(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return await response.text();
}

async function fetchJsonOrNull(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;
  return await response.json();
}

async function addAuthorityAttachments(zip, metas) {
  const sources = await fetchJsonOrNull("data/authority_sources.json");
  if (!sources) {
    zip.file(
      "attachments/README.txt",
      "Authority attachments are not available. Re-run `make pages` to publish them, or inspect mandates/ and judgment_loops/ in the repo."
    );
    return;
  }

  zip.file("authority_sources.json", JSON.stringify(sources, null, 2));
  const uniqueMandates = new Set(metas.map((m) => `${m.mandate_id}@@${m.mandate_version || ""}`));
  const uniqueProcedures = new Set(metas.map((m) => `${m.procedure_id}@@${m.procedure_version || ""}`));

  for (const key of uniqueMandates) {
    const [mandateId, version] = key.split("@@");
    const entry = sources.mandates?.find((m) => m.mandate_id === mandateId && (!version || m.version === version));
    if (!entry?.published_path) continue;
    const content = await fetchTextOrNull(entry.published_path);
    if (content !== null) {
      zip.file(`attachments/mandates/${mandateId}/${entry.version}/mandate.yaml`, content);
    }
  }

  for (const key of uniqueProcedures) {
    const [procedureId, version] = key.split("@@");
    const entry = sources.procedures?.find(
      (p) => p.procedure_id === procedureId && (!version || p.version === version)
    );
    if (!entry?.published_path) continue;
    const content = await fetchTextOrNull(entry.published_path);
    if (content !== null) {
      zip.file(`attachments/procedures/${procedureId}/${entry.version}/procedure.md`, content);
    }
  }
}

async function downloadAuditPackage() {
  if (!requireSelection()) return;
  if (!window.JSZip) {
    alert("Zip export library is not available.");
    return;
  }

  const metas = metasByIds(selectedIds);
  const zip = new window.JSZip();

  setStatus("Building audit package…");

  const manifest = {
    generated_at: new Date().toISOString(),
    selected_record_ids: metas.map((m) => m.record_id),
    selection_basis: {
      mandate_id: els.mandate.value || null,
      procedure_id: els.procedure.value || null,
      outcome_type: els.outcome.value || null,
      from_date: els.from.value || null,
      to_date: els.to.value || null,
      search: els.search.value.trim() || null,
    },
  };
  zip.file("manifest.json", JSON.stringify(manifest, null, 2));

  const recordsFolder = zip.folder("records");
  for (const meta of metas) {
    const data = await fetchRecordByPath(meta.path);
    recordsFolder.file(`${meta.record_id}.json`, JSON.stringify(data, null, 2));
  }

  const glossary = await fetchJsonOrNull("data/glossary.json");
  if (glossary) {
    zip.file("glossary.json", JSON.stringify(glossary, null, 2));
  }

  const csv = toCsv(buildCsvRows(metas));
  zip.file("exports/judgment_timeline.csv", csv);

  const includeAttachments = els.attachments.value === "include";
  if (includeAttachments) {
    setStatus("Fetching authority attachments…");
    await addAuthorityAttachments(zip, metas);
  }

  setStatus("Finalizing zip…");
  zip.file(
    "README.txt",
    [
      "MandateOS audit package",
      "",
      "Included:",
      "- manifest.json (generation metadata + selection basis)",
      "- records/ (selected Judgment Records as JSON)",
      "- exports/judgment_timeline.csv (timeline CSV for the selection)",
      "- glossary.json (definitions + interpretation guidance, if published)",
      "- attachments/ (mandate + procedure sources, if published)",
      "",
      "Note: MandateOS produces audit artifacts only; it does not place trades or execute portfolio actions.",
    ].join("\n")
  );

  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, "mandateos_audit_package.zip");
  setStatus("Downloaded.");
}

function wireActions() {
  const rerender = debounce(() => renderRows(), 160);
  els.search.addEventListener("input", rerender);
  els.mandate.addEventListener("change", rerender);
  els.procedure.addEventListener("change", rerender);
  els.outcome.addEventListener("change", rerender);
  els.from.addEventListener("change", rerender);
  els.to.addEventListener("change", rerender);

  els.selectAll.addEventListener("click", () => {
    filteredRecords().forEach((r) => selectedIds.add(r.record_id));
    renderRows();
  });
  els.clear.addEventListener("click", () => {
    selectedIds.clear();
    renderRows();
  });

  els.csvFiltered.addEventListener("click", () => exportCsv(filteredRecords(), "mandateos_filtered_timeline.csv"));
  els.csvSelected.addEventListener("click", () => {
    if (!requireSelection()) return;
    exportCsv(metasByIds(selectedIds), "mandateos_selected_timeline.csv");
  });
  els.pdfSelected.addEventListener("click", exportSelectedPdf);
  els.audit.addEventListener("click", downloadAuditPackage);
}

async function init() {
  setActiveNav();
  wireOnboarding({ autoOpen: false });

  const index = await loadIndex();
  indexRecords = index.records || [];
  buildFilters();
  wireActions();
  renderRows();
  setStatus("");
}

init();

