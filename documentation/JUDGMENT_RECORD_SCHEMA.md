# Judgment Record Schema

**Repository:** buffet
**Purpose:** Define the canonical, auditable output of all judgment procedures

---

## Status

**Current state:** DRAFT — GOVERNING DOCUMENT
This document defines the required structure and semantics of all judgment
records produced by procedures in this repository.

Any judgment execution that does not emit a compliant record is invalid,
regardless of correctness or outcome.

---

## 1. Purpose

A **Judgment Record** is the authoritative artifact representing:

* what judgment was applied,
* under which mandate and procedure,
* using which information,
* with what confidence,
* resulting in which outcome,
* and why.

Judgment Records exist to:

* support audit and review,
* preserve institutional memory,
* enable reproducibility,
* and enforce accountability.

They are **not logs**, diagnostics, or explanations for convenience.
They are contractual outputs.

---

## 2. Record Identity

Every Judgment Record must include immutable identifiers:

```
record_id: <uuid>
timestamp: <ISO-8601 UTC>
```

These identifiers uniquely define the judgment instance.

---

## 3. Authority Context (Mandatory)

Each record must bind the judgment to its authority sources:

```
authority:
  mandate_id: <string>
  mandate_version: <string>
  procedure_id: <string>
  procedure_version: <string>
```

Judgment without explicit authority context is invalid.

---

## 4. Invocation Context

The record must specify **why** the procedure was invoked:

```
invocation:
  trigger_type: <enum>
  trigger_description: <string>
  persistence_evidence: <string | null>
```

Valid `trigger_type` values include:

* state_change
* threshold_breach
* confidence_degradation
* scheduled_review

---

## 5. Observed State Snapshot

The record must capture a minimal, sufficient snapshot of the relevant state
at time of judgment.

```
state:
  portfolio_summary:
    key_exposures: <dict>
    liquidity_position: <summary>
    leverage_level: <value>

  environment_summary:
    regime_state: <string>
    key_uncertainties: <list>
```

This snapshot must be sufficient to:

* understand the judgment,
* reproduce the reasoning,
* explain the outcome later.

It must **not** attempt to capture the entire system state.

---

## 6. Judgment Outcome (Required)

Each record must specify exactly one outcome:

```
outcome:
  type: <enum>
  description: <string>
```

Valid `outcome.type` values:

* affirm_alignment
* recommend_adjustment
* escalate

Multiple outcomes are prohibited.

---

## 7. Adjustment Recommendation (Conditional)

If `outcome.type == recommend_adjustment`, the record must include:

```
adjustment:
  adjustment_unit: exposure
  recommended_changes: <structured description>
  mandate_constraints_checked: true
```

Trade lists, position identifiers, or execution instructions are prohibited.

---

## 8. Inaction Justification (Conditional)

If `outcome.type == affirm_alignment`, the record must include:

```
inaction:
  justification: <string>
  risks_acknowledged: <list>
```

Implicit inaction is invalid.

---

## 9. Escalation Detail (Conditional)

If `outcome.type == escalate`, the record must include:

```
escalation:
  escalation_reason: <string>
  human_authority_required: <list>
  automated_actions_suspended: true
```

After escalation, no further automated judgment may occur without explicit
human authorization.

---

## 10. Confidence Assessment (Mandatory)

Every record must include an explicit confidence assessment:

```
confidence:
  level: <float between 0 and 1>
  trend: <enum: improving | stable | degrading>
  attribution: <string>
```

Confidence may not be omitted, inferred, or implied.

---

## 11. Constraint Checks (Mandatory)

The record must explicitly state whether any mandate constraints
were approached or breached:

```
constraints:
  hard_constraints_breached: <bool>
  constraints_at_risk: <list>
```

Silent constraint violations are prohibited.

---

## 12. Procedural Compliance Declaration

Each record must include a compliance assertion:

```
compliance:
  procedure_followed: true
  deviations: null
```

If deviations exist, the only valid outcome is escalation.

---

## 13. Behavioral Telemetry (Required)

Each record must include minimal, deterministic behavior metadata:

```
behavior:
  tool_calls: <int>
  procedure_branches_taken: <list>
  decision_latency_ms: <int>
  escalated: <bool>
  inaction: <bool>
```

This section is intentionally minimal and must not include external telemetry
or performance analytics. It exists only to support audit and procedural drift
detection.

---

## 14. Audit and Retention Metadata

```
audit:
  retained_until: <ISO-8601 date>
  immutable: true
  superseded_by: <record_id | null>
```

Judgment Records are append-only.
Revision is accomplished by supersession, not mutation.

---

## 15. Interpretation Rules

Judgment Records are interpreted under the following hierarchy:

1. Human fiduciary authority
2. Judgment Authority Contract
3. Governing mandate
4. Procedure Contract
5. Judgment Record
6. Implementation code

If conflict exists, escalation is required.

---

## 16. Summary

A Judgment Record is the **unit of accountability** in this repository.

If a decision cannot be reconstructed from its Judgment Record,
it must be treated as **unauthorized**, regardless of outcome.

---

**Maintainer:**
Colin Alexander, CFA, CIPM

**Effective upon adoption**
