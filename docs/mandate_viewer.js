const INDEX_URL = "mandates/index.json";

let cachedMandatesIndex = null;
let dialogState = null;
let requestSeq = 0;

function text(value, fallback = "—") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function percent(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return text(value);
  return `${(num * 100).toFixed(1)}%`;
}

function humanizeKey(key) {
  return String(key || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

async function fetchText(path) {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.text();
}

export async function loadMandatesIndex() {
  if (cachedMandatesIndex) return cachedMandatesIndex;
  const response = await fetch(INDEX_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load ${INDEX_URL}: ${response.status}`);
  }
  const data = await response.json();
  cachedMandatesIndex = Array.isArray(data.mandates) ? data.mandates : [];
  return cachedMandatesIndex;
}

function ensureDialog() {
  if (dialogState) return dialogState;

  const dialog = document.createElement("dialog");
  dialog.id = "mandate-dialog";
  dialog.className = "dialog";
  dialog.setAttribute("aria-label", "Mandate details");

  const card = document.createElement("div");
  card.className = "dialog-card mandate-dialog-card";

  const header = document.createElement("div");
  header.className = "dialog-header";

  const headingWrap = document.createElement("div");
  const kicker = document.createElement("div");
  kicker.className = "dialog-kicker";
  kicker.textContent = "Mandate";

  const title = document.createElement("h2");
  title.className = "dialog-title";
  title.id = "mandate-dialog-title";
  title.textContent = "Mandate details";

  headingWrap.appendChild(kicker);
  headingWrap.appendChild(title);

  const actions = document.createElement("div");
  actions.className = "dialog-actions";

  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "btn btn-ghost";
  closeBtn.textContent = "Close";
  closeBtn.addEventListener("click", () => dialog.close());

  actions.appendChild(closeBtn);

  header.appendChild(headingWrap);
  header.appendChild(actions);

  const body = document.createElement("div");
  body.className = "dialog-body";

  const content = document.createElement("div");
  content.id = "mandate-dialog-content";
  content.className = "mandate-dialog-content";

  body.appendChild(content);

  card.appendChild(header);
  card.appendChild(body);
  dialog.appendChild(card);
  document.body.appendChild(dialog);

  dialogState = { dialog, title, content };
  return dialogState;
}

function renderLoading(content, mandateId) {
  content.replaceChildren();
  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = mandateId ? `Loading mandate ${mandateId}…` : "Loading mandate…";
  content.appendChild(p);
}

function renderError(content, message, detail) {
  content.replaceChildren();

  const callout = document.createElement("div");
  callout.className = "callout";
  callout.innerHTML = `<strong>Mandate unavailable.</strong> ${message}`;

  const micro = document.createElement("p");
  micro.className = "muted";
  micro.textContent = "Read-only governance viewer. No actions or trades are executed here.";

  content.appendChild(callout);
  content.appendChild(micro);

  if (detail) {
    const pre = document.createElement("pre");
    pre.className = "raw-json";
    pre.textContent = detail;
    content.appendChild(pre);
  }
}

function renderMarkdownSection({ title, markdown, fallbackLabel }) {
  const section = document.createElement("section");
  const h = document.createElement("h4");
  h.textContent = title;
  section.appendChild(h);

  if (!markdown) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = fallbackLabel;
    section.appendChild(p);
    return section;
  }

  if (window.marked && typeof window.marked.parse === "function") {
    const div = document.createElement("div");
    div.className = "prose";
    div.innerHTML = window.marked.parse(markdown);
    section.appendChild(div);
    return section;
  }

  const pre = document.createElement("pre");
  pre.className = "raw-json";
  pre.textContent = markdown;
  section.appendChild(pre);
  return section;
}

function listSection(title, items) {
  const section = document.createElement("section");
  const h = document.createElement("h4");
  h.textContent = title;
  section.appendChild(h);

  const values = Array.isArray(items) ? items.filter(Boolean).map(String) : [];
  if (!values.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "—";
    section.appendChild(p);
    return section;
  }

  const ul = document.createElement("ul");
  ul.className = "change-list";
  values.forEach((v) => {
    const li = document.createElement("li");
    li.textContent = v;
    ul.appendChild(li);
  });
  section.appendChild(ul);
  return section;
}

function constraintItems(mandate) {
  const items = [];

  const risk = mandate?.risk_constraints && typeof mandate.risk_constraints === "object" ? mandate.risk_constraints : null;
  if (risk) {
    Object.entries(risk).forEach(([key, value]) => {
      if (!value || typeof value !== "object") return;
      const action = value.breach_action ? ` — breach action: ${value.breach_action}` : "";
      if (key === "max_drawdown") {
        const basis = value.measurement_basis ? ` (basis: ${value.measurement_basis})` : "";
        items.push(`Max drawdown: ${percent(value.level)}${basis}${action}`);
        return;
      }
      if (key === "funding_ratio") {
        const freq = value.measurement_frequency ? ` (measurement: ${value.measurement_frequency})` : "";
        items.push(`Funding ratio minimum: ${text(value.minimum)}${freq}${action}`);
        return;
      }
      if (key === "shortfall_risk") {
        const horizon = value.horizon_years ? ` (${value.horizon_years}y)` : "";
        items.push(`Shortfall risk probability: ${percent(value.max_probability)}${horizon}${action}`);
        return;
      }
      if (key === "existential_risk") {
        const horizon = value.horizon_years ? ` (${value.horizon_years}y)` : "";
        items.push(`Existential risk threshold: ${percent(value.probability_threshold)}${horizon}${action}`);
        return;
      }
      items.push(`${humanizeKey(key)}: ${JSON.stringify(value)}${action}`);
    });
  }

  const liquidity = mandate?.liquidity && typeof mandate.liquidity === "object" ? mandate.liquidity : null;
  if (liquidity) {
    if (liquidity.minimum_buffer_months !== undefined) {
      items.push(`Liquidity buffer minimum: ${text(liquidity.minimum_buffer_months)} months`);
    }
    const forced = liquidity.forced_liquidation && typeof liquidity.forced_liquidation === "object" ? liquidity.forced_liquidation : null;
    if (forced && forced.prohibited === true) {
      items.push("Forced liquidation: prohibited");
    }
  }

  const leverage = mandate?.leverage && typeof mandate.leverage === "object" ? mandate.leverage : null;
  if (leverage && leverage.max_gross_exposure !== undefined) {
    const action = leverage.breach_action ? ` — breach action: ${leverage.breach_action}` : "";
    items.push(`Max gross exposure: ${text(leverage.max_gross_exposure)}${action}`);
  }

  return items;
}

function renderMandateContent({
  content,
  entry,
  mandate,
  rawYaml,
  expectedVersion,
  ipsMarkdown,
  changelogMarkdown,
}) {
  content.replaceChildren();

  const meta = mandate?.meta && typeof mandate.meta === "object" ? mandate.meta : {};

  const micro = document.createElement("div");
  micro.className = "microcallout";
  micro.innerHTML = `
    <div class="microcallout-title">Governance context</div>
    <div class="microcallout-body">Read-only governance viewer. No actions or trades are executed here.</div>
    <div class="microcallout-body">Mandates define authority boundaries and constraints; Judgment Records report outcomes under those constraints.</div>
    <div class="microcallout-body">Escalations indicate authority thresholds were reached and human review may be required.</div>
  `;
  content.appendChild(micro);

  const versionText = text(meta.version);
  const expectedText = expectedVersion ? String(expectedVersion) : null;
  if (expectedText && expectedText !== versionText) {
    const warn = document.createElement("div");
    warn.className = "callout callout-warn";
    warn.innerHTML = `<strong>Version mismatch.</strong> Record references v${expectedText}; loaded mandate is v${versionText}.`;
    content.appendChild(warn);
  }

  const header = document.createElement("section");
  header.className = "summary-card";

  const headerInner = document.createElement("div");
  headerInner.className = "summary-header";

  const headerLeft = document.createElement("div");
  const kicker = document.createElement("div");
  kicker.className = "summary-kicker";
  kicker.textContent = `${text(meta.archetype)} · ${text(meta.investor_type)}`;

  const title = document.createElement("h3");
  title.className = "summary-title";
  title.textContent = `${text(meta.mandate_id)} (v${versionText})`;

  headerLeft.appendChild(kicker);
  headerLeft.appendChild(title);

  const headerRight = document.createElement("div");
  headerRight.className = "summary-badges";
  const badge = document.createElement("span");
  badge.className = "badge affirm_alignment";
  badge.textContent = "READ-ONLY";
  headerRight.appendChild(badge);

  headerInner.appendChild(headerLeft);
  headerInner.appendChild(headerRight);

  const metaGrid = document.createElement("div");
  metaGrid.className = "mandate-meta-grid";

  const metaRows = [
    ["Effective date", text(meta.effective_date)],
    ["Owner", text(meta.owner)],
    ["Archetype", text(meta.archetype)],
    ["Investor type", text(meta.investor_type)],
  ];
  metaRows.forEach(([label, value]) => {
    const row = document.createElement("div");
    row.className = "mandate-meta-row";
    const dt = document.createElement("div");
    dt.className = "mandate-meta-label";
    dt.textContent = label;
    const dd = document.createElement("div");
    dd.className = "mandate-meta-value";
    dd.textContent = value;
    row.appendChild(dt);
    row.appendChild(dd);
    metaGrid.appendChild(row);
  });

  if (entry?.source_path) {
    const row = document.createElement("div");
    row.className = "mandate-meta-row";
    const dt = document.createElement("div");
    dt.className = "mandate-meta-label";
    dt.textContent = "Source path";
    const dd = document.createElement("div");
    dd.className = "mandate-meta-value";
    if (entry?.published_mandate_path) {
      const a = document.createElement("a");
      a.className = "link";
      a.href = entry.published_mandate_path;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = String(entry.source_path);
      dd.appendChild(a);
    } else {
      dd.textContent = String(entry.source_path);
    }
    row.appendChild(dt);
    row.appendChild(dd);
    metaGrid.appendChild(row);
  }

  if (entry?.published_mandate_path) {
    const row = document.createElement("div");
    row.className = "mandate-meta-row";
    const dt = document.createElement("div");
    dt.className = "mandate-meta-label";
    dt.textContent = "Published copy";
    const dd = document.createElement("div");
    dd.className = "mandate-meta-value";
    const a = document.createElement("a");
    a.className = "link";
    a.href = entry.published_mandate_path;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = entry.published_mandate_path;
    dd.appendChild(a);
    row.appendChild(dt);
    row.appendChild(dd);
    metaGrid.appendChild(row);
  }

  header.appendChild(headerInner);
  header.appendChild(metaGrid);
  content.appendChild(header);

  const detail = document.createElement("div");
  detail.className = "detail mandate-detail";

  const objective = mandate?.objective && typeof mandate.objective === "object" ? mandate.objective : {};
  const primary = objective?.primary && typeof objective.primary === "object" ? objective.primary : {};
  const returnTarget = objective?.return_target && typeof objective.return_target === "object" ? objective.return_target : {};

  const objectiveSection = document.createElement("section");
  const objectiveTitle = document.createElement("h4");
  objectiveTitle.textContent = "Core objective";
  objectiveSection.appendChild(objectiveTitle);
  const objectiveP1 = document.createElement("p");
  objectiveP1.textContent = `${text(primary.type)} — ${text(primary.description, "")}`.trim();
  objectiveSection.appendChild(objectiveP1);

  const horizons = Array.isArray(primary.evaluation_horizon_years) ? primary.evaluation_horizon_years : [];
  const objectiveP2 = document.createElement("p");
  objectiveP2.textContent = `Evaluation horizon (years): ${horizons.length ? horizons.join(", ") : "—"}`;
  objectiveSection.appendChild(objectiveP2);

  const rt = returnTarget.real_return_target !== undefined ? percent(returnTarget.real_return_target) : "—";
  const band = Array.isArray(returnTarget.tolerance_band) ? returnTarget.tolerance_band.map(percent).join(" to ") : "—";
  const objectiveP3 = document.createElement("p");
  objectiveP3.textContent = `Return target (target, not a hard constraint): ${rt} (tolerance band: ${band})`;
  objectiveSection.appendChild(objectiveP3);

  detail.appendChild(objectiveSection);

  const constraintsSection = document.createElement("section");
  const constraintsTitle = document.createElement("h4");
  constraintsTitle.textContent = "Hard constraints (most important)";
  constraintsSection.appendChild(constraintsTitle);

  const constraints = constraintItems(mandate);
  if (!constraints.length) {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "—";
    constraintsSection.appendChild(p);
  } else {
    const ul = document.createElement("ul");
    ul.className = "change-list";
    constraints.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line;
      ul.appendChild(li);
    });
    constraintsSection.appendChild(ul);
  }
  detail.appendChild(constraintsSection);

  const automation = mandate?.automation && typeof mandate.automation === "object" ? mandate.automation : {};
  detail.appendChild(listSection("Automation boundary — allowed actions", automation.allowed_actions));
  detail.appendChild(listSection("Automation boundary — prohibited actions", automation.prohibited_actions));

  const escalation = mandate?.escalation && typeof mandate.escalation === "object" ? mandate.escalation : {};
  detail.appendChild(listSection("Escalation rules — triggers", escalation.triggers));
  detail.appendChild(listSection("Escalation rules — human authority required", escalation.human_authority_required));

  const confidence = mandate?.confidence && typeof mandate.confidence === "object" ? mandate.confidence : {};
  const confidenceSection = document.createElement("section");
  const confTitle = document.createElement("h4");
  confTitle.textContent = "Confidence rules";
  confidenceSection.appendChild(confTitle);
  const confP = document.createElement("p");
  confP.textContent = `Minimum confidence level: ${text(confidence.minimum_confidence_level)}`;
  confidenceSection.appendChild(confP);
  if (Array.isArray(confidence.degradation_response) && confidence.degradation_response.length) {
    const ul = document.createElement("ul");
    ul.className = "change-list";
    confidence.degradation_response.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = String(line);
      ul.appendChild(li);
    });
    confidenceSection.appendChild(ul);
  }
  detail.appendChild(confidenceSection);

  const audit = mandate?.audit && typeof mandate.audit === "object" ? mandate.audit : {};
  const auditSection = document.createElement("section");
  const auditTitle = document.createElement("h4");
  auditTitle.textContent = "Audit & memory";
  auditSection.appendChild(auditTitle);
  const auditFields = [
    ["Logging required", text(audit.logging_required)],
    ["Rationale retention (years)", text(audit.rationale_retention_years)],
    ["Versioning required", text(audit.versioning_required)],
  ];
  auditFields.forEach(([label, value]) => {
    const p = document.createElement("p");
    p.textContent = `${label}: ${value}`;
    auditSection.appendChild(p);
  });
  detail.appendChild(auditSection);

  const artifacts = document.createElement("section");
  const artTitle = document.createElement("h4");
  artTitle.textContent = "Optional artifacts";
  artifacts.appendChild(artTitle);
  const note = document.createElement("p");
  note.className = "muted";
  note.textContent = "If present, these documents provide additional policy context (read-only).";
  artifacts.appendChild(note);

  if (entry?.published_ips_path || entry?.published_changelog_path) {
    artifacts.appendChild(renderMarkdownSection({ title: "IPS.md", markdown: ipsMarkdown, fallbackLabel: "IPS.md not available." }));
    artifacts.appendChild(
      renderMarkdownSection({ title: "changelog.md", markdown: changelogMarkdown, fallbackLabel: "changelog.md not available." })
    );
  } else {
    const p = document.createElement("p");
    p.className = "muted";
    p.textContent = "No additional artifacts were published for this mandate.";
    artifacts.appendChild(p);
  }

  detail.appendChild(artifacts);

  const raw = document.createElement("details");
  raw.className = "raw-details";
  const summary = document.createElement("summary");
  summary.textContent = "Raw YAML (audit artifact)";
  const pre = document.createElement("pre");
  pre.className = "raw-json";
  pre.textContent = rawYaml || "";
  raw.appendChild(summary);
  raw.appendChild(pre);
  detail.appendChild(raw);

  content.appendChild(detail);
}

function findMandateEntry(entries, mandateId, expectedVersion) {
  const matches = entries.filter((m) => m?.mandate_id === mandateId);
  if (!matches.length) return null;
  if (expectedVersion) {
    const found = matches.find((m) => String(m?.version ?? "") === String(expectedVersion));
    if (found) return found;
  }
  const sorted = matches
    .slice()
    .sort((a, b) => String(b?.effective_date ?? "").localeCompare(String(a?.effective_date ?? "")) || String(b?.version ?? "").localeCompare(String(a?.version ?? "")));
  return sorted[0];
}

export async function openMandateViewer(mandateId, { expectedVersion } = {}) {
  const { dialog, title, content } = ensureDialog();
  const seq = (requestSeq += 1);

  title.textContent = mandateId ? `Mandate: ${mandateId}` : "Mandate details";
  renderLoading(content, mandateId);
  if (!dialog.open) {
    dialog.showModal();
  }

  try {
    const mandates = await loadMandatesIndex();
    const entry = findMandateEntry(mandates, mandateId, expectedVersion);
    if (!entry) {
      throw new Error(`No mandate entry found for mandate_id=${mandateId}.`);
    }

    const yamlPath = entry.published_mandate_path || `mandates/${encodeURIComponent(mandateId)}/mandate.yaml`;

    const rawYaml = await fetchText(yamlPath);
    if (!window.jsyaml || typeof window.jsyaml.load !== "function") {
      throw new Error("YAML parser unavailable (js-yaml not loaded).");
    }
    const mandate = window.jsyaml.load(rawYaml);

    let ipsMarkdown = null;
    let changelogMarkdown = null;
    if (entry.published_ips_path) {
      try {
        ipsMarkdown = await fetchText(entry.published_ips_path);
      } catch {
        ipsMarkdown = null;
      }
    }
    if (entry.published_changelog_path) {
      try {
        changelogMarkdown = await fetchText(entry.published_changelog_path);
      } catch {
        changelogMarkdown = null;
      }
    }

    if (seq !== requestSeq) return;

    renderMandateContent({
      content,
      entry,
      mandate,
      rawYaml,
      expectedVersion,
      ipsMarkdown,
      changelogMarkdown,
    });
  } catch (err) {
    if (seq !== requestSeq) return;
    renderError(content, "This viewer remains usable; review other pages or try another mandate.", String(err?.message || err));
  }
}
