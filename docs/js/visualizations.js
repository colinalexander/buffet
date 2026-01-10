import { debounce, formatShortDate, groupBy, sum, uniq } from "./core.js";
import { fetchRecordByPath, loadIndex } from "./data.js";
import { outcomeLabel, OUTCOME_CONTEXT } from "./governance.js";
import { setActiveNav, wireOnboarding } from "./page.js";
import { openMandateViewer } from "../mandate_viewer.js";

const els = {
  count: document.getElementById("viz-count"),
  reset: document.getElementById("viz-reset"),
  search: document.getElementById("viz-search"),
  mandate: document.getElementById("viz-mandate"),
  procedure: document.getElementById("viz-procedure"),
  outcome: document.getElementById("viz-outcome"),
  from: document.getElementById("viz-from"),
  to: document.getElementById("viz-to"),
  timeline: document.getElementById("timeline-chart"),
  escMandate: document.getElementById("escalations-mandate"),
  escProcedure: document.getElementById("escalations-procedure"),
  heatmap: document.getElementById("heatmap"),
  heatmapMetric: document.getElementById("heatmap-metric"),
  drillCaption: document.getElementById("drilldown-caption"),
  drillRows: document.getElementById("drilldown-rows"),
};

let indexRecords = [];
let timelineChart = null;
let mandateChart = null;
let procedureChart = null;

const escalationSeverityCache = new Map();

function integerStep(maxValue, targetTicks = 6) {
  const max = Number.isFinite(maxValue) ? Math.max(0, maxValue) : 0;
  const steps = Math.max(2, targetTicks);
  return Math.max(1, Math.ceil(max / (steps - 1)));
}

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
  const query = els.search.value.trim();
  const fromDate = els.from.value;
  const toDate = els.to.value;

  return indexRecords.filter((record) => {
    if (els.mandate.value && record.mandate_id !== els.mandate.value) {
      return false;
    }
    if (els.procedure.value && record.procedure_id !== els.procedure.value) {
      return false;
    }
    if (els.outcome.value && record.outcome_type !== els.outcome.value) {
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

function destroyChart(chart) {
  if (chart) {
    chart.destroy();
  }
}

function ensureCharts() {
  destroyChart(timelineChart);
  destroyChart(mandateChart);
  destroyChart(procedureChart);
  timelineChart = null;
  mandateChart = null;
  procedureChart = null;
}

function byDateBuckets(records) {
  const buckets = new Map();
  records.forEach((record) => {
    const date = formatShortDate(record.timestamp) || "unknown";
    if (!buckets.has(date)) {
      buckets.set(date, { affirm_alignment: 0, recommend_adjustment: 0, escalate: 0, total: 0 });
    }
    const bucket = buckets.get(date);
    bucket.total += 1;
    bucket[record.outcome_type] = (bucket[record.outcome_type] || 0) + 1;
  });
  const dates = Array.from(buckets.keys()).sort();
  return { dates, buckets };
}

function renderTimeline(records) {
  const { dates, buckets } = byDateBuckets(records);
  const dataByOutcome = (outcomeType) => dates.map((d) => buckets.get(d)?.[outcomeType] || 0);
  const maxStacked = dates.length
    ? Math.max(
        ...dates.map((d) => {
          const row = buckets.get(d);
          return (row?.affirm_alignment || 0) + (row?.recommend_adjustment || 0) + (row?.escalate || 0);
        })
      )
    : 0;
  const stepSize = integerStep(maxStacked);
  const suggestedMax = Math.max(stepSize, Math.ceil(maxStacked / stepSize) * stepSize);

  timelineChart = new window.Chart(els.timeline, {
    type: "bar",
    data: {
      labels: dates,
      datasets: [
        {
          label: OUTCOME_CONTEXT.affirm_alignment.title,
          data: dataByOutcome("affirm_alignment"),
          backgroundColor: "rgba(139, 213, 202, 0.45)",
          borderColor: "rgba(139, 213, 202, 0.8)",
          borderWidth: 1,
        },
        {
          label: OUTCOME_CONTEXT.recommend_adjustment.title,
          data: dataByOutcome("recommend_adjustment"),
          backgroundColor: "rgba(245, 197, 66, 0.45)",
          borderColor: "rgba(245, 197, 66, 0.8)",
          borderWidth: 1,
        },
        {
          label: OUTCOME_CONTEXT.escalate.title,
          data: dataByOutcome("escalate"),
          backgroundColor: "rgba(247, 118, 142, 0.34)",
          borderColor: "rgba(247, 118, 142, 0.85)",
          borderWidth: 1,
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
        tooltip: { mode: "index", intersect: false },
      },
    },
  });
}

function topEscalations(records, keyFn) {
  const byKey = groupBy(records, keyFn);
  const rows = Array.from(byKey.entries()).map(([key, items]) => ({
    key,
    escalations: items.filter((r) => r.outcome_type === "escalate").length,
    total: items.length,
  }));
  rows.sort((a, b) => b.escalations - a.escalations || b.total - a.total || String(a.key).localeCompare(String(b.key)));
  return rows;
}

function renderEscalations(records) {
  const byMandate = topEscalations(records, (r) => r.mandate_id).slice(0, 12);
  const byProcedure = topEscalations(records, (r) => r.procedure_id).slice(0, 12);
  const maxMandate = byMandate.length ? byMandate[0].escalations : 0;
  const maxProcedure = byProcedure.length ? byProcedure[0].escalations : 0;
  const stepMandate = integerStep(maxMandate);
  const stepProcedure = integerStep(maxProcedure);
  const suggestedMaxMandate = Math.max(stepMandate, Math.ceil(maxMandate / stepMandate) * stepMandate);
  const suggestedMaxProcedure = Math.max(stepProcedure, Math.ceil(maxProcedure / stepProcedure) * stepProcedure);

  mandateChart = new window.Chart(els.escMandate, {
    type: "bar",
    data: {
      labels: byMandate.map((r) => r.key),
      datasets: [
        {
          label: "Escalations",
          data: byMandate.map((r) => r.escalations),
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
        const hits = mandateChart.getElementsAtEventForMode(event, "nearest", { intersect: true }, true);
        if (!hits.length) return;
        const idx = hits[0].index;
        const mandateId = mandateChart.data.labels?.[idx];
        if (mandateId) openMandateViewer(String(mandateId));
      },
      scales: {
        x: { ticks: { color: "#9aa3b2" }, grid: { color: "rgba(38, 43, 54, 0.7)" } },
        y: {
          ticks: { color: "#9aa3b2", stepSize: stepMandate, precision: 0 },
          grid: { color: "rgba(38, 43, 54, 0.7)" },
          beginAtZero: true,
          suggestedMax: suggestedMaxMandate,
        },
      },
      plugins: { legend: { labels: { color: "#e6e9ef" } } },
    },
  });

  procedureChart = new window.Chart(els.escProcedure, {
    type: "bar",
    data: {
      labels: byProcedure.map((r) => r.key),
      datasets: [
        {
          label: "Escalations",
          data: byProcedure.map((r) => r.escalations),
          backgroundColor: "rgba(247, 118, 142, 0.34)",
          borderColor: "rgba(247, 118, 142, 0.85)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { ticks: { color: "#9aa3b2" }, grid: { color: "rgba(38, 43, 54, 0.7)" } },
        y: {
          ticks: { color: "#9aa3b2", stepSize: stepProcedure, precision: 0 },
          grid: { color: "rgba(38, 43, 54, 0.7)" },
          beginAtZero: true,
          suggestedMax: suggestedMaxProcedure,
        },
      },
      plugins: { legend: { labels: { color: "#e6e9ef" } } },
    },
  });
}

async function escalationSeverity(meta) {
  if (escalationSeverityCache.has(meta.path)) {
    return escalationSeverityCache.get(meta.path);
  }
  if (meta.outcome_type !== "escalate") {
    escalationSeverityCache.set(meta.path, 0);
    return 0;
  }
  const data = await fetchRecordByPath(meta.path);
  const hardBreach = data?.constraints?.hard_constraints_breached === true;
  const severity = hardBreach ? 2 : 1;
  escalationSeverityCache.set(meta.path, severity);
  return severity;
}

async function computeHeatmapMatrix(records, metric) {
  const mandates = uniq(records.map((r) => r.mandate_id));
  const procedures = uniq(records.map((r) => r.procedure_id));
  const totalsByCell = new Map();
  const escalationsByCell = new Map();
  const severityByCell = new Map();

  const cellKey = (mandateId, procedureId) => `${mandateId}|||${procedureId}`;

  records.forEach((r) => {
    const key = cellKey(r.mandate_id, r.procedure_id);
    totalsByCell.set(key, (totalsByCell.get(key) || 0) + 1);
    if (r.outcome_type === "escalate") {
      escalationsByCell.set(key, (escalationsByCell.get(key) || 0) + 1);
    }
  });

  if (metric === "severity") {
    const escalationRecords = records.filter((r) => r.outcome_type === "escalate");
    const severities = await Promise.all(escalationRecords.map((r) => escalationSeverity(r)));
    escalationRecords.forEach((r, idx) => {
      const key = cellKey(r.mandate_id, r.procedure_id);
      severityByCell.set(key, (severityByCell.get(key) || 0) + severities[idx]);
    });
  }

  const values = [];
  mandates.forEach((mandateId) => {
    procedures.forEach((procedureId) => {
      const key = cellKey(mandateId, procedureId);
      const total = totalsByCell.get(key) || 0;
      const count = escalationsByCell.get(key) || 0;
      const severity = severityByCell.get(key) || 0;
      let value = count;
      if (metric === "rate") {
        value = total ? count / total : 0;
      } else if (metric === "severity") {
        value = severity;
      }
      values.push({ mandateId, procedureId, total, escalations: count, severity, value });
    });
  });

  return { mandates, procedures, values };
}

function heatmapTooltipText(d, metric) {
  if (metric === "rate") {
    const pct = d.total ? `${Math.round((d.escalations / d.total) * 100)}%` : "0%";
    return `${d.mandateId} × ${d.procedureId}\nEscalations: ${d.escalations}/${d.total} (${pct})`;
  }
  if (metric === "severity") {
    return `${d.mandateId} × ${d.procedureId}\nSeverity: ${d.severity} (hard breaches weighted)`;
  }
  return `${d.mandateId} × ${d.procedureId}\nEscalations: ${d.escalations}`;
}

function renderDrilldown(records, mandateId, procedureId) {
  const matches = records
    .filter((r) => r.mandate_id === mandateId && r.procedure_id === procedureId)
    .slice()
    .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));

  els.drillCaption.textContent = `${matches.length} records for ${mandateId} × ${procedureId}`;
  els.drillRows.replaceChildren();

  if (!matches.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="6" class="muted">No records in this cell.</td>`;
    els.drillRows.appendChild(tr);
    return;
  }

  matches.slice(0, 50).forEach((r) => {
    const tr = document.createElement("tr");
    const url = `./index.html?record=${encodeURIComponent(r.record_id)}`;
    tr.innerHTML = `
      <td>${formatShortDate(r.timestamp)}</td>
      <td><button type="button" class="link-btn" data-open-mandate>${r.mandate_id}</button></td>
      <td>${r.procedure_id}</td>
      <td><span class="badge ${r.outcome_type}">${r.outcome_type}</span></td>
      <td>${r.confidence_level ?? ""}</td>
      <td><a class="link" href="${url}">Open</a></td>
    `;
    const btn = tr.querySelector("[data-open-mandate]");
    if (btn) btn.addEventListener("click", () => openMandateViewer(String(r.mandate_id)));
    els.drillRows.appendChild(tr);
  });
}

async function renderHeatmap(records) {
  const metric = els.heatmapMetric.value;
  const { mandates, procedures, values } = await computeHeatmapMatrix(records, metric);

  els.heatmap.replaceChildren();
  const containerWidth = els.heatmap.clientWidth || 900;

  const cellSize = 22;
  const margin = { top: 110, right: 16, bottom: 16, left: 160 };
  const width = Math.max(containerWidth, margin.left + procedures.length * cellSize + margin.right);
  const height = margin.top + mandates.length * cellSize + margin.bottom;

  const svg = window.d3
    .select(els.heatmap)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("role", "img")
    .attr("aria-label", "Escalation heatmap");

  const maxValue = Math.max(0.0001, ...values.map((v) => v.value));
  const color = window.d3
    .scaleSequential()
    .domain([0, maxValue])
    .interpolator(window.d3.interpolateRgb("rgba(23,26,33,0.9)", "rgba(247,118,142,0.72)"));

  const x = window.d3.scaleBand().domain(procedures).range([margin.left, width - margin.right]).padding(0.06);
  const y = window.d3.scaleBand().domain(mandates).range([margin.top, height - margin.bottom]).padding(0.06);

  svg
    .append("g")
    .selectAll("text")
    .data(procedures)
    .join("text")
    .attr("x", (d) => x(d) + x.bandwidth() / 2)
    .attr("y", margin.top - 8)
    .attr("text-anchor", "end")
    .attr("transform", (d) => `rotate(-35, ${x(d) + x.bandwidth() / 2}, ${margin.top - 8})`)
    .attr("fill", "#9aa3b2")
    .attr("font-size", 11)
    .text((d) => d);

  svg
    .append("g")
    .selectAll("text")
    .data(mandates)
    .join("text")
    .attr("x", margin.left - 12)
    .attr("y", (d) => y(d) + y.bandwidth() / 2 + 4)
    .attr("text-anchor", "end")
    .attr("fill", "#9aa3b2")
    .attr("font-size", 11)
    .attr("tabindex", 0)
    .attr("role", "button")
    .style("cursor", "pointer")
    .text((d) => d);

  svg
    .selectAll("text[role='button']")
    .on("click", (event, d) => openMandateViewer(String(d)))
    .on("keydown", (event, d) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMandateViewer(String(d));
      }
    })
    .append("title")
    .text((d) => `Open mandate ${d}`);

  const cells = svg.append("g").selectAll("rect").data(values).join("rect");

  cells
    .attr("x", (d) => x(d.procedureId))
    .attr("y", (d) => y(d.mandateId))
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .attr("rx", 3)
    .attr("fill", (d) => color(d.value))
    .attr("stroke", "rgba(38, 43, 54, 0.9)")
    .attr("tabindex", 0)
    .attr("role", "button")
    .attr("aria-label", (d) => heatmapTooltipText(d, metric))
    .on("click", (event, d) => renderDrilldown(records, d.mandateId, d.procedureId))
    .on("keydown", (event, d) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        renderDrilldown(records, d.mandateId, d.procedureId);
      }
    })
    .append("title")
    .text((d) => heatmapTooltipText(d, metric));
}

async function renderAll() {
  ensureCharts();
  const records = filteredRecords();
  els.count.textContent = String(records.length);
  renderTimeline(records);
  renderEscalations(records);
  await renderHeatmap(records);
}

function resetFilters() {
  els.search.value = "";
  els.mandate.value = "";
  els.procedure.value = "";
  els.outcome.value = "";
  els.from.value = "";
  els.to.value = "";
}

function wireFilters() {
  const rerender = debounce(() => renderAll(), 160);
  els.search.addEventListener("input", rerender);
  els.mandate.addEventListener("change", rerender);
  els.procedure.addEventListener("change", rerender);
  els.outcome.addEventListener("change", rerender);
  els.from.addEventListener("change", rerender);
  els.to.addEventListener("change", rerender);
  els.heatmapMetric.addEventListener("change", () => renderAll());
  els.reset.addEventListener("click", () => {
    resetFilters();
    renderAll();
  });

  window.addEventListener(
    "resize",
    debounce(() => renderAll(), 220)
  );
}

async function init() {
  setActiveNav();
  wireOnboarding({ autoOpen: false });
  const index = await loadIndex();
  indexRecords = index.records || [];
  buildFilters();
  wireFilters();
  await renderAll();
}

init();
