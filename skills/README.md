# Skills

This directory defines **judgment primitives**.

It intentionally exposes *what* institutional judgment must account for, while leaving
*how skills are composed, evaluated, prioritized, and evolved over time* explicitly
**out of scope**.

Those mechanisms are treated as institutional IP and are not specified here.

This directory defines **investment judgment skills** as reusable, auditable capabilities
that may be invoked by agent runtimes operating under MandateOS.

Skills are **not logic**, **not strategies**, and **not sources of authority**.
They are *judgment packaging*.

---

## Purpose

A **skill** represents a bounded form of institutional judgment:

* what questions must be asked,
* what evidence must be considered,
* what failure modes must be guarded against,
* and when escalation is required.

Skills exist to make judgment:

* explicit,
* reviewable,
* composable,
* and governable.

They are designed to reflect **how real investment committees reason**, not how
models optimize.

---

## What Skills Are (and Are Not)

### Skills ARE:

* Structured judgment capabilities
* Human- and model-readable
* Composable across mandates
* Auditable via Judgment Records
* Stable over long time horizons

### Skills are NOT:

* Trading logic
* Optimization routines
* Alpha generators
* Autonomous decision-makers
* Independent sources of authority

Canonical truth does **not** live here.

---

## Canonical Sources of Authority

This repository follows a strict separation of concerns.

Canonical authority lives in:

* `mandates/` — what is permitted and required
* `judgment_loops/` — how decisions flow and escalate
* `documentation/` — system-level explanations and rationale

The `skills/` directory must:

* reference canonical sources,
* never override them,
* never introduce new authority,
* never encode executable logic.

If a conflict exists, **skills always defer**.

---

## Skill Structure

Each skill lives in its own directory and contains exactly one file:

```
skills/<skill_name>/SKILL.md
```

Each `SKILL.md` defines:

* the judgment the skill represents,
* the checkpoints it enforces,
* its authority boundaries,
* its interaction with other skills,
* and its audit requirements.

No other files are permitted inside skill directories without explicit governance approval.

---

## Authority Model

Skills do not decide.
Skills **constrain**, **inform**, or **veto** decisions made elsewhere.

Every skill explicitly defines:

* what humans may decide,
* what models may advise on,
* what models may *not* decide,
* and when escalation is mandatory.

Any use of a skill outside its declared authority boundaries is a system violation.

---

## Immutability and Change

Skills are intended to be **stable, slow-moving institutional artifacts**.

Changes to a skill:

* must be deliberate,
* must be versioned,
* must preserve auditability,
* and must not silently alter authority or scope.

If a skill must evolve, prefer:

1. adding clarification,
2. tightening checkpoints,
3. introducing explicit escalation paths,

over redefining its core purpose.

---

## Design Philosophy

This skills framework is inspired by:

* long-horizon capital allocation practice,
* Buffett-style investment judgment,
* institutional governance realities,
* and the assumption that **models will be fallible**.

The system is designed so that:

> a smart model with weak governance fails safely,
> and a mediocre model with strong governance survives.

---

## Skills Index

| #  | Skill                                | Purpose                                                                                      |
| -- | ------------------------------------ | -------------------------------------------------------------------------------------------- |
| 1  | Business Quality Assessment          | Determines whether a business is admissible for investment judgment at all.                  |
| 2  | Intrinsic Value Estimation           | Establishes a conservative, range-based assessment of owner-oriented value.                  |
| 3  | Margin of Safety Enforcement         | Requires explicit protection against uncertainty and error before capital commitment.        |
| 4  | Capital Allocation Judgment          | Decides where incremental capital creates the most long-term value relative to alternatives. |
| 5  | Incentive Alignment Analysis         | Evaluates whether decision-makers’ incentives align with long-term owner interests.          |
| 6  | Risk Asymmetry Recognition           | Assesses payoff shape to ensure downside is bounded and upside is meaningful.                |
| 7  | Long-Horizon Compounding Orientation | Anchors decisions in multi-decade value creation rather than short-term results.             |
| 8  | Circle of Competence Enforcement     | Constrains judgment to domains that are causally understandable and monitorable.             |
| 9  | Opportunity Cost Awareness           | Forces explicit comparison against the best alternative use of capital or inaction.          |
| 10 | Market Noise Immunity                | Filters sentiment and price movement from information that affects intrinsic value.          |
| 11 | Simplicity Preference                | Limits unnecessary complexity as a form of risk control and governance discipline.           |
| 12 | Permanent Capital Loss Avoidance     | Vetoes decisions that expose capital to irreversible impairment.                             |
| 13 | Governance and Trust Evaluation      | Assesses integrity, stewardship, and institutional safeguards.                               |
| 14 | Scale-Aware Decision Making          | Adjusts judgment for the constraints and risks introduced by size.                           |
| 15 | Patience as an Active Strategy       | Treats deliberate waiting as a strategic, value-preserving action.                           |
| 16 | Error Recognition and Correction     | Ensures disconfirming evidence leads to timely learning and adjustment.                      |
| 17 | Structural Advantage Identification  | Identifies durable advantages that persist independent of execution excellence.              |
| 18 | Narrative Resistance                 | Separates compelling stories from underlying economic reality.                               |
| 19 | Owner-Mindset Reasoning              | Frames decisions as if owning the entire business indefinitely.                              |
| 20 | Institutional Constraint Awareness   | Ensures decisions remain feasible within mandates, liquidity, and governance limits.         |

---

## Final Note

If you are unsure whether something belongs in a skill:

* it probably does not.

When in doubt:

* reference a mandate,
* defer to a judgment loop,
* or document the reasoning elsewhere.

Skills exist to **discipline judgment**, not replace it.
