# SKILL: Permanent Capital Loss Avoidance

## Summary
Permanent Capital Loss Avoidance is the skill of identifying and preventing scenarios
in which invested capital is irreversibly impaired. It explicitly distinguishes
between temporary volatility and permanent loss, treating survivability as a
non-negotiable constraint.

This skill prioritizes staying in the game over maximizing returns.

---

## Judgment Role
This skill functions as a **hard downside veto**.

It ensures that no decision exposes the system to a non-trivial probability of
irrecoverable loss, regardless of expected return, valuation attractiveness, or
strategic appeal.

---

## Judgment Checkpoints

### Checkpoint 1: Irreversibility Identification
**Purpose:**  
Identify conditions under which capital cannot be recovered.

**Key Questions:**
- What scenarios permanently destroy capital?
- Are losses recoverable through time or cash flow?
- Do any paths lead to zero or near-zero outcomes?

**Required Evidence / Inputs:**
- Balance sheet and leverage analysis
- Structural failure scenarios

**Expected Outputs:**
- Judgment Record identifying irreversibility risks

**Failure Modes Guarded Against:**
- Volatility-loss confusion
- Ignoring tail outcomes

**Escalation Criteria:**
- Plausible scenarios of irreversible loss exist

---

### Checkpoint 2: Leverage and Fragility Scan
**Purpose:**  
Detect explicit or implicit leverage that amplifies downside.

**Key Questions:**
- Is leverage present directly or indirectly?
- How does leverage behave under stress?
- Are margin calls, covenants, or liquidity cliffs present?

**Required Evidence / Inputs:**
- Debt structure details
- Liquidity and covenant analysis

**Expected Outputs:**
- Judgment Record assessing leverage-induced fragility

**Failure Modes Guarded Against:**
- Hidden leverage
- Liquidity mismatches

**Escalation Criteria:**
- Leverage introduces loss amplification beyond mandate tolerance

---

### Checkpoint 3: Survivability Stress Test
**Purpose:**  
Ensure the business survives adverse environments.

**Key Questions:**
- Can the business survive severe but plausible stress?
- Does survival require external rescue?
- Is dilution or forced restructuring likely?

**Required Evidence / Inputs:**
- Stress scenario narratives
- Cash flow and liquidity buffers

**Expected Outputs:**
- Judgment Record affirming or rejecting survivability

**Failure Modes Guarded Against:**
- Overreliance on favorable conditions
- Assuming access to capital markets

**Escalation Criteria:**
- Survival depends on continued market access

---

## Authority Boundaries
- **Humans:** Full authority; cannot waive without formal escalation.
- **Models:** Advisory only; may flag fragility and stress scenarios.
- **Prohibited:** Models may not approve exposure with irreversible loss risk.

This skill supersedes return optimization and valuation.

---

## Time Horizon
- Primary horizon: Entire holding period
- Secondary horizon: Crisis environments

Permanent loss risk must be assessed continuously.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- risk_asymmetry_recognition
- margin_of_safety_enforcement
- simplicity_preference

**Downstream (feeds into):**
- patience_as_active_strategy
- institutional_constraint_awareness

---

## Auditability & Records
- Irreversibility scenarios documented
- Stress assumptions recorded
- Post-crisis reviews mandatory
- Records retained permanently

---

## Common Misuse Patterns
- Treating volatility drawdowns as loss
- Ignoring low-probability catastrophic scenarios
- Assuming bailouts or rescues

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Losses that can be recovered are tolerable.
Losses that cannot be recovered are not.
