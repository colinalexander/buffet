import { debounce, escapeHtml } from "./core.js";
import { setActiveNav, wireOnboarding } from "./page.js";
import { openOnboarding } from "./wizard.js";

const els = {
  search: document.getElementById("glossary-search"),
  terms: document.getElementById("glossary-terms"),
  count: document.getElementById("glossary-count"),
  onboarding: document.getElementById("glossary-onboarding"),
};

let glossary = null;

async function loadGlossary() {
  if (glossary) {
    return glossary;
  }
  const response = await fetch("data/glossary.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load glossary: ${response.status}`);
  }
  glossary = await response.json();
  return glossary;
}

function normalize(text) {
  return String(text || "").toLowerCase();
}

function matches(term, query) {
  if (!query) {
    return true;
  }
  const haystack = normalize(`${term.term} ${term.definition} ${(term.examples || []).join(" ")} ${(term.tags || []).join(" ")}`);
  return haystack.includes(normalize(query));
}

function renderTerms(data) {
  const query = els.search.value.trim();
  const terms = (data.terms || []).filter((t) => matches(t, query));
  els.count.textContent = String(terms.length);

  if (!terms.length) {
    els.terms.innerHTML = `<p class="muted">No glossary terms match the current search.</p>`;
    return;
  }

  els.terms.innerHTML = terms
    .map((t) => {
      const tags =
        t.tags && t.tags.length
          ? `<div class="tag-row">${t.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>`
          : "";
      const examples =
        t.examples && t.examples.length
          ? `<div class="examples"><div class="examples-title">Examples</div><ul>${t.examples
              .map((e) => `<li>${escapeHtml(e)}</li>`)
              .join("")}</ul></div>`
          : "";
      return `
        <article class="term" id="${escapeHtml(t.slug)}">
          <header class="term-header">
            <h3 class="term-title">${escapeHtml(t.term)}</h3>
            ${tags}
          </header>
          <p class="muted">${escapeHtml(t.definition)}</p>
          ${examples}
        </article>
      `;
    })
    .join("");
}

async function init() {
  setActiveNav();
  wireOnboarding({ autoOpen: false });

  els.onboarding?.addEventListener("click", () => openOnboarding());
  els.search.addEventListener(
    "input",
    debounce(async () => renderTerms(await loadGlossary()), 140)
  );

  renderTerms(await loadGlossary());
}

init();

