# Founder Demo

## What you’ll see (10 lines)
1) A governance-first control plane that never outputs trades—only Judgment Records.
2) Explicit authority hierarchy (documentation → mandates → procedures → code).
3) Deterministic scenario inputs (no live data fetching).
4) Outcomes constrained to: `affirm_alignment` / `recommend_adjustment` / `escalate`.
5) Escalation as a designed safety mechanism that halts automation.
6) The same procedure applied to two different mandates.
7) Divergent outcomes driven by mandate constraints.
8) Auditability via append-only record files under `data/processed/`.
9) A scenario-based eval harness that blocks procedural drift.
10) Non-authoritative skills + governed prompt contracts (pre-mandate dossiers + skill evolution).

---

## A) 90-second demo (copy/paste commands)

```bash
uv sync
make test-cov
make founder-demo
```

Notes:
- No network calls; all inputs are local and deterministic (fixed seeds; pinned inputs).
- `make founder-demo` runs `make eval` first, then writes two new Judgment Records (same scenario, two mandates).
- Expected: the two records have different `outcome.type` values.
- The viewer groups identical judgments by default; expand “Emissions” to see append-only attestations.
- Optional: `uv run python scripts/print_latest_records.py 2`

---

## B) 5-minute deep dive (open these files)

Open these canonical sources and artifacts:
- `documentation/JUDGMENT_AUTHORITY.md`
- `documentation/PROCEDURE_CONTRACT.md`
- `documentation/JUDGMENT_RECORD_SCHEMA.md`
- `documentation/ARCHITECTURE.md`
- `documentation/prompts/judgment_support_dossier.md`
- `documentation/prompts/skill_version_review.md`
- `skills/README.md`
- `mandates/liability_driven/db_pension_v1/mandate.yaml`
- `mandates/perpetual_capital/endowment_v1/mandate.yaml`
- `judgment_loops/rate_regime_adjustment/procedure.md`
- `judgment_loops/rate_regime_adjustment/eval/expected_outcomes.yaml`
- `data/processed/judgment_records/<latest two records>`

---

## C) Why this is hard to fake

- Authority hierarchy is explicit and binding (documentation → mandates → procedures → code).
- Eval harness asserts expected outcomes and blocks procedural drift.
- Tests enforce that runtime code never imports `examples/`.
- Records are append-only under `data/processed/` with immutable IDs.
- Skills are non-authoritative; prompt contracts govern pre-mandate usage and skill version changes.

---

## Demo narrative

We run a single judgment procedure against two mandates under the same deterministic scenario. 
The outcomes diverge because authority lives in the mandates, not in the code. 
Every run writes an append-only Judgment Record with explicit confidence and constraints—no trades, no hidden discretion, and a built-in eval harness to prevent drift.
