# SKILL: Business Quality Assessment

## Summary
Business Quality Assessment is the skill of determining whether a business possesses
durable economic characteristics that enable reliable long-term value creation.
It focuses on *what the business is*, not how it is priced, and establishes whether
the enterprise is suitable for capital commitment at all.

This skill precedes valuation and acts as a primary admissibility filter for investment
judgment.

---

## Judgment Role
This skill functions as a **gatekeeping constraint** in the investment decision loop.

It determines whether a candidate business is:
- admissible for further analysis,
- admissible only under restrictive assumptions, or
- inadmissible regardless of price.

Failure at this stage halts downstream judgment unless explicitly escalated.

---

## Judgment Checkpoints

### Checkpoint 1: Business Durability Gate
**Purpose:**  
Assess whether the business can sustain its economic function and relevance
over the mandate horizon.

**Key Questions:**
- What core customer problem does the business solve?
- Why does this business continue to exist in its current form?
- What specific forces could erode its position over time?

**Required Evidence / Inputs:**
- Business model description
- Industry structure overview
- Historical persistence of demand

**Expected Outputs:**
- Judgment Record: affirm_alignment | recommend_adjustment | escalate
- Rationale describing durability drivers and threats

**Failure Modes Guarded Against:**
- Narrative-driven enthusiasm
- Confusion between growth and durability

**Escalation Criteria:**
- Durability depends primarily on continued excellence or favorable conditions

---

### Checkpoint 2: Economic Simplicity Test
**Purpose:**  
Ensure the business economics are understandable, explainable, and monitorable.

**Key Questions:**
- Can the source of profits be explained end-to-end in plain language?
- Are margins and returns driven by structural factors or transient conditions?
- Can ongoing performance be monitored without complex proxies?

**Required Evidence / Inputs:**
- Simplified income and cash flow drivers
- Explanation of cost and pricing power

**Expected Outputs:**
- Judgment Record with explanation of economic clarity

**Failure Modes Guarded Against:**
- Hidden leverage
- Complexity obscuring risk

**Escalation Criteria:**
- Economics cannot be articulated without layered assumptions

---

### Checkpoint 3: Competitive Position Verification
**Purpose:**  
Determine whether the business holds a defensible position relative to competitors.

**Key Questions:**
- What prevents competitors from replicating this business?
- Is advantage structural, contractual, regulatory, or behavioral?
- How has the competitive position changed historically?

**Required Evidence / Inputs:**
- Competitive landscape analysis
- Historical ROIC vs peers

**Expected Outputs:**
- Judgment Record with identified advantage sources

**Failure Modes Guarded Against:**
- Temporary advantage mistaken for moat
- Brand or scale over-attribution

**Escalation Criteria:**
- Advantage depends on continuous aggressive behavior to sustain

---

## Authority Boundaries
- **Humans:** Full authority to affirm, adjust, or reject.
- **Models:** Advisory only; may summarize evidence and flag concerns.
- **Prohibited:** Models may not independently admit a business past this skill.

This skill explicitly may NOT decide valuation, timing, or position sizing.

---

## Time Horizon
- Primary horizon: 10+ years
- Secondary horizon: Full business cycle

Judgments should degrade slowly and change only with structural evidence.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- None (this is an entry-point skill)

**Downstream (feeds into):**
- intrinsic_value_estimation
- margin_of_safety_enforcement
- structural_advantage_identification

---

## Auditability & Records
- Judgment Records stored as append-only assessments
- Required narrative rationale (no numeric-only approvals)
- Review cadence: upon major business model or industry change
- Records retained indefinitely

---

## Common Misuse Patterns
- Confusing rapid growth with quality
- Treating managerial brilliance as a substitute for structure
- Allowing valuation attractiveness to override quality concerns

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
A business that fails this skill cannot be rescued by valuation alone without
explicit escalation and documented rationale.

# SKILL: Intrinsic Value Estimation

## Summary
Intrinsic Value Estimation is the skill of forming a conservative, owner-oriented
assessment of what a business is worth based on its long-term capacity to generate
distributable cash flows. It explicitly rejects market price as a signal of value
and treats valuation as an exercise in judgment under uncertainty, not precision.

This skill produces a *value range*, not a point estimate.

---

## Judgment Role
This skill functions as a **calibration and bounding mechanism** in the decision loop.

It does not decide whether to invest, but establishes:
- what must be true for value to be realized,
- how sensitive value is to assumptions,
- and whether price can later be evaluated against value.

Downstream skills may not override this assessment without escalation.

---

## Judgment Checkpoints

### Checkpoint 1: Owner Earnings Integrity Check
**Purpose:**  
Ensure that value estimation is grounded in true economic earnings rather than
reported accounting results.

**Key Questions:**
- What cash is genuinely available to owners over time?
- What level of reinvestment is required to sustain the business?
- Which earnings components are non-recurring or illusory?

**Required Evidence / Inputs:**
- Historical cash flow statements
- Maintenance vs growth capex assessment
- Normalization assumptions

**Expected Outputs:**
- Judgment Record with defined owner-earnings range
- Explicit exclusions and adjustments

**Failure Modes Guarded Against:**
- Reliance on GAAP earnings alone
- Capitalizing cyclical peaks

**Escalation Criteria:**
- Owner earnings cannot be reasonably estimated

---

### Checkpoint 2: Assumption Transparency Test
**Purpose:**  
Force explicit articulation of assumptions driving intrinsic value.

**Key Questions:**
- Which assumptions matter most to value?
- Are assumptions structural or forecast-driven?
- How fragile is value to small changes?

**Required Evidence / Inputs:**
- Written valuation assumptions
- Sensitivity analysis (qualitative or quantitative)

**Expected Outputs:**
- Judgment Record listing key assumptions and sensitivities

**Failure Modes Guarded Against:**
- Hidden optimism
- Implicit growth assumptions

**Escalation Criteria:**
- Value depends on narrow or heroic assumptions

---

### Checkpoint 3: Valuation Range Discipline
**Purpose:**  
Prevent false precision and encourage humility in valuation.

**Key Questions:**
- What is a conservative low-end value?
- What would justify the high-end value?
- Where does uncertainty dominate estimation?

**Required Evidence / Inputs:**
- Value range construction
- Narrative explanation of bounds

**Expected Outputs:**
- Judgment Record specifying a valuation range
- Confidence level commentary

**Failure Modes Guarded Against:**
- Single-number fixation
- Overconfidence in models

**Escalation Criteria:**
- Inability to define a credible lower bound

---

## Authority Boundaries
- **Humans:** Full authority to approve valuation ranges.
- **Models:** May generate scenarios, sensitivities, and summaries; advisory only.
- **Prohibited:** Models may not set final valuation bounds without human sign-off.

This skill may NOT determine purchase decisions or sizing.

---

## Time Horizon
- Primary horizon: 5–15 years
- Secondary horizon: Business lifetime

Short-term fluctuations are explicitly excluded from consideration.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- business_quality_assessment

**Downstream (feeds into):**
- margin_of_safety_enforcement
- capital_allocation_judgment
- owner_mindset_reasoning

---

## Auditability & Records
- All valuation judgments recorded with assumptions and ranges
- No approval without written rationale
- Revisions must reference changed assumptions or evidence
- Retained as permanent Judgment Records

---

## Common Misuse Patterns
- Treating valuation models as truth engines
- Anchoring on recent prices
- Allowing growth narratives to substitute for cash flow analysis

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Intrinsic value is an estimate, not a fact. Precision is not accuracy.
The purpose of this skill is disciplined reasoning, not numerical elegance.

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

# SKILL: Capital Allocation Judgment

## Summary
Capital Allocation Judgment is the skill of deciding how incremental capital should
be deployed to maximize long-term per-unit value creation. It treats capital as
scarce, reversible only at cost, and always subject to opportunity cost.

This skill governs *where capital goes*, not whether a business is good.

---

## Judgment Role
This skill functions as a **comparative decision layer**.

It determines whether allocating capital to a given opportunity is superior to:
- alternative investments,
- internal reinvestment,
- capital return,
- or holding cash.

This skill explicitly forces trade-offs; no allocation is evaluated in isolation.

---

## Judgment Checkpoints

### Checkpoint 1: Incremental Return Comparator
**Purpose:**  
Ensure capital is allocated to its highest long-term use.

**Key Questions:**
- What is the expected long-term return on incremental capital here?
- What is the next-best alternative use of this capital?
- How sensitive is the comparison to assumptions?

**Required Evidence / Inputs:**
- Expected return narratives (not point forecasts)
- Alternative allocation options

**Expected Outputs:**
- Judgment Record comparing allocation options
- Explicit opportunity cost rationale

**Failure Modes Guarded Against:**
- Absolute-return thinking
- Ignoring internal alternatives

**Escalation Criteria:**
- No credible comparison to alternatives

---

### Checkpoint 2: Reinvestment Quality Assessment
**Purpose:**  
Evaluate whether the recipient of capital can deploy it effectively.

**Key Questions:**
- Has incremental capital historically produced attractive returns?
- Are reinvestment opportunities repeatable or diminishing?
- Does scale impair reinvestment quality?

**Required Evidence / Inputs:**
- Historical incremental ROIC
- Reinvestment track record

**Expected Outputs:**
- Judgment Record on reinvestment effectiveness

**Failure Modes Guarded Against:**
- Growth for growth’s sake
- Capital absorption bias

**Escalation Criteria:**
- Evidence of declining marginal returns

---

### Checkpoint 3: Capital Flexibility Review
**Purpose:**  
Assess reversibility and optionality of the allocation.

**Key Questions:**
- Can capital be reallocated if conditions change?
- What is the cost of being wrong?
- Does this allocation constrain future decisions?

**Required Evidence / Inputs:**
- Liquidity and exit considerations
- Commitment duration assessment

**Expected Outputs:**
- Judgment Record addressing flexibility and lock-in risk

**Failure Modes Guarded Against:**
- Irreversible commitments without compensation
- Hidden long-term constraints

**Escalation Criteria:**
- Allocation materially limits future optionality

---

## Authority Boundaries
- **Humans:** Full authority to approve allocations.
- **Models:** Advisory only; may surface comparisons and constraints.
- **Prohibited:** Models may not optimize allocation autonomously.

This skill may NOT override margin of safety requirements.

---

## Time Horizon
- Primary horizon: Multi-year to permanent
- Secondary horizon: Capital redeployment cycle

Capital allocation decisions should age slowly and change only with evidence.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- margin_of_safety_enforcement
- intrinsic_value_estimation
- opportunity_cost_awareness

**Downstream (feeds into):**
- patience_as_active_strategy
- scale_aware_decision_making
- institutional_constraint_awareness

---

## Auditability & Records
- Allocation decisions recorded with explicit alternatives considered
- Re-evaluated upon major capital changes
- Post-allocation reviews required
- Records retained permanently

---

## Common Misuse Patterns
- Treating cash as a drag rather than an option
- Confusing activity with progress
- Allocating to justify prior analysis

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Capital allocation is the ultimate expression of judgment.
Every dollar deployed is a decision not to deploy it elsewhere.

# SKILL: Incentive Alignment Analysis

## Summary
Incentive Alignment Analysis is the skill of evaluating whether the motivations,
rewards, and constraints facing decision-makers are aligned with long-term
per-unit value creation. It treats incentives as structural forces that shape
behavior over time, often more reliably than stated intentions or reputations.

This skill ensures that capital is entrusted to stewards whose interests run
parallel to those of long-term owners.

---

## Judgment Role
This skill functions as a **behavioral risk control**.

It does not assess competence or intelligence, but determines whether the system
of incentives encourages decisions that are beneficial—or harmful—to owners
over the mandate horizon.

Misalignment here can invalidate otherwise attractive opportunities.

---

## Judgment Checkpoints

### Checkpoint 1: Economic Alignment Test
**Purpose:**  
Assess whether decision-makers benefit in the same way and timeframe as owners.

**Key Questions:**
- How do decision-makers make or lose money personally?
- Is compensation tied to per-share value or aggregate metrics?
- Over what horizon are rewards realized?

**Required Evidence / Inputs:**
- Compensation structure details
- Ownership and equity participation
- Vesting and clawback terms

**Expected Outputs:**
- Judgment Record describing alignment strength and gaps

**Failure Modes Guarded Against:**
- Short-termism
- Size-over-value incentives

**Escalation Criteria:**
- Compensation rewards behavior that harms long-term owners

---

### Checkpoint 2: Incentive-Induced Behavior Scan
**Purpose:**  
Identify behaviors the incentive system is likely to produce, intentionally or not.

**Key Questions:**
- What actions are being encouraged?
- What actions are being discouraged?
- What risks are being externalized?

**Required Evidence / Inputs:**
- Historical behavior under similar incentives
- Peer compensation comparisons

**Expected Outputs:**
- Judgment Record outlining likely behavioral patterns

**Failure Modes Guarded Against:**
- Metric gaming
- Risk transfer to stakeholders

**Escalation Criteria:**
- Incentives promote excessive risk-taking or dilution

---

### Checkpoint 3: Stewardship Signal Review
**Purpose:**  
Evaluate qualitative signals of stewardship beyond formal incentives.

**Key Questions:**
- How are capital allocation decisions explained?
- How are mistakes acknowledged?
- Is communication candid and consistent?

**Required Evidence / Inputs:**
- Shareholder communications
- Capital allocation history
- Related-party transactions

**Expected Outputs:**
- Judgment Record assessing stewardship credibility

**Failure Modes Guarded Against:**
- Charisma bias
- Overreliance on stated values

**Escalation Criteria:**
- Repeated behavior inconsistent with owner interests

---

## Authority Boundaries
- **Humans:** Full authority; judgment-heavy and contextual.
- **Models:** Advisory only; may flag misalignments and summarize structures.
- **Prohibited:** Models may not approve alignment independently.

This skill may override valuation attractiveness if misalignment is severe.

---

## Time Horizon
- Primary horizon: Full tenure of decision-makers
- Secondary horizon: Incentive cycle and vesting periods

Incentive judgments should change only with structural modifications.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- business_quality_assessment
- capital_allocation_judgment

**Downstream (feeds into):**
- governance_and_trust_evaluation
- permanent_capital_loss_avoidance

---

## Auditability & Records
- Incentive structures documented explicitly
- Changes tracked over time
- Behavioral outcomes reviewed periodically
- Records retained permanently

---

## Common Misuse Patterns
- Assuming good people negate bad incentives
- Overweighting equity ownership without context
- Ignoring scale-driven incentive distortion

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Incentives do not determine outcomes, but they heavily influence the distribution
of outcomes. Ignoring them is a governance failure.

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

# SKILL: Long-Horizon Compounding Orientation

## Summary
Long-Horizon Compounding Orientation is the skill of evaluating decisions based on
their ability to increase per-unit value over extended periods of time. It prioritizes
durability, reinvestment capacity, and cumulative effects over short-term performance,
reporting outcomes, or market reactions.

This skill anchors judgment in decades rather than quarters.

---

## Judgment Role
This skill functions as a **temporal alignment constraint**.

It ensures that investment decisions are evaluated primarily on their long-term
compounding consequences, and that near-term metrics do not distort judgment or
override durable value creation.

---

## Judgment Checkpoints

### Checkpoint 1: Compounding Pathway Identification
**Purpose:**  
Identify how value compounds over time if the decision is correct.

**Key Questions:**
- What exactly compounds: earnings, cash flows, competitive position, or optionality?
- Is compounding linear, accelerating, or self-limiting?
- What breaks the compounding process?

**Required Evidence / Inputs:**
- Reinvestment pathways
- Historical compounding evidence

**Expected Outputs:**
- Judgment Record describing compounding mechanisms

**Failure Modes Guarded Against:**
- Confusing growth with compounding
- Assuming persistence without cause

**Escalation Criteria:**
- No clear mechanism for long-term compounding

---

### Checkpoint 2: Time Arbitrage Validation
**Purpose:**  
Ensure the decision benefits from patience rather than speed.

**Key Questions:**
- Does value accrue with time independent of market recognition?
- Are short-term underperformance risks acceptable?
- Is patience being rewarded structurally?

**Required Evidence / Inputs:**
- Time-based value drivers
- Historical lag between value creation and recognition

**Expected Outputs:**
- Judgment Record affirming or rejecting time arbitrage

**Failure Modes Guarded Against:**
- Performance-chasing
- Short-horizon pressure

**Escalation Criteria:**
- Thesis requires rapid validation or market approval

---

### Checkpoint 3: Compounding Integrity Stress Test
**Purpose:**  
Test whether compounding survives adverse or stagnant environments.

**Key Questions:**
- How does the compounding engine behave in flat or hostile conditions?
- Can value still accrue without growth?
- Does compounding reverse under stress?

**Required Evidence / Inputs:**
- Down-cycle performance analysis
- Stress narratives

**Expected Outputs:**
- Judgment Record evaluating compounding resilience

**Failure Modes Guarded Against:**
- Cyclicality misclassified as compounding
- Fragile growth dependence

**Escalation Criteria:**
- Compounding collapses outside favorable regimes

---

## Authority Boundaries
- **Humans:** Full authority; requires qualitative judgment.
- **Models:** Advisory only; may project scenarios but not validate durability.
- **Prohibited:** Models may not certify compounding durability.

This skill may override attractive short-term opportunities.

---

## Time Horizon
- Primary horizon: 10–30 years
- Secondary horizon: Multiple business cycles

Judgment should remain stable across market regimes.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- business_quality_assessment
- capital_allocation_judgment
- risk_asymmetry_recognition

**Downstream (feeds into):**
- patience_as_active_strategy
- owner_mindset_reasoning
- scale_aware_decision_making

---

## Auditability & Records
- Compounding logic documented explicitly
- Reviewed only upon structural change
- Post-mortems assess compounding thesis validity
- Records retained permanently

---

## Common Misuse Patterns
- Labeling growth as compounding
- Assuming long-term automatically means safe
- Ignoring reinvestment limits

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Time is the ally of good businesses and the enemy of fragile ones.
This skill ensures we know which is which.


# SKILL: Circle of Competence Enforcement

## Summary
Circle of Competence Enforcement is the skill of constraining judgment to domains
where causal understanding is sufficient to support confident, durable decisions.
It prioritizes knowability over cleverness and explicitly treats acknowledged
ignorance as a strength rather than a weakness.

This skill defines what the system is permitted to judge.

---

## Judgment Role
This skill functions as a **domain admissibility constraint**.

It determines whether a business, industry, or situation falls within the
system’s knowable boundaries. Opportunities outside this boundary are excluded
unless explicitly escalated with justification.

---

## Judgment Checkpoints

### Checkpoint 1: Causal Comprehensibility Test
**Purpose:**  
Ensure the business can be understood end-to-end without reliance on opaque models
or second-order speculation.

**Key Questions:**
- Can causal drivers be explained in plain language?
- What must be true for this business to succeed?
- Where does understanding break down?

**Required Evidence / Inputs:**
- Written causal explanation
- Identification of unknowns

**Expected Outputs:**
- Judgment Record affirming or rejecting comprehensibility

**Failure Modes Guarded Against:**
- Mistaking familiarity for understanding
- Outsourcing understanding to experts

**Escalation Criteria:**
- Core drivers cannot be explained clearly

---

### Checkpoint 2: Boundary Honesty Assessment
**Purpose:**  
Force explicit acknowledgment of what is not understood.

**Key Questions:**
- Which variables are outside our understanding?
- Are unknowns central or peripheral?
- Are we compensating appropriately for ignorance?

**Required Evidence / Inputs:**
- Explicit unknowns list
- Risk mitigation strategies

**Expected Outputs:**
- Judgment Record documenting boundaries and unknowns

**Failure Modes Guarded Against:**
- Hidden ignorance
- Overconfidence

**Escalation Criteria:**
- Unknowns dominate outcome distribution

---

### Checkpoint 3: Monitoring Capability Verification
**Purpose:**  
Ensure the business can be monitored for degradation of assumptions.

**Key Questions:**
- What indicators signal deterioration?
- Are indicators observable and timely?
- Can changes be detected before damage is irreversible?

**Required Evidence / Inputs:**
- Monitoring metrics and triggers
- Historical early-warning signals

**Expected Outputs:**
- Judgment Record affirming monitorability

**Failure Modes Guarded Against:**
- Blind spots
- Delayed reaction risk

**Escalation Criteria:**
- No reliable way to monitor key assumptions

---

## Authority Boundaries
- **Humans:** Full authority to define competence boundaries.
- **Models:** Advisory only; may summarize known vs unknown factors.
- **Prohibited:** Models may not expand the circle autonomously.

This skill may veto opportunities regardless of valuation or attractiveness.

---

## Time Horizon
- Primary horizon: Persistent
- Secondary horizon: Reassessed upon learning or structural change

Circle boundaries should expand slowly and contract quickly.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- business_quality_assessment

**Downstream (feeds into):**
- intrinsic_value_estimation
- narrative_resistance
- patience_as_active_strategy

---

## Auditability & Records
- Circle definitions documented explicitly
- Boundary changes require justification
- Escalations reviewed by senior authority
- Records retained permanently

---

## Common Misuse Patterns
- Equating expertise access with understanding
- Expanding the circle under performance pressure
- Using complexity as justification

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Knowing what you do not understand is a competitive advantage.
This skill institutionalizes that insight.

# SKILL: Opportunity Cost Awareness

## Summary
Opportunity Cost Awareness is the skill of evaluating every decision relative to the
best available alternative use of capital, time, and attention. It treats capital as
scarce and recognizes that choosing one path necessarily forgoes others, including
the option to do nothing.

This skill prevents isolated decision-making and enforces comparative judgment.

---

## Judgment Role
This skill functions as a **relative evaluation constraint**.

It ensures that no investment, hold, or action is approved without explicit
comparison to realistic alternatives, including retaining flexibility.

---

## Judgment Checkpoints

### Checkpoint 1: Alternative Set Identification
**Purpose:**  
Force explicit enumeration of credible alternatives.

**Key Questions:**
- What are the realistic alternative uses of this capital?
- Is holding cash a viable option?
- Are internal opportunities being overlooked?

**Required Evidence / Inputs:**
- List of alternative allocations
- Capital availability context

**Expected Outputs:**
- Judgment Record listing evaluated alternatives

**Failure Modes Guarded Against:**
- False dichotomies
- Framing bias

**Escalation Criteria:**
- Alternatives are dismissed without analysis

---

### Checkpoint 2: Relative Attractiveness Comparison
**Purpose:**  
Assess the opportunity relative to alternatives on a common basis.

**Key Questions:**
- Why is this superior to the next-best option?
- What are we giving up by choosing this?
- Are differences material or marginal?

**Required Evidence / Inputs:**
- Comparative narratives
- Risk and return trade-off discussion

**Expected Outputs:**
- Judgment Record articulating comparative advantage

**Failure Modes Guarded Against:**
- Absolute-return fixation
- Anchoring on sunk analysis

**Escalation Criteria:**
- Superiority cannot be articulated clearly

---

### Checkpoint 3: Inaction Justification Test
**Purpose:**  
Ensure that action bias does not override discipline.

**Key Questions:**
- Is inaction preferable at this time?
- What improves by waiting?
- What decays by waiting?

**Required Evidence / Inputs:**
- Time-based considerations
- Market and internal conditions

**Expected Outputs:**
- Judgment Record affirming action or deliberate inaction

**Failure Modes Guarded Against:**
- Activity bias
- Fear of missing out

**Escalation Criteria:**
- Action justified primarily by discomfort with inactivity

---

## Authority Boundaries
- **Humans:** Full authority to weigh alternatives.
- **Models:** Advisory only; may surface alternatives and comparisons.
- **Prohibited:** Models may not force ranking-based decisions.

This skill may delay or veto action without rejecting the underlying thesis.

---

## Time Horizon
- Primary horizon: Allocation decision horizon
- Secondary horizon: Capital recycling cycle

Opportunity cost should be reassessed whenever conditions change materially.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- capital_allocation_judgment
- margin_of_safety_enforcement

**Downstream (feeds into):**
- patience_as_active_strategy
- market_noise_immunity

---

## Auditability & Records
- Alternatives explicitly recorded
- Inaction decisions documented and revisited
- Post-decision reviews assess foregone outcomes
- Records retained permanently

---

## Common Misuse Patterns
- Treating analysis effort as justification
- Comparing against straw-man alternatives
- Ignoring the value of optionality

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
The cost of a decision is not measured only by what happens next,
but by what could have happened instead.

# SKILL: Market Noise Immunity

## Summary
Market Noise Immunity is the skill of distinguishing information that alters intrinsic
value from information that merely reflects market sentiment, price movement, or
narrative shifts. It prevents reactive decision-making and ensures that judgment
remains anchored to fundamentals rather than fluctuations.

This skill enforces emotional and informational discipline.

---

## Judgment Role
This skill functions as a **signal-filtering constraint**.

It determines whether new information warrants a change in judgment or should be
explicitly ignored. It protects long-horizon decisions from short-term disturbances.

---

## Judgment Checkpoints

### Checkpoint 1: Value-Relevance Filter
**Purpose:**  
Determine whether new information affects intrinsic value.

**Key Questions:**
- Has the long-term earning power changed?
- Does the information alter business durability or economics?
- Is this information transient or structural?

**Required Evidence / Inputs:**
- Description of new information
- Linkage to intrinsic value drivers

**Expected Outputs:**
- Judgment Record affirming relevance or irrelevance

**Failure Modes Guarded Against:**
- Price movement as information
- Narrative amplification

**Escalation Criteria:**
- Unclear linkage between information and value

---

### Checkpoint 2: Sentiment vs Signal Discrimination
**Purpose:**  
Separate market psychology from fundamental change.

**Key Questions:**
- Is this information widely known or newly discovered?
- Is the reaction disproportionate to substance?
- Would this matter if markets were closed?

**Required Evidence / Inputs:**
- Market reaction context
- Historical analogs

**Expected Outputs:**
- Judgment Record classifying information as signal or noise

**Failure Modes Guarded Against:**
- Herd behavior
- Overreaction

**Escalation Criteria:**
- Difficulty disentangling sentiment from fundamentals

---

### Checkpoint 3: Response Discipline Gate
**Purpose:**  
Prevent unnecessary action in response to noise.

**Key Questions:**
- Does this warrant action now?
- What is the cost of doing nothing?
- Does patience improve outcomes?

**Required Evidence / Inputs:**
- Action vs inaction analysis
- Time horizon considerations

**Expected Outputs:**
- Judgment Record affirming action or deliberate inaction

**Failure Modes Guarded Against:**
- Emotional trading
- News-driven activity

**Escalation Criteria:**
- Pressure to act without value-based justification

---

## Authority Boundaries
- **Humans:** Full authority to classify information.
- **Models:** Advisory only; may summarize news and flag changes.
- **Prohibited:** Models may not trigger trades or reallocations.

This skill may delay responses even to material information pending verification.

---

## Time Horizon
- Primary horizon: Ongoing
- Secondary horizon: Event-driven reassessment

Noise immunity must operate continuously.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- intrinsic_value_estimation
- opportunity_cost_awareness

**Downstream (feeds into):**
- patience_as_active_strategy
- owner_mindset_reasoning

---

## Auditability & Records
- Information classifications recorded
- Relevance assessments documented
- Post-event reviews assess classification accuracy
- Records retained permanently

---

## Common Misuse Patterns
- Treating all news as actionable
- Overweighting recent events
- Using volatility as justification

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Markets are information-processing machines, but not all information
is worth processing for long-term judgment.

# SKILL: Simplicity Preference

## Summary
Simplicity Preference is the skill of favoring businesses, structures, and decisions
that are understandable, explainable, and monitorable over those that rely on
complexity. It treats unnecessary complexity as a source of hidden risk rather than
sophistication.

This skill enforces clarity as a form of risk control.

---

## Judgment Role
This skill functions as a **complexity-limiting constraint**.

It ensures that complexity is incurred only when it is unavoidable and explicitly
compensated, and that decisions remain within the system’s governance capacity.

---

## Judgment Checkpoints

### Checkpoint 1: Complexity Necessity Test
**Purpose:**  
Determine whether complexity is essential or optional.

**Key Questions:**
- Why is this complex?
- What breaks if complexity is removed?
- Is complexity adding return or obscuring risk?

**Required Evidence / Inputs:**
- Description of complex elements
- Justification for their necessity

**Expected Outputs:**
- Judgment Record affirming or rejecting complexity necessity

**Failure Modes Guarded Against:**
- Complexity for appearance
- Overengineering

**Escalation Criteria:**
- Complexity exists without clear justification

---

### Checkpoint 2: Explainability Threshold
**Purpose:**  
Ensure the decision can be explained clearly to informed stakeholders.

**Key Questions:**
- Can this be explained without jargon?
- Would an informed owner understand the risks?
- Can rationale be summarized concisely?

**Required Evidence / Inputs:**
- Plain-language explanation
- Stakeholder communication drafts

**Expected Outputs:**
- Judgment Record affirming explainability

**Failure Modes Guarded Against:**
- Obfuscation
- Expert dependency

**Escalation Criteria:**
- Decision cannot be explained simply

---

### Checkpoint 3: Monitoring Burden Assessment
**Purpose:**  
Ensure complexity does not exceed monitoring and governance capacity.

**Key Questions:**
- What must be monitored continuously?
- Are monitoring signals reliable?
- What happens if monitoring fails?

**Required Evidence / Inputs:**
- Monitoring requirements
- Governance resource assessment

**Expected Outputs:**
- Judgment Record evaluating monitoring burden

**Failure Modes Guarded Against:**
- Blind spots
- Governance overload

**Escalation Criteria:**
- Monitoring exceeds institutional capacity

---

## Authority Boundaries
- **Humans:** Full authority to approve complexity.
- **Models:** Advisory only; may flag complexity and summarize dependencies.
- **Prohibited:** Models may not approve complexity independently.

This skill may veto opportunities even with attractive economics.

---

## Time Horizon
- Primary horizon: Entire holding period
- Secondary horizon: Governance review cycles

Complexity should decrease, not increase, over time.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- circle_of_competence_enforcement
- business_quality_assessment

**Downstream (feeds into):**
- narrative_resistance
- permanent_capital_loss_avoidance

---

## Auditability & Records
- Complexity justifications recorded
- Monitoring plans documented
- Periodic complexity audits conducted
- Records retained permanently

---

## Common Misuse Patterns
- Confusing complexity with edge
- Delegating understanding to specialists
- Allowing systems to become opaque over time

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Complexity is easy to add and hard to remove.
This skill ensures it earns its place.

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

# SKILL: Governance and Trust Evaluation

## Summary
Governance and Trust Evaluation is the skill of assessing whether the individuals and
institutions entrusted with capital act with integrity, transparency, and a durable
sense of stewardship. It treats trust as an earned, observable property rooted in
behavior over time, not reputation or credentials.

This skill recognizes that governance failures can destroy value even in strong
businesses.

---

## Judgment Role
This skill functions as a **stewardship integrity constraint**.

It determines whether the governance environment surrounding an investment supports
long-term owner interests, and whether decision-making authority can be exercised
safely within that environment.

---

## Judgment Checkpoints

### Checkpoint 1: Integrity Track Record Review
**Purpose:**  
Evaluate historical evidence of ethical behavior and accountability.

**Key Questions:**
- How have past mistakes been acknowledged and addressed?
- Are disclosures candid, consistent, and timely?
- Is bad news communicated as readily as good news?

**Required Evidence / Inputs:**
- Historical communications
- Restatements, corrections, or controversies
- Responses to prior adverse events

**Expected Outputs:**
- Judgment Record assessing integrity consistency

**Failure Modes Guarded Against:**
- Reputation laundering
- Selective disclosure

**Escalation Criteria:**
- Pattern of obfuscation or blame-shifting

---

### Checkpoint 2: Governance Structure Assessment
**Purpose:**  
Assess whether formal governance mechanisms protect owner interests.

**Key Questions:**
- Are boards independent and effective?
- Are checks and balances meaningful?
- Is authority concentrated without oversight?

**Required Evidence / Inputs:**
- Governance structure documentation
- Board composition and tenure
- Voting and control arrangements

**Expected Outputs:**
- Judgment Record evaluating governance robustness

**Failure Modes Guarded Against:**
- Rubber-stamp boards
- Entrenched control

**Escalation Criteria:**
- Structural governance deficiencies

---

### Checkpoint 3: Trust Dependency Evaluation
**Purpose:**  
Determine how much outcomes depend on trust versus structure.

**Key Questions:**
- Does success require exceptional trust in individuals?
- Are safeguards in place if trust erodes?
- Is the system resilient to personnel change?

**Required Evidence / Inputs:**
- Succession planning
- Institutionalization of processes

**Expected Outputs:**
- Judgment Record assessing trust concentration risk

**Failure Modes Guarded Against:**
- Key-person dependency
- Charismatic authority bias

**Escalation Criteria:**
- Excessive reliance on individual integrity without safeguards

---

## Authority Boundaries
- **Humans:** Full authority; judgment-heavy and contextual.
- **Models:** Advisory only; may summarize governance structures and history.
- **Prohibited:** Models may not certify trustworthiness.

This skill may override attractive economics if governance risk is high.

---

## Time Horizon
- Primary horizon: Multi-decade
- Secondary horizon: Leadership tenure

Governance judgments should change slowly and only with evidence.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- incentive_alignment_analysis
- business_quality_assessment

**Downstream (feeds into):**
- institutional_constraint_awareness
- permanent_capital_loss_avoidance

---

## Auditability & Records
- Governance assessments documented explicitly
- Changes tracked over time
- Reviewed upon leadership or structure changes
- Records retained permanently

---

## Common Misuse Patterns
- Assuming past success implies integrity
- Overweighting credentials
- Ignoring governance drift over time

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Good governance does not guarantee success,
but poor governance guarantees eventual failure.

# SKILL: Scale-Aware Decision Making

## Summary
Scale-Aware Decision Making is the skill of recognizing how the size of capital,
organizations, and positions alters opportunity sets, return potential, and risk.
It treats scale not as a virtue, but as a constraint that changes what is possible
and what is prudent.

This skill ensures that decisions remain valid as capital grows.

---

## Judgment Role
This skill functions as a **capacity and feasibility constraint**.

It evaluates whether a decision that works at one scale remains viable, repeatable,
and value-creating at the system’s current and future size.

---

## Judgment Checkpoints

### Checkpoint 1: Capacity Constraint Identification
**Purpose:**  
Identify limits imposed by scale on opportunity and execution.

**Key Questions:**
- How does size constrain available opportunities?
- Does this opportunity scale without degrading returns?
- What breaks as capital grows?

**Required Evidence / Inputs:**
- Position size vs market capacity analysis
- Liquidity and market depth considerations

**Expected Outputs:**
- Judgment Record describing scale constraints

**Failure Modes Guarded Against:**
- Extrapolating small-scale success
- Ignoring liquidity limits

**Escalation Criteria:**
- Opportunity does not scale to required size

---

### Checkpoint 2: Return Dilution Assessment
**Purpose:**  
Assess whether increasing scale dilutes incremental returns.

**Key Questions:**
- Are marginal returns declining with size?
- Does scale force compromise on quality or price?
- Is the edge self-limiting?

**Required Evidence / Inputs:**
- Historical return vs scale analysis
- Evidence of diminishing marginal returns

**Expected Outputs:**
- Judgment Record evaluating return dilution risk

**Failure Modes Guarded Against:**
- Size inertia
- Chasing deployability over quality

**Escalation Criteria:**
- Incremental capital materially lowers expected returns

---

### Checkpoint 3: Operational and Governance Stress Review
**Purpose:**  
Ensure scale does not overwhelm systems or governance.

**Key Questions:**
- Does scale introduce operational fragility?
- Are controls, oversight, and processes adequate?
- Does decision latency increase with size?

**Required Evidence / Inputs:**
- Operational capacity assessment
- Governance and control structures

**Expected Outputs:**
- Judgment Record assessing scale-induced stress

**Failure Modes Guarded Against:**
- Organizational brittleness
- Loss of decision quality

**Escalation Criteria:**
- Scale exceeds governance or operational capacity

---

## Authority Boundaries
- **Humans:** Full authority; contextual and forward-looking.
- **Models:** Advisory only; may analyze capacity and liquidity.
- **Prohibited:** Models may not extrapolate scale feasibility autonomously.

This skill may constrain position sizing and opportunity selection.

---

## Time Horizon
- Primary horizon: Capital growth trajectory
- Secondary horizon: Market structure evolution

Scale assessments must be revisited as capital grows.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- capital_allocation_judgment
- risk_asymmetry_recognition

**Downstream (feeds into):**
- patience_as_active_strategy
- institutional_constraint_awareness

---

## Auditability & Records
- Scale assumptions documented
- Capacity limits recorded and monitored
- Reassessed upon capital growth
- Records retained permanently

---

## Common Misuse Patterns
- Assuming success scales linearly
- Treating size as an advantage by default
- Ignoring liquidity under stress

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
What works brilliantly at small scale can fail quietly at large scale.
This skill ensures size is treated as a constraint, not an entitlement.

# SKILL: Patience as an Active Strategy

## Summary
Patience as an Active Strategy is the skill of deliberately choosing inaction when
conditions are not favorable, recognizing that waiting can preserve optionality,
improve outcomes, and reduce risk. It treats patience not as passivity, but as a
strategic deployment of time.

This skill ensures that action is taken only when it is justified by value, not
by pressure.

---

## Judgment Role
This skill functions as a **timing and restraint control**.

It determines whether the optimal decision is to act now, act later, or not act
at all, and protects the system from forcing decisions prematurely.

---

## Judgment Checkpoints

### Checkpoint 1: Action Necessity Test
**Purpose:**  
Determine whether action is required at this moment.

**Key Questions:**
- What happens if no action is taken?
- Is there a cost to waiting?
- Is urgency intrinsic or perceived?

**Required Evidence / Inputs:**
- Time sensitivity analysis
- Opportunity decay assessment

**Expected Outputs:**
- Judgment Record affirming action or deliberate inaction

**Failure Modes Guarded Against:**
- Artificial urgency
- Action bias

**Escalation Criteria:**
- Action justified primarily by discomfort with waiting

---

### Checkpoint 2: Optionality Preservation Review
**Purpose:**  
Ensure that waiting preserves or enhances future choices.

**Key Questions:**
- Does waiting improve information quality?
- Does waiting improve pricing or terms?
- Does waiting preserve flexibility?

**Required Evidence / Inputs:**
- Information arrival expectations
- Market or situational optionality analysis

**Expected Outputs:**
- Judgment Record evaluating optionality effects

**Failure Modes Guarded Against:**
- Premature commitment
- Optionality destruction

**Escalation Criteria:**
- Waiting materially degrades future opportunity

---

### Checkpoint 3: Patience Payoff Validation
**Purpose:**  
Confirm that patience is likely to be rewarded structurally.

**Key Questions:**
- Who is being pressured to act, and why?
- Does time favor disciplined capital?
- Are others forced sellers or buyers?

**Required Evidence / Inputs:**
- Market structure context
- Counterparty incentives

**Expected Outputs:**
- Judgment Record validating patience advantage

**Failure Modes Guarded Against:**
- Mistaking stagnation for patience
- Waiting without advantage

**Escalation Criteria:**
- No structural benefit to waiting exists

---

## Authority Boundaries
- **Humans:** Full authority to choose inaction.
- **Models:** Advisory only; may surface timing considerations.
- **Prohibited:** Models may not force action to meet activity targets.

This skill may delay otherwise acceptable decisions.

---

## Time Horizon
- Primary horizon: Variable
- Secondary horizon: Market and information cycles

Patience judgments should be revisited periodically, not continuously.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- opportunity_cost_awareness
- market_noise_immunity
- risk_asymmetry_recognition

**Downstream (feeds into):**
- owner_mindset_reasoning
- capital_allocation_judgment

---

## Auditability & Records
- Inaction decisions recorded explicitly
- Rationale documented and revisited
- Post-hoc reviews assess patience outcomes
- Records retained permanently

---

## Common Misuse Patterns
- Confusing indecision with patience
- Waiting without a clear advantage
- Avoiding accountability through delay

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
The ability to wait is a competitive advantage.
This skill ensures it is exercised deliberately and defensibly.

# SKILL: Error Recognition and Correction

## Summary
Error Recognition and Correction is the skill of identifying when a judgment,
assumption, or decision is wrong, and responding by updating beliefs and actions
promptly and proportionately. It institutionalizes intellectual honesty and treats
learning as a core risk-control mechanism.

This skill ensures the system adapts without ego or defensiveness.

---

## Judgment Role
This skill functions as a **self-correction mechanism**.

It governs how the system responds to disconfirming evidence, preventing small
mistakes from compounding into large losses and ensuring that learning occurs
symmetrically for successes and failures.

---

## Judgment Checkpoints

### Checkpoint 1: Disconfirming Evidence Scan
**Purpose:**  
Ensure that evidence contradicting prior judgments is actively sought and evaluated.

**Key Questions:**
- What evidence would prove this judgment wrong?
- Has such evidence emerged?
- Are signals being dismissed or rationalized?

**Required Evidence / Inputs:**
- Updated performance data
- New qualitative or structural information

**Expected Outputs:**
- Judgment Record documenting evidence assessment

**Failure Modes Guarded Against:**
- Confirmation bias
- Narrative entrenchment

**Escalation Criteria:**
- Disconfirming evidence is repeatedly ignored

---

### Checkpoint 2: Error Attribution Analysis
**Purpose:**  
Distinguish between bad outcomes due to error and those due to randomness.

**Key Questions:**
- Was the original reasoning flawed?
- Did assumptions fail, or did outcomes vary within expectations?
- Would the decision be repeated under similar conditions?

**Required Evidence / Inputs:**
- Original judgment records
- Outcome vs expectation comparison

**Expected Outputs:**
- Judgment Record identifying error sources

**Failure Modes Guarded Against:**
- Outcome bias
- Blaming randomness selectively

**Escalation Criteria:**
- Inability to articulate why an outcome occurred

---

### Checkpoint 3: Corrective Action Discipline
**Purpose:**  
Ensure that recognized errors lead to appropriate action.

**Key Questions:**
- What adjustment is warranted?
- Is the response proportional to the error?
- Does correction improve future decisions?

**Required Evidence / Inputs:**
- Proposed corrective actions
- Impact assessment

**Expected Outputs:**
- Judgment Record recommending adjustment, escalation, or exit

**Failure Modes Guarded Against:**
- Overcorrection
- Inertia after recognition

**Escalation Criteria:**
- Errors acknowledged without corrective action

---

## Authority Boundaries
- **Humans:** Full authority; judgment-intensive.
- **Models:** Advisory only; may surface anomalies and inconsistencies.
- **Prohibited:** Models may not enforce corrections autonomously.

This skill may override prior decisions without stigma.

---

## Time Horizon
- Primary horizon: Continuous
- Secondary horizon: Post-decision review cycles

Error recognition should occur promptly but calmly.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- all decision-making skills

**Downstream (feeds into):**
- capital_allocation_judgment
- permanent_capital_loss_avoidance
- narrative_resistance

---

## Auditability & Records
- Errors and corrections recorded explicitly
- Rationales preserved for learning
- Periodic review of repeated errors
- Records retained permanently

---

## Common Misuse Patterns
- Admitting errors verbally but not behaviorally
- Overreacting to short-term noise
- Treating learning as retrospective only

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
The cost of being wrong is not the mistake itself,
but the refusal to recognize and correct it.

# SKILL: Structural Advantage Identification

## Summary
Structural Advantage Identification is the skill of recognizing durable advantages
that arise from the structure of a business, industry, or environment rather than
from exceptional execution alone. It distinguishes advantages that persist
automatically from those that require continual effort to maintain.

This skill isolates sources of durability that survive management change,
competition, and time.

---

## Judgment Role
This skill functions as a **durability verification layer**.

It determines whether a business’s favorable economics are protected by structural
forces or depend primarily on continued excellence, favorable conditions, or
behavioral edge.

---

## Judgment Checkpoints

### Checkpoint 1: Advantage Source Classification
**Purpose:**  
Identify and classify the origin of any claimed advantage.

**Key Questions:**
- Is the advantage structural, contractual, regulatory, network-based, or behavioral?
- Which elements persist without active defense?
- Which elements decay naturally over time?

**Required Evidence / Inputs:**
- Industry structure analysis
- Contractual, regulatory, or network characteristics

**Expected Outputs:**
- Judgment Record classifying advantage sources

**Failure Modes Guarded Against:**
- Conflating execution quality with structural advantage
- Over-attributing advantage to brand or culture

**Escalation Criteria:**
- Advantage depends primarily on continued exceptional behavior

---

### Checkpoint 2: Replicability and Erosion Assessment
**Purpose:**  
Assess how easily competitors can replicate or erode the advantage.

**Key Questions:**
- What would a capable competitor need to do to replicate this?
- What barriers prevent replication?
- How has erosion occurred historically?

**Required Evidence / Inputs:**
- Competitive response analysis
- Historical erosion examples

**Expected Outputs:**
- Judgment Record evaluating erosion risk

**Failure Modes Guarded Against:**
- Underestimating competitor adaptability
- Ignoring technological or regulatory shifts

**Escalation Criteria:**
- Advantage is easily replicated or already eroding

---

### Checkpoint 3: Advantage Longevity Projection
**Purpose:**  
Estimate how long the advantage is likely to persist.

**Key Questions:**
- What forces reinforce the advantage over time?
- What forces weaken it?
- Is decay gradual or discontinuous?

**Required Evidence / Inputs:**
- Long-term industry trends
- Structural reinforcement mechanisms

**Expected Outputs:**
- Judgment Record projecting advantage longevity

**Failure Modes Guarded Against:**
- Assuming permanence without cause
- Ignoring slow-moving threats

**Escalation Criteria:**
- Advantage longevity is highly uncertain or short-lived

---

## Authority Boundaries
- **Humans:** Full authority to classify and judge durability.
- **Models:** Advisory only; may surface structural features and comparisons.
- **Prohibited:** Models may not certify moat durability independently.

This skill informs but does not replace business quality assessment.

---

## Time Horizon
- Primary horizon: 10–30 years
- Secondary horizon: Industry evolution cycles

Structural advantages should degrade slowly and predictably.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- business_quality_assessment
- simplicity_preference

**Downstream (feeds into):**
- intrinsic_value_estimation
- long_horizon_compounding_orientation

---

## Auditability & Records
- Advantage classifications documented explicitly
- Erosion indicators monitored
- Reassessed upon structural change
- Records retained permanently

---

## Common Misuse Patterns
- Labeling temporary success as a moat
- Ignoring regulation or technology as erosion forces
- Overconfidence in brand strength alone

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
True structural advantages persist even when no one is trying especially hard.
If constant defense is required, the advantage is likely behavioral, not structural.

# SKILL: Narrative Resistance

## Summary
Narrative Resistance is the skill of separating compelling stories from underlying
economic reality. It prevents decisions from being driven by coherent, emotionally
appealing, or widely accepted narratives when those narratives are weakly grounded
in durable economics.

This skill treats stories as hypotheses to be tested, not truths to be trusted.

---

## Judgment Role
This skill functions as a **story–economics separation constraint**.

It ensures that judgment remains anchored to causal mechanisms, cash flows, and
structure rather than momentum, charisma, or consensus belief.

---

## Judgment Checkpoints

### Checkpoint 1: Narrative Identification
**Purpose:**  
Explicitly surface the dominant narrative surrounding the decision.

**Key Questions:**
- What story is being told?
- Who benefits from this narrative?
- How is the narrative reinforced?

**Required Evidence / Inputs:**
- Media and market commentary
- Internal framing language

**Expected Outputs:**
- Judgment Record describing the prevailing narrative

**Failure Modes Guarded Against:**
- Unexamined story adoption
- Implicit consensus bias

**Escalation Criteria:**
- Narrative cannot be articulated clearly

---

### Checkpoint 2: Economic Substitution Test
**Purpose:**  
Evaluate the economics independent of the narrative.

**Key Questions:**
- What remains if the story is removed?
- Do cash flows justify the conclusion?
- Which claims are unfalsifiable?

**Required Evidence / Inputs:**
- Cash flow and structural analysis
- Identification of narrative-dependent assumptions

**Expected Outputs:**
- Judgment Record assessing narrative dependence

**Failure Modes Guarded Against:**
- Story substitution for analysis
- Overweighting vision over evidence

**Escalation Criteria:**
- Economics collapse without narrative support

---

### Checkpoint 3: Counter-Narrative Construction
**Purpose:**  
Stress-test judgment by constructing plausible alternative stories.

**Key Questions:**
- What is the strongest opposing narrative?
- What evidence would support it?
- How would outcomes differ?

**Required Evidence / Inputs:**
- Alternative scenario narratives
- Disconfirming evidence search

**Expected Outputs:**
- Judgment Record evaluating robustness to counter-narratives

**Failure Modes Guarded Against:**
- Single-story dominance
- Confirmation bias

**Escalation Criteria:**
- Judgment fails under plausible counter-narratives

---

## Authority Boundaries
- **Humans:** Full authority; narrative judgment is contextual.
- **Models:** Advisory only; may summarize narratives and evidence.
- **Prohibited:** Models may not endorse narratives.

This skill may veto opportunities driven primarily by storytelling.

---

## Time Horizon
- Primary horizon: Ongoing
- Secondary horizon: Narrative cycles

Narratives should decay faster than economics.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- circle_of_competence_enforcement
- simplicity_preference

**Downstream (feeds into):**
- error_recognition_and_correction
- owner_mindset_reasoning

---

## Auditability & Records
- Narratives documented explicitly
- Assumptions traced to narrative sources
- Post-outcome reviews assess narrative influence
- Records retained permanently

---

## Common Misuse Patterns
- Treating popularity as validation
- Ignoring incentives behind narratives
- Failing to update when stories break

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Narratives are powerful because they feel explanatory.
This skill ensures they do not become substitutes for truth.

# SKILL: Owner-Mindset Reasoning

## Summary
Owner-Mindset Reasoning is the skill of evaluating decisions as if owning 100% of the
business indefinitely, rather than holding a tradable security. It reframes judgment
around long-term stewardship, cash generation, and intrinsic value rather than
liquidity, market pricing, or exit timing.

This skill suppresses trading instincts in favor of ownership discipline.

---

## Judgment Role
This skill functions as a **framing and perspective constraint**.

It ensures that decisions are evaluated through the lens of permanent ownership,
forcing alignment with long-term value creation and discouraging short-term,
price-driven behavior.

---

## Judgment Checkpoints

### Checkpoint 1: Full-Ownership Test
**Purpose:**  
Reframe the opportunity as a private, permanent ownership decision.

**Key Questions:**
- Would we buy the entire business at this price?
- Would we be comfortable owning it if markets were closed for years?
- Would we accept this outcome without the ability to sell?

**Required Evidence / Inputs:**
- Long-term cash flow expectations
- Business durability assessment

**Expected Outputs:**
- Judgment Record affirming or rejecting ownership comfort

**Failure Modes Guarded Against:**
- Liquidity illusion
- Exit-dependent theses

**Escalation Criteria:**
- Comfort depends on a future sale or repricing

---

### Checkpoint 2: Cash vs Quote Priority Review
**Purpose:**  
Ensure cash economics dominate price considerations.

**Key Questions:**
- What cash does the business generate for owners?
- How is that cash reinvested or distributed?
- How sensitive is value to market quotations?

**Required Evidence / Inputs:**
- Owner earnings estimates
- Capital allocation history

**Expected Outputs:**
- Judgment Record prioritizing cash over price

**Failure Modes Guarded Against:**
- Quote obsession
- Short-term performance fixation

**Escalation Criteria:**
- Decision relies on anticipated price movements

---

### Checkpoint 3: Stewardship Duration Assessment
**Purpose:**  
Evaluate whether the decision aligns with long-term stewardship.

**Key Questions:**
- What responsibilities come with ownership?
- Are we prepared for long periods of underperformance?
- Would this still be acceptable after five or ten years?

**Required Evidence / Inputs:**
- Long-term business outlook
- Stress and stagnation scenarios

**Expected Outputs:**
- Judgment Record assessing stewardship readiness

**Failure Modes Guarded Against:**
- Implicit trading mentality
- Time inconsistency

**Escalation Criteria:**
- Thesis requires frequent reassessment or exit flexibility

---

## Authority Boundaries
- **Humans:** Full authority; ownership framing is judgment-heavy.
- **Models:** Advisory only; may reframe scenarios as ownership cases.
- **Prohibited:** Models may not substitute ownership judgment.

This skill may override otherwise attractive short-term opportunities.

---

## Time Horizon
- Primary horizon: Indefinite
- Secondary horizon: Multi-decade stewardship

Owner mindset should remain stable across market cycles.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- long_horizon_compounding_orientation
- market_noise_immunity

**Downstream (feeds into):**
- institutional_constraint_awareness
- patience_as_active_strategy

---

## Auditability & Records
- Ownership framing documented explicitly
- Cash-based rationale recorded
- Reviewed when ownership assumptions change
- Records retained permanently

---

## Common Misuse Patterns
- Claiming owner mindset while acting like a trader
- Relying on liquidity for comfort
- Ignoring stewardship obligations

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Markets offer liquidity, but ownership demands responsibility.
This skill ensures we reason like owners even when markets are open.

# SKILL: Institutional Constraint Awareness

## Summary
Institutional Constraint Awareness is the skill of ensuring that all investment
judgments are compatible with the legal, fiduciary, liquidity, tax, governance,
and mandate constraints under which capital is managed. It grounds theoretical
attractiveness in real-world feasibility and enforceability.

This skill ensures that good ideas do not become bad decisions through constraint
violations.

---

## Judgment Role
This skill functions as a **mandate compatibility and feasibility gate**.

It determines whether a decision that is otherwise attractive can be executed,
held, governed, and exited within institutional boundaries without introducing
unacceptable risk or breach.

---

## Judgment Checkpoints

### Checkpoint 1: Mandate Compatibility Review
**Purpose:**  
Ensure alignment with explicit investment mandates and fiduciary duties.

**Key Questions:**
- Is this decision permitted under the mandate?
- Does it align with fiduciary obligations?
- Are any constraints being stretched or reinterpreted?

**Required Evidence / Inputs:**
- Mandate documentation
- Fiduciary standards

**Expected Outputs:**
- Judgment Record affirming or rejecting mandate compatibility

**Failure Modes Guarded Against:**
- Mandate drift
- Rationalized exceptions

**Escalation Criteria:**
- Decision requires reinterpretation of mandate language

---

### Checkpoint 2: Liquidity and Horizon Alignment
**Purpose:**  
Assess whether liquidity characteristics match institutional needs.

**Key Questions:**
- Can capital be held through stress?
- Do liquidity needs force premature action?
- Is liquidity optional or required?

**Required Evidence / Inputs:**
- Liquidity profile analysis
- Cash flow obligations

**Expected Outputs:**
- Judgment Record evaluating liquidity alignment

**Failure Modes Guarded Against:**
- Forced selling
- Maturity mismatches

**Escalation Criteria:**
- Liquidity risk conflicts with obligations

---

### Checkpoint 3: Governance and Operational Feasibility
**Purpose:**  
Ensure the institution can govern and oversee the decision effectively.

**Key Questions:**
- Are reporting and oversight requirements met?
- Can risks be monitored and controlled?
- Does complexity exceed institutional capacity?

**Required Evidence / Inputs:**
- Governance processes
- Operational capabilities

**Expected Outputs:**
- Judgment Record assessing feasibility

**Failure Modes Guarded Against:**
- Governance overload
- Operational blind spots

**Escalation Criteria:**
- Decision exceeds governance or operational capacity

---

## Authority Boundaries
- **Humans:** Full authority; institutional judgment required.
- **Models:** Advisory only; may flag constraint conflicts.
- **Prohibited:** Models may not waive institutional constraints.

This skill may veto decisions regardless of economic attractiveness.

---

## Time Horizon
- Primary horizon: Institutional lifecycle
- Secondary horizon: Obligation and reporting cycles

Constraint assessments must remain current as obligations evolve.

---

## Interaction With Other Skills

**Upstream (inputs from):**
- capital_allocation_judgment
- scale_aware_decision_making
- governance_and_trust_evaluation

**Downstream (feeds into):**
- none (terminal skill)

---

## Auditability & Records
- Constraint assessments documented explicitly
- Mandate interpretations recorded
- Reviewed upon mandate or obligation changes
- Records retained permanently

---

## Common Misuse Patterns
- Treating constraints as negotiable
- Assuming flexibility without evidence
- Ignoring downstream governance burden

---

## Versioning
- Skill version: 1.0
- Last reviewed: 2026-01-09
- Change notes: Initial canonical definition

---

## Notes
Institutions fail not because ideas are bad,
but because constraints are ignored.
This skill ensures judgment remains grounded in reality.
