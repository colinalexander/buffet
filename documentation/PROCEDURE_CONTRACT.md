# Procedure Contract

**Repository:** buffet  
**Purpose:** Define what qualifies as a valid judgment procedure and how it must behave

---

## Status

**Current state:** DRAFT — GOVERNING DOCUMENT  
This document defines the structural, behavioral, and authority requirements
for all judgment procedures implemented in this repository.

Any file under `judgment_loops/` that violates this contract is invalid,
regardless of functional correctness.

---

## 1. Purpose

Judgment procedures encode **how institutional judgment is applied** under
a governing mandate.

They exist to:
- make implicit judgment explicit,
- ensure repeatable application of mandate logic,
- constrain behavior under uncertainty,
- and preserve auditability and human authority.

Procedures are **not** discretionary strategies, research artifacts,
or implementation shortcuts.

---

## 2. Required Inputs

Every procedure must explicitly reference:

1. **Governing Mandate**
   - mandate identifier
   - mandate version
   - effective date

2. **Trigger Conditions**
   - the conditions under which the procedure may be invoked
   - persistence requirements (where applicable)

3. **Authority Boundaries**
   - actions permitted
   - actions prohibited
   - escalation triggers

Procedures that rely on implicit inputs are invalid.

---

## 3. Required Outputs

Every invocation of a procedure must produce exactly one of the following
**judgment outcomes**:

1. **Affirm Alignment**
   - no adjustment recommended
   - inaction explicitly justified

2. **Recommend Adjustment**
   - exposure-level recommendation
   - within mandate bounds

3. **Escalate**
   - human authority required
   - no further automated action permitted

Procedures may **not** output:
- trades,
- positions,
- asset selection,
- or optimization objectives.

---

## 4. Procedural Structure (Mandatory)

Each procedure must contain, at minimum, the following sections:

1. **Purpose and Standing**
2. **Trigger Definition**
3. **Interpretation Principles**
4. **Permitted Analytical Actions**
5. **Adjustment Framework**
6. **Escalation Rules**
7. **Documentation Requirements**
8. **Compliance Criteria**

Omission of any section constitutes a contract violation.

---

## 5. Determinism and Repeatability

Procedures must be:

- deterministic given the same inputs,
- free of hidden randomness,
- free of adaptive behavior outside mandate authority.

Stochastic inputs (e.g., probabilistic models) must be:
- explicitly acknowledged,
- bounded by confidence requirements,
- and never used to expand discretion.

---

## 6. Inaction as a First-Class Outcome

Every procedure must:

- explicitly allow inaction,
- require justification for inaction,
- record rationale equivalent to action decisions.

Procedures that implicitly bias toward action are invalid.

---

## 7. Prohibited Behavior

Procedures must **not**:

- infer or express directional market views,
- optimize for return or performance metrics,
- reinterpret mandate language,
- override risk constraints,
- suppress escalation triggers,
- introduce new decision dimensions.

If judgment cannot be expressed procedurally,
the correct outcome is escalation.

---

## 8. Escalation Discipline

Escalation is a **designed outcome**, not a failure mode.

Procedures must escalate when:
- authority limits are reached,
- confidence degrades below mandate minimums,
- objectives conflict,
- irreversible consequences are implicated.

Procedures may not resume automated operation after escalation
without explicit human authorization.

---

## 9. Versioning and Change Control

All procedures must be:

- versioned,
- change-logged,
- diff-reviewable.

Procedure changes that affect:
- authority,
- escalation behavior,
- or adjustment scope

are governance changes and require review.

Silent modification is prohibited.

---

## 10. Relationship to Other Contracts

When interpreting behavior, the following hierarchy applies:

1. Human fiduciary authority
2. Judgment Authority Contract
3. Governing mandate
4. Procedure Contract
5. Specific procedure
6. Implementation code

Conflicts must be resolved by escalation.

---

## 11. Summary

Procedures define **how judgment is applied**, not what outcomes are desired.

They exist to:
- constrain discretion,
- preserve institutional intent,
- and ensure accountability.

Any procedure that cannot meet these requirements
does not belong in this repository.

---

**Maintainer:**  
Colin Alexander, CFA, CIPM  

**Effective upon adoption**
