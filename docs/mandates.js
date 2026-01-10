import { debounce, uniq } from "./js/core.js";
import { setActiveNav, wireOnboarding } from "./js/page.js";
import { loadMandatesIndex, openMandateViewer } from "./mandate_viewer.js";

const els = {
  count: document.getElementById("mandates-count"),
  search: document.getElementById("mandates-search"),
  archetype: document.getElementById("mandates-archetype"),
  investorType: document.getElementById("mandates-investor-type"),
  rows: document.getElementById("mandates-rows"),
  empty: document.getElementById("mandates-empty"),
};

let mandates = [];

function option(label, value) {
  const opt = document.createElement("option");
  opt.value = value;
  opt.textContent = label;
  return opt;
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function buildFilters() {
  const archetypes = uniq(mandates.map((m) => m.archetype).filter(Boolean));
  const investors = uniq(mandates.map((m) => m.investor_type).filter(Boolean));

  els.archetype.replaceChildren(option("All archetypes", ""), ...archetypes.map((a) => option(a, a)));
  els.investorType.replaceChildren(option("All investor types", ""), ...investors.map((i) => option(i, i)));
}

function filteredMandates() {
  const query = normalize(els.search.value);
  const archetype = els.archetype.value;
  const investorType = els.investorType.value;

  return mandates.filter((m) => {
    if (archetype && m.archetype !== archetype) return false;
    if (investorType && m.investor_type !== investorType) return false;
    if (!query) return true;
    const haystack = [m.mandate_id, m.owner, m.archetype, m.investor_type].map(normalize).join(" ");
    return haystack.includes(query);
  });
}

function render() {
  const rows = filteredMandates();
  els.rows.replaceChildren();

  els.count.textContent = String(rows.length);
  els.empty.hidden = rows.length > 0;

  rows.forEach((m) => {
    const tr = document.createElement("tr");

    const mandateBtn = document.createElement("button");
    mandateBtn.type = "button";
    mandateBtn.className = "link-btn";
    mandateBtn.textContent = m.mandate_id;
    mandateBtn.addEventListener("click", () => openMandateViewer(m.mandate_id));

    const viewBtn = document.createElement("button");
    viewBtn.type = "button";
    viewBtn.className = "btn btn-primary";
    viewBtn.textContent = "View Mandate Details";
    viewBtn.addEventListener("click", () => openMandateViewer(m.mandate_id));

    const tdMandate = document.createElement("td");
    tdMandate.appendChild(mandateBtn);

    tr.appendChild(tdMandate);
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.version || "—" }));
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.effective_date || "—" }));
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.owner || "—" }));
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.archetype || "—" }));
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.investor_type || "—" }));
    tr.appendChild(Object.assign(document.createElement("td"), { textContent: m.hard_constraint_highlights || "—" }));
    const tdView = document.createElement("td");
    tdView.appendChild(viewBtn);
    tr.appendChild(tdView);

    els.rows.appendChild(tr);
  });
}

function wire() {
  const rerender = debounce(() => render(), 120);
  els.search.addEventListener("input", rerender);
  els.archetype.addEventListener("change", rerender);
  els.investorType.addEventListener("change", rerender);
}

async function init() {
  setActiveNav();
  wireOnboarding({ autoOpen: false });

  mandates = await loadMandatesIndex();
  buildFilters();
  wire();
  render();
}

init();

