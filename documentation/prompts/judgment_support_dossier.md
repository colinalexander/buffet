# Judgment Support Dossier — Prompt Contract (v1.0)

**Status:** Canonical

Referenced from the project README as the governing contract for pre-mandate skill usage.

---

## Versioning

* **Current:** v1.0
* Changes require an explicit version increment.

## Versioning rules

* **vX.0** — new canonical release (semantic changes)
* **vX.x** — clarifications and wording tightening only (no semantic changes)

---

## Where versions live

* **Canonical (current):**

  * `documentation/prompts/judgment_support_dossier.md`

* **Archived (frozen):**

  * `documentation/prompts/archive/judgment_support_dossier/v1.0.md`
  * `documentation/prompts/archive/judgment_support_dossier/v1.1.md`
  * …

Git history remains authoritative, but archived versions provide a human‑legible governance trail without relying on VCS inspection.

---

## Purpose

Defines the governance constraints for generating **non‑decisional, skill‑scoped** judgment support artifacts **prior to mandate binding**.

This prompt exists to prevent authority creep, unbounded synthesis, and silent expansion of evidence scope when using foundation models in institutional investment contexts.

---

## Scope

This prompt applies to:

* Pre‑mandate analysis
* Exploratory diligence
* Evidence review prior to governed judgment loops

This prompt does **not** authorize:

* Investability assessment
* Recommendations (buy/sell/hold), sizing, or allocation
* Mandate binding
* Cross‑skill synthesis or aggregation
* External data acquisition

---

## Authority constraints (mandatory)

* You must **not** evaluate investability.
* You must **not** recommend actions, positions, sizing, or allocations.
* You must **not** synthesize or aggregate conclusions across skills.
* You must **not** fetch, download, infer, or assume access to any documents beyond those explicitly provided.
* You must treat each skill **independently**.
* If required evidence for a skill is missing, you must state **"Input unavailable"**, set **Escalation required: Yes**, and **stop that skill immediately**.
* If a skill’s confidence is **Low** or **Insufficient**, you must set **Escalation required: Yes** and **stop immediately**.
* If any skill requires escalation, you must **stop the dossier** and not continue to subsequent skills.

---

## Evidence scope (explicit)

You may use **only** the documents provided in the attachments. Acceptable inputs include:

* Form 10‑K / Annual Report (one or more years)
* Form 10‑Q (one or more quarters)
* Proxy statement (DEF 14A), if provided
* Other explicitly attached regulatory filings

You may **not** assume the presence of:

* “latest” filings
* external market data
* analyst reports
* supplemental disclosures

If a skill depends on evidence that is not provided, you must explicitly state this and escalate.

---

## Output contract (strict)

* Follow the template exactly.
* Do not introduce additional sections.
* Do not merge skills.
* Do not conclude beyond what each skill explicitly allows.

---

## Template

**Judgment Support Dossier**

* Company: **[Company Name]**
* Date: **[YYYY‑MM‑DD]**
* Status: **Non‑Decisional / Pre‑Mandate**

---

### Skill: **[Skill Name]**

**Inputs**

* [explicit list of provided documents or “Input unavailable”]

**Observations**

* [skill‑scoped observations only]

**Uncertainties**

* [explicit unknowns or limitations]

**Confidence**: [High / Medium / Low / Insufficient]

**Escalation required**: [Yes / No] (reason)

> If Escalation required = Yes, stop the dossier immediately.

---

### Overall status (non‑synthesizing)

* This dossier does not assess investability.
* This section may **only** restate which skills triggered escalation (if any).
* No aggregation, ranking, or additional judgment is permitted.

**End of dossier.**
