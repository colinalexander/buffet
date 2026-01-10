# SKILL: Risk Asymmetry Recognition

## Summary
Risk Asymmetry Recognition is the skill of evaluating the shape of potential outcomes
rather than their averages. It focuses on identifying situations where downside is
limited and survivable while upside remains meaningful, and avoiding situations
where losses are open-ended or irreversible.

This skill treats payoff shape—not volatility—as the core expression of risk.

---

## Judgment Role
This skill functions as a **payoff-shape validator**.

It determines whether an opportunity’s outcome distribution is compatible with
long-term compounding and institutional survivability, independent of expected
return estimates.

---

## Judgment Checkpoints

### Checkpoint 1: Downside Boundedness Assessment
**Purpose:**  
Determine whether losses are naturally capped or structurally constrained.

**Key Questions:**
- What is the worst plausible outcome?
- Is loss magnitude bounded or unbounded?
- What mechanisms enforce limits on loss?

**Required Evidence / Inputs:**
- Balance sheet resilience analysis
- Contractual, regulatory, or structural protections

**Expected Outputs:**
- Judgment Record describing downside boundaries

**Failure Modes Guarded Against:**
- Hidden leverage
- Unrecognized tail exposure

**Escalation Criteria:**
- Downside is open-ended or poorly bounded

---

### Checkpoint 2: Upside Optionality Verification
**Purpose:**  
Assess whether favorable outcomes can compound meaningfully without proportional risk.

**Key Questions:**
- What must go right for upside to occur?
- Is upside scalable or capped?
- Does upside require continued perfection?

**Required Evidence / Inputs:**
- Growth and reinvestment pathways
- Historical evidence of optionality

**Expected Outputs:**
- Judgment Record describing upside drivers

**Failure Modes Guarded Against:**
- Overstated optionality
- Asymmetric optimism

**Escalation Criteria:**
- Upside depends on narrow or fragile conditions

---

### Checkpoint 3: Asymmetry Integrity Test
**Purpose:**  
Ensure perceived asymmetry is real, not narrative-driven.

**Key Questions:**
- Are downside and upside evaluated on comparable footing?
- Are low-probability losses being discounted improperly?
- Is asymmetry structural or situational?

**Required Evidence / Inputs:**
- Side-by-side downside and upside narratives
- Stress scenario evaluation

**Expected Outputs:**
- Judgment Record affirming or rejecting asymmetry

**Failure Modes Guarded Against:**
- Ignoring tail risks
- Mislabeling volatility as asymmetry

**Escalation Criteria:**
- Asymmetry collapses under modest stress assumptions

---

## Authority Boundaries
- **Humans:** Full authority to assess and approve.
- **Models:** Advisory only; may enumerate scenarios and distributions.
- **Prohibited:** Models may not approve asymmetry independently.

This skill may veto opportunities regardless of valuation attractiveness.

---

## Time Horizon
- Primary horizon: Entire holding period
- Secondary horizon: Stress and crisis environments

Asymmetry should improve—not deteriorate—over time.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- margin_of_safety_enforcement
- intrinsic_value_estimation

**Downstream (feeds into):**
- permanent_capital_loss_avoidance
- patience_as_active_strategy
- scale_aware_decision_making

---

## Auditability & Records
- Payoff shape narratives recorded
- Stress assumptions documented
- Revisited after major structural changes
- Records retained permanently

---

## Common Misuse Patterns
- Equating high upside with asymmetry
- Ignoring correlation and systemic risk
- Treating models as sufficient proof of bounded loss

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
True asymmetry survives pessimism. If upside vanishes when assumptions are tightened,
it was never asymmetric.
