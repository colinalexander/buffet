<p align="left" style="margin-bottom: 1.25rem;">
  <img
    src="documentation/figures/banner.png"
    alt="Institutional investment judgment represented as a governed control system, with supervised procedures, explicit constraints, and auditable outcomes rather than trading activity"
    width="60%"
  />
</p>

<p align="left">
  <sub>
    Institutional investment judgment as a governed control system. The image emphasizes supervision, constraint enforcement, and auditability: mandates define allowable behavior, procedures apply judgment within those bounds, and outcomes are recorded and reviewed. Action is deliberate and authorized; inaction and escalation are first-class outcomes.
  </sub>
</p>


# MandateOS — A Machine-Native Investment Judgment Framework

*Machine-native investment judgment with explicit authority boundaries.*

This repository implements a governance-first framework that applies institutional investment judgment under explicit mandates, procedural constraints, and auditable outcomes.

- It is not a trading system.
- It is not an alpha engine.
- It is not a predictive model.

MandateOS is designed to make **investment policy statements operational** by encoding judgment as supervised, constraint-aware procedures whose outcomes are recorded, reviewable, and accountable.

## Founder Demo

See `documentation/FOUNDER_DEMO.md`.

## Judgment Viewer (GitHub Pages)

Run: `make pages`. The static viewer lives in `docs/` and can be published via GitHub Pages.

## Separation of Concerns

- Authority: `documentation/*`
- Constraints: `mandates/*`
- Procedures: `judgment_loops/*`
- Examples: `examples/*` (non-authoritative)
- Outputs: `data/processed/*`
- Code: `src/buffet/*`

## Skills

Skills under `skills/` are packaging for agent runtimes. They must reference canonical artifacts in `documentation/`, `mandates/`, and `judgment_loops/`, and they must not introduce independent logic.

## Evaluation

Procedure regression checks live under `judgment_loops/*/eval/`.

```bash
uv run python -m buffet.simulation.eval_procedures
```

## Outputs

Machine outputs are append-only and written under `data/processed/`.

## Quickstart

```bash
uv run python -m buffet.execution.run_example \
  --mandate mandates/liability_driven/db_pension_v1/mandate.yaml \
  --scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml
```

```bash
uv run pytest -q
```
