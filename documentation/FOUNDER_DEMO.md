# Founder Demo

## What you’ll see (10 lines)
1) A system that never outputs trades—only Judgment Records.
2) The same procedure applied to two different mandates.
3) Divergent outcomes driven by mandate constraints.
4) Deterministic execution from a clean clone.
5) Auditability via append-only record files.
6) Explicit authority hierarchy and governance documents.
7) A procedure eval harness that blocks drift.
8) Separation of concerns enforced by structure and tests.
9) Minimal dependencies and fast runtime.
10) A two-minute proof with optional deep dive in 10 minutes.

---

## A) 90-second demo (copy/paste commands)

```bash
uv sync
make test
make eval
make founder-demo
uv run python scripts/print_latest_records.py 2
```

Expected outcome: two newest records show different `outcome.type` values under the same scenario.

---

## B) 5-minute deep dive (open these files)

Open these canonical sources:
- `documentation/JUDGMENT_AUTHORITY.md`
- `documentation/PROCEDURE_CONTRACT.md`
- `documentation/JUDGMENT_RECORD_SCHEMA.md`
- `mandates/liability_driven/db_pension_v1/mandate.yaml`
- `mandates/perpetual_capital/endowment_v1/mandate.yaml`
- `judgment_loops/rate_regime_adjustment/procedure.md`
- `judgment_loops/rate_regime_adjustment/eval/expected_outcomes.yaml`
- `data/processed/judgment_records/<latest two records>`

---

## C) Why this is hard to fake

- Authority hierarchy is explicit and binding (documentation → mandates → procedures → code).
- Eval harness asserts expected outcomes and blocks procedural drift.
- Records are append-only under `data/processed/` with immutable IDs.
- Tests enforce that runtime code never imports `examples/`.

---

## Demo narrative (read aloud, ~20 seconds)

“We run a single judgment procedure against two mandates under the same market scenario. The outcomes diverge because authority lives in the mandates, not in the code. Every run writes an append-only Judgment Record with explicit confidence, constraints, and behavior metadata—no trades, no hidden discretion, and a built-in eval harness to prevent drift.”
