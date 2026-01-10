import { debounce, groupBy, uniq } from "./core.js";
import { loadIndex } from "./data.js";
import { outcomeLabel } from "./governance.js";
import { setActiveNav, wireOnboarding } from "./page.js";
import { openMandateViewer } from "../mandate_viewer.js";

const els = {
  tileTotal: document.getElementById("tile-total"),
  tileEscalations: document.getElementById("tile-escalations"),
  tileMandates: document.getElementById("tile-mandates"),
  tileProcedures: document.getElementById("tile-procedures"),
  chartEscMandate: document.getElementById("chart-escalations-mandate"),
  chartEscMandateFallback: document.getElementById("chart-escalations-mandate-fallback"),
  chartTrend: document.getElementById("chart-trend"),
  chartTrendFallback: document.getElementById("chart-trend-fallback"),
  tableProcedures: document.getElementById("table-procedures"),
  tableProceduresFallback: document.getElementById("table-procedures-fallback"),
};

let indexRecords = [];
let chartEscMandate = null;
let chartTrend = null;

function integerStep(maxValue, targetTicks = 6) {
  const max = Number.isFinite(maxValue) ? Math.max(0, maxValue) : 0;
  const steps = Math.max(2, targetTicks);
  return Math.max(1, Math.ceil(max / (steps - 1)));
}

function destroyCharts() {
  if (chartEscMandate) chartEscMandate.destroy();
  if (chartTrend) chartTrend.destroy();
  chartEscMandate = null;
  chartTrend = null;
}

function renderTiles(records) {
  const total = records.length;
  const escalations = records.filter((r) => r.outcome_type === "escalate").length;
  const mandates = uniq(records.map((r) => r.mandate_id)).length;
  const procedures = uniq(records.map((r) => r.procedure_id)).length;

  els.tileTotal.textContent = String(total);
  els.tileEscalations.textContent = String(escalations);
  els.tileMandates.textContent = String(mandates);
  els.tileProcedures.textContent = String(procedures);
}

function renderEscalationsByMandate(records) {
  const escalations = records.filter((r) => r.outcome_type === "escalate");
  const byMandate = groupBy(escalations, (r) => r.mandate_id);
  const rows = Array.from(byMandate.entries()).map(([mandateId, items]) => ({
    mandateId,
    count: items.length,
  }));
  rows.sort((a, b) => b.count - a.count || a.mandateId.localeCompare(b.mandateId));
  const maxCount = rows.length ? rows[0].count : 0;
  const stepSize = integerStep(maxCount);
  const suggestedMax = Math.max(stepSize, Math.ceil(maxCount / stepSize) * stepSize);

  if (!rows.length || !window.Chart) {
    els.chartEscMandateFallback.hidden = false;
    els.chartEscMandate.setAttribute("hidden", "hidden");
    return;
  }

  els.chartEscMandateFallback.hidden = true;
  els.chartEscMandate.removeAttribute("hidden");

  chartEscMandate = new window.Chart(els.chartEscMandate, {
    type: "bar",
    data: {
      labels: rows.map((r) => r.mandateId),
      datasets: [
        {
          label: "Escalation count",
          data: rows.map((r) => r.count),
          backgroundColor: "rgba(247, 118, 142, 0.34)",
          borderColor: "rgba(247, 118, 142, 0.85)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      onClick: (event) => {
        const hits = chartEscMandate.getElementsAtEventForMode(event, "nearest", { intersect: true }, true);
        if (!hits.length) return;
        const idx = hits[0].index;
        const mandateId = chartEscMandate.data.labels?.[idx];
        if (mandateId) openMandateViewer(String(mandateId));
      },
      scales: {
        x: { ticks: { color: "#9aa3b2" }, grid: { color: "rgba(38, 43, 54, 0.7)" } },
        y: {
          ticks: { color: "#9aa3b2", stepSize, precision: 0 },
          grid: { color: "rgba(38, 43, 54, 0.7)" },
          beginAtZero: true,
          suggestedMax,
        },
      },
      plugins: {
        legend: { labels: { color: "#e6e9ef" } },
        tooltip: {
          callbacks: {
            afterBody: () => [
              "Governance meaning:",
              "Escalate = authority boundary reached; human review may be required.",
              "Read-only governance viewer. No actions or trades are executed here.",
            ],
          },
        },
      },
    },
  });
}

function weekBucket(isoTimestamp) {
  const d = parseTimestamp(isoTimestamp);
  if (!d) return null;
  const utc = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = utc.getUTCDay(); // 0..6 (Sun..Sat)
  const diffToMonday = (day + 6) % 7; // 0 if Monday
  utc.setUTCDate(utc.getUTCDate() - diffToMonday);
  return utc.toISOString().slice(0, 10);
}

function renderTrend(records) {
  const buckets = new Map();
  records.forEach((r) => {
    const bucket = weekBucket(r.timestamp);
    if (!bucket) return;
    if (!buckets.has(bucket)) {
      buckets.set(bucket, { affirm_alignment: 0, recommend_adjustment: 0, escalate: 0 });
    }
    const row = buckets.get(bucket);
    if (row[r.outcome_type] !== undefined) {
      row[r.outcome_type] += 1;
    }
  });

  const labels = Array.from(buckets.keys()).sort();
  const series = (outcomeType) => labels.map((label) => buckets.get(label)?.[outcomeType] || 0);
  const maxStacked = labels.length
    ? Math.max(
        ...labels.map((label) => {
          const row = buckets.get(label);
          return (row?.affirm_alignment || 0) + (row?.recommend_adjustment || 0) + (row?.escalate || 0);
        })
      )
    : 0;
  const stepSize = integerStep(maxStacked);
  const suggestedMax = Math.max(stepSize, Math.ceil(maxStacked / stepSize) * stepSize);

  if (!labels.length || !window.Chart) {
    els.chartTrendFallback.hidden = false;
    els.chartTrend.setAttribute("hidden", "hidden");
    return;
  }

  els.chartTrendFallback.hidden = true;
  els.chartTrend.removeAttribute("hidden");

  chartTrend = new window.Chart(els.chartTrend, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: outcomeLabel("affirm_alignment"),
          data: series("affirm_alignment"),
          backgroundColor: "rgba(139, 213, 202, 0.4)",
          borderColor: "rgba(139, 213, 202, 0.8)",
          borderWidth: 1,
          stack: "counts",
        },
        {
          label: outcomeLabel("recommend_adjustment"),
          data: series("recommend_adjustment"),
          backgroundColor: "rgba(245, 197, 66, 0.4)",
          borderColor: "rgba(245, 197, 66, 0.8)",
          borderWidth: 1,
          stack: "counts",
        },
        {
          label: outcomeLabel("escalate"),
          data: series("escalate"),
          backgroundColor: "rgba(247, 118, 142, 0.32)",
          borderColor: "rgba(247, 118, 142, 0.85)",
          borderWidth: 1,
          stack: "counts",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: true, ticks: { color: "#9aa3b2" }, grid: { color: "rgba(38, 43, 54, 0.7)" } },
        y: {
          stacked: true,
          ticks: { color: "#9aa3b2", stepSize, precision: 0 },
          grid: { color: "rgba(38, 43, 54, 0.7)" },
          beginAtZero: true,
          suggestedMax,
        },
      },
      plugins: {
        legend: { labels: { color: "#e6e9ef" } },
        tooltip: {
          callbacks: {
            afterBody: () => [
              "Interpretation:",
              "This chart shows procedural activity density only.",
              "Escalate indicates human authority may be required.",
            ],
          },
        },
      },
    },
  });
}

function renderProceduresTable(records) {
  els.tableProcedures.replaceChildren();
  const byProcedure = groupBy(records, (r) => r.procedure_id);
  const rows = Array.from(byProcedure.entries()).map(([procedureId, items]) => ({
    procedureId,
    total: items.length,
    escalations: items.filter((r) => r.outcome_type === "escalate").length,
  }));
  rows.sort((a, b) => b.total - a.total || b.escalations - a.escalations || a.procedureId.localeCompare(b.procedureId));

  if (!rows.length) {
    els.tableProceduresFallback.hidden = false;
    return;
  }
  els.tableProceduresFallback.hidden = true;

  rows.slice(0, 12).forEach((row) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.procedureId}</td>
      <td>${row.total}</td>
      <td><span class="badge escalate">${row.escalations}</span></td>
    `;
    els.tableProcedures.appendChild(tr);
  });
}

function renderAll() {
  destroyCharts();
  renderTiles(indexRecords);
  renderEscalationsByMandate(indexRecords);
  renderTrend(indexRecords);
  renderProceduresTable(indexRecords);
}

async function init() {
  setActiveNav();
  wireOnboarding({ autoOpen: false });

  const index = await loadIndex();
  indexRecords = index.records || [];

  window.addEventListener("resize", debounce(() => renderAll(), 200));

  renderAll();
}

init();
