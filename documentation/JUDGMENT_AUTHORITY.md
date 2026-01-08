# Judgment Authority Contract

**Repository:** buffet  
**Purpose:** Machine-native investment judgment under explicit human authority

---

## Status

**Current state:** DRAFT — GOVERNING DOCUMENT  
This document defines the authority boundaries, scope, and accountability model
for all judgment systems implemented in this repository.

All code, procedures, and mandates must comply with this contract.
If a conflict exists, this document takes precedence.

---

## 1. Purpose

This repository implements machine-executable **investment judgment procedures**
for institutional mandates.

Its purpose is to:
- apply mandate-defined judgment consistently,
- preserve institutional memory,
- surface misalignment and uncertainty early, and
- escalate decisions that require human value judgments.

This repository does **not** exist to generate trades, optimize returns,
or express discretionary investment opinions.

---

## 2. Scope of Authority

### 2.1 What This System Is Authorized to Do

The system is authorized to:

- Interpret portfolio and environment state **only** through the lens of an
  explicit mandate.
- Apply documented judgment procedures deterministically and repeatably.
- Recommend **exposure-level adjustments** consistent with mandate constraints.
- Justify **inaction** as an explicit, auditable outcome.
- Monitor confidence and uncertainty in judgment application.
- Trigger escalation when predefined authority or confidence limits are reached.
- Record judgment rationale, procedure version, and mandate version for audit.

### 2.2 What This System Is Not Authorized to Do

The system is explicitly **not authorized** to:

- Redefine investment objectives, risk tolerance, or mandate constraints.
- Expand its own scope of authority or discretion.
- Execute trades or alter portfolio state directly.
- Introduce new instruments or strategies not permitted by the mandate.
- Resolve value tradeoffs involving acceptable harm, stakeholder priorities,
  or political or reputational considerations.
- Suppress or bypass escalation requirements.
- Optimize behavior for performance metrics outside the mandate definition.

---

## 3. Human Authority and Accountability

### 3.1 Human Roles

Human authority is required for:

- Defining and revising mandates.
- Approving or rejecting escalated recommendations.
- Authorizing irreversible or capital-impairing actions.
- Accepting tradeoffs between incommensurable objectives.
- Assigning and reviewing fiduciary responsibility.

### 3.2 Accountability Model

All automated judgments are made **on behalf of** human fiduciaries.
Responsibility for outcomes remains with the human authority that approved
the governing mandate and any escalated actions.

The system may not attribute outcomes to “model decisions” as a substitute
for human accountability.

---

## 4. Automation Boundaries

Automation within this repository is **constrained by design**.

### 4.1 Permitted Automation

- Continuous mandate alignment checks
- Procedural judgment execution
- Confidence and uncertainty monitoring
- Escalation triggering
- Documentation and logging

### 4.2 Prohibited Automation

- Mandate modification
- Authority delegation
- Irreversible action execution
- Discretionary override of procedures
- Self-modifying governance logic

Any attempt to implement prohibited automation constitutes a contract violation.

---

## 5. Mandates as Authority Sources

All judgment procedures must reference an explicit mandate by:
- mandate identifier,
- version number,
- effective date.

Procedures may **not** reinterpret mandate language locally.
Numeric thresholds, limits, and breach actions must be sourced directly
from the mandate definition.

Judgment logic that cannot be grounded in a mandate is invalid.

---

## 6. Procedures as Binding Logic

Procedures in this repository are:
- deterministic,
- versioned,
- auditable,
- and binding.

Procedures define **how** judgment is applied, not **what outcome is desired**.

Deviation from procedure is not permitted unless explicitly authorized
by escalation and human approval.

---

## 7. Escalation and Failure Handling

Escalation is a **required feature**, not an exception path.

Escalation must occur when:
- mandate authority limits are approached or breached,
- confidence in judgment degrades below minimum levels,
- conflicting objectives cannot be resolved procedurally,
- irreversible or capital-impairing actions are implicated.

Failure to escalate when required constitutes a **process failure**,
regardless of financial outcome.

---

## 8. Audit, Logging, and Retention

Every invocation of a judgment procedure must produce an auditable record
containing, at minimum:

- mandate identifier and version,
- procedure identifier and version,
- triggering conditions,
- recommended action or justified inaction,
- confidence assessment,
- escalation decision (if any).

Audit records are authoritative artifacts and must be retained
for the period specified by the governing mandate.

---

## 9. Change Policy

Changes to this repository that affect:
- authority boundaries,
- mandate interpretation,
- escalation behavior,
- or automation scope

are considered **governance changes** and require explicit review.

Incremental experimentation that bypasses this contract
does not belong in this repository.

---

## 10. Interpretation Rule

When ambiguity arises, the following hierarchy applies:

1. Human fiduciary authority
2. This Judgment Authority Contract
3. Governing mandate
4. Judgment procedure
5. Implementation code

If ambiguity cannot be resolved at or above level (3),
the system must escalate.

---

## 11. Summary

This repository exists to **apply judgment**, not to create it.

Judgment is defined by mandates,
applied by procedures,
executed by machines,
and owned by humans.

Any system that violates this hierarchy is out of scope.

---

**Maintainer:**  
Colin Alexander, CFA, CIPM  

**Effective upon adoption**
