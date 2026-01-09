# Rate Regime Adjustment — Regulatory Judgment Procedure

**Path:** `judgment_loops/rate_regime_adjustment/procedure.md`

**Authority Source:** `mandates/liability_driven/db_pension_v1/mandate.yaml` (v1.0, effective 2026-01-01)

**Binding Rule:** All numeric limits, confidence requirements, and breach actions referenced in this procedure
are sourced directly from the governing `mandate.yaml`. This procedure may not reinterpret or override mandate fields.
Trigger thresholds (e.g., persistence windows) are sourced only from
`judgment_loops/rate_regime_adjustment/thresholds.yaml` and must not duplicate
mandate constraints.

---

## 1. Purpose and Regulatory Standing

This procedure governs how changes in the interest-rate regime are identified, interpreted, and acted upon within a
**liability-driven, solvency-critical** mandate. It is designed to ensure that responses to rate regime shifts:

* Preserve the exclusive benefit of beneficiaries,
* Maintain funding adequacy and liquidity sufficiency,
* Avoid pro-cyclical or return-seeking behavior under the guise of risk management, and
* Remain auditable, explainable, and reversible.

This document is **procedural**, not discretionary. It defines *how judgments are formed*, not *what positions must be taken*.

---

## 2. Definition of a Rate Regime Event

A **rate regime event** is deemed to exist when one or more of the following conditions are met:

1. **Structural Shift Indicators**  
   Evidence of a sustained change in the level, slope, or volatility of the yield curve that materially alters liability valuation
   or hedge effectiveness.

2. **Confidence Degradation Trigger**  
   Model-implied confidence in liability hedging or funding projections falls below the minimum confidence level
   specified in the governing mandate *and* the degradation is attributable primarily to rate uncertainty.

3. **Convexity Stress Signal**  
   Non-linear sensitivity of liabilities to rate changes materially increases forecast dispersion over the mandate’s
   shortfall-risk horizon.

A single data print does **not** constitute a regime event. Persistence and cross-confirmation are required.

### 2.1 Persistence Standard (Minimum)

Unless an escalation is triggered immediately by a hard-constraint breach or confidence collapse, **persistence** is defined as:

- Confirmation across the minimum review-cycle count defined in
  `judgment_loops/rate_regime_adjustment/thresholds.yaml`, aligned to the mandate’s monitoring frequency.

If the mandate specifies a different monitoring cadence for any relevant constraint, that cadence governs.

---

## 3. Regulatory Interpretation Principles

All rate-related judgments must adhere to the following principles:

* **Liability First:** Asset behavior is evaluated solely through its impact on liability coverage and solvency metrics.
* **No Implied Rate Views:** The system does not express directional macroeconomic opinions. It assesses *exposure consistency*
  under alternative rate states.
* **Asymmetry Awareness:** Downside funding risk receives greater weight than upside return opportunity.
* **Inaction Is Valid:** Failure to act may be the correct regulatory outcome if procedural justification is documented.

---

## 4. Permitted Analytical Actions

Upon identification of a rate regime event, the system may perform the following:

* Re-estimate liability duration and convexity under updated rate assumptions.
* Evaluate hedge effectiveness of fixed income and derivative overlays.
* Stress liquidity buffers under rate-driven market dislocations.
* Generate *recommendations* for exposure adjustment or inaction.

No action taken at this stage alters portfolio state.

---

## 5. Adjustment Decision Framework

### 5.1 Eligible Adjustments

Only the following adjustment *types* may be recommended:

* Incremental duration realignment toward updated liability estimates.
* Reduction of rate-sensitive leverage if gross exposure approaches mandate limits.
* Liquidity buffer enhancement where rate volatility threatens near-term cashflows.

All recommendations must be expressed as **exposure adjustments** (not trade lists) and must remain within the ranges and
constraints defined by the governing mandate.

### 5.2 Prohibited Adjustments

The following are explicitly disallowed:

* Increasing rate exposure to enhance expected returns.
* Introducing new instruments to speculate on rate direction.
* Re-defining the liability benchmark, evaluation horizon, or any mandate objective.

---

## 6. Escalation and Human Oversight

Mandatory escalation is triggered if any of the following occur during rate regime analysis:

* Funding ratio projected to breach the mandate minimum within the mandate’s shortfall horizon.
* Gross exposure required for hedging exceeds the mandate maximum gross exposure.
* Illiquid assets materially impair the mandate’s stress liquidity horizon.
* Regime uncertainty remains elevated across multiple review cycles under the persistence standard in §2.1.

Escalation transfers authority to the Investment Committee. No automated override is permitted.

---

## 7. Documentation and Audit Requirements

Each invocation of this procedure must produce a **Rate Regime Judgment Record** containing:

* Triggering indicators and persistence evidence (including review-cycle timestamps).
* Summary of analytical findings and the liability impact pathway.
* Recommended action *or* justified inaction.
* Confidence assessment and trend (including attribution to rate uncertainty).
* Constraint checks and any breach flags.
* Escalation decision (if any) and the explicit reason.

Records must be retained for the minimum period specified by the governing mandate and must be version-linked to:

- the governing `mandate.yaml` version, and
- the active procedure version (this document).

---

## 8. Definition of Procedural Compliance

This procedure is considered properly executed if:

* No hard risk constraints are silently violated.
* All recommendations remain within stated authority and mandate bounds.
* Inaction decisions include explicit justification tied to mandate alignment.
* Human authority is engaged where required.
* Outputs are logged, version-linked, and auditable.

Failure to follow this procedure constitutes a **process failure**, regardless of financial outcome.

---

**Regulatory Note:**  
Rate regime uncertainty is not a justification for expanding discretion. It is a condition requiring **stricter adherence** to
mandate hierarchy and documented judgment.
