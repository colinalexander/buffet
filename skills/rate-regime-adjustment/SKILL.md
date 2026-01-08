---
name: rate-regime-adjustment
version: 0.1.0
owner: buffet
lifecycle_state: draft
description: |
  Package the rate regime adjustment judgment loop for agent runtimes.
  This is a non-authoritative projection of canonical artifacts.
triggers:
  - rate regime shift detected
  - rising rate volatility
  - confidence degradation in liability hedging
authoritative_sources:
  - judgment_loops/rate_regime_adjustment/procedure.md
  - judgment_loops/rate_regime_adjustment/thresholds.yaml
  - documentation/JUDGMENT_AUTHORITY.md
  - documentation/PROCEDURE_CONTRACT.md
  - documentation/JUDGMENT_RECORD_SCHEMA.md
allowed_outcomes:
  - affirm_alignment
  - recommend_adjustment
  - escalate
prohibited:
  - trades
  - portfolio state mutation
  - mandate modification
---

This skill is non-authoritative. Load and follow the canonical artifacts listed
in `authoritative_sources` at runtime.

Output must be a Judgment Record that complies with the schema.

Example invocation:
`uv run python -m buffet.execution.run_skill --mandate mandates/liability_driven/db_pension_v1/mandate.yaml --scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml`
