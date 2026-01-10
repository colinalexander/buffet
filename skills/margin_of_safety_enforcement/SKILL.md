# SKILL: Margin of Safety Enforcement

## Summary
Margin of Safety Enforcement is the skill of requiring a meaningful buffer between
intrinsic value and committed capital in order to protect against uncertainty,
error, and adverse outcomes. It operationalizes humility by ensuring that favorable
investment outcomes do not depend on precise forecasts or fragile assumptions.

This skill converts valuation judgment into admissibility discipline.

---

## Judgment Role
This skill functions as a **protective constraint and veto layer**.

It determines whether an opportunity is:
- sufficiently protected to proceed,
- conditionally acceptable with adjustments, or
- inadmissible regardless of quality.

No capital may be committed downstream without passing this skill or being explicitly
escalated.

---

## Judgment Checkpoints

### Checkpoint 1: Uncertainty Compensation Test
**Purpose:**  
Ensure the margin of safety explicitly compensates for identifiable uncertainties.

**Key Questions:**
- What specific uncertainties are being buffered?
- Are risks structural, cyclical, or idiosyncratic?
- Is the margin proportionate to uncertainty?

**Required Evidence / Inputs:**
- Intrinsic value range
- Identified uncertainty sources

**Expected Outputs:**
- Judgment Record specifying uncertainty-adjusted buffer rationale

**Failure Modes Guarded Against:**
- Arbitrary discounting
- Overconfidence in base-case outcomes

**Escalation Criteria:**
- Margin is justified without reference to uncertainty

---

### Checkpoint 2: Downside Survivability Scan
**Purpose:**  
Assess whether adverse outcomes remain survivable even if assumptions fail.

**Key Questions:**
- What happens if key assumptions are wrong?
- Is permanent capital impairment plausible?
- Does downside violate mandate tolerance?

**Required Evidence / Inputs:**
- Downside scenario narratives
- Balance sheet and cash flow resilience assessment

**Expected Outputs:**
- Judgment Record with downside survivability assessment

**Failure Modes Guarded Against:**
- Treating volatility as risk
- Ignoring tail scenarios

**Escalation Criteria:**
- Non-trivial probability of irreversible loss

---

### Checkpoint 3: Price Discipline Gate
**Purpose:**  
Prevent price anchoring and action bias from eroding discipline.

**Key Questions:**
- Would we still proceed if price declined further?
- Is urgency influencing judgment?
- Does price embed optimism or pessimism?

**Required Evidence / Inputs:**
- Current price vs value range
- Historical price context (non-predictive)

**Expected Outputs:**
- Judgment Record affirming or rejecting price discipline

**Failure Modes Guarded Against:**
- Fear of missing out
- Price momentum substitution

**Escalation Criteria:**
- Decision driven primarily by recent price movement

---

## Authority Boundaries
- **Humans:** Full authority to approve or reject.
- **Models:** Advisory only; may compute buffers and flag breaches.
- **Prohibited:** Models may not waive margin requirements.

This skill may NOT be overridden silently; all overrides require escalation records.

---

## Time Horizon
- Primary horizon: Entire holding period
- Secondary horizon: Stress and crisis periods

Margin of safety should widen as uncertainty increases, not compress.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- intrinsic_value_estimation
- business_quality_assessment

**Downstream (feeds into):**
- capital_allocation_judgment
- permanent_capital_loss_avoidance
- patience_as_active_strategy

---

## Auditability & Records
- Margin rationale recorded explicitly
- Overrides require documented escalation
- Post-mortem reviews required when margin fails
- Records retained permanently

---

## Common Misuse Patterns
- Using volatility as a proxy for safety
- Applying uniform margins across heterogeneous risks
- Compressing margins during favorable markets

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Margin of safety is not a formula. It is a judgment buffer that reflects
what we do not know, not what we believe.
