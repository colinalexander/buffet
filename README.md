<p align="left" style="margin-bottom: 1.25rem;">
  <img
    src="documentation/figures/banner.png"
    alt="Institutional investment judgment represented as a governed control system, with supervised procedures, explicit constraints, and auditable outcomes rather than trading activity"
    width="60%"
  />
</p>

<p align="left">
  <sub>
    Institutional investment judgment as a governed control system.
  </sub>
</p>


# MandateOS — A Machine-Native Investment Judgment Framework

*Machine-native investment judgment with explicit authority boundaries.*

MandateOS helps a firm scale institutional investment governance complexity. It runs mandate-bound judgment procedures and produces auditable Judgment Records (`affirm_alignment` / `recommend_adjustment` / `escalate`), but never places trades. Think of it like an aircraft autopilot for governance: it executes approved procedures within explicit authority boundaries while human fiduciaries monitor the instruments and take control when escalation requires judgment—not execution or automated action.

- It is not a trading system.
- It is not an alpha engine.
- It is not a predictive model.

MandateOS is designed to make **Investment Policy Statements (IPS)** operational by encoding judgment as supervised, constraint-aware procedures whose outcomes are recorded, reviewable, and accountable.

## Founder Demo

See `documentation/FOUNDER_DEMO.md`.

## Judgment Viewer (GitHub Pages)

Live viewer: `https://colinalexander.github.io/buffet/`

Run: `make pages`. The static viewer lives in `docs/` and can be published via GitHub Pages.

## Separation of Concerns

- Authority: `documentation/*`
- Constraints: `mandates/*`
- Procedures: `judgment_loops/*`
- Examples: `examples/*` (non-authoritative)
- Outputs: `data/processed/*`
- Code: `src/buffet/*`

## High-Level Architecture

![MandateOS high-level architecture showing human authority, contracts, mandates, procedures, and append-only judgment record outputs with escalation back to humans.](documentation/figures/process.png)
<p align="left">
  <sub>
    The architecture makes authority explicit, enforces mandate-bound judgment, and halts automation via escalation when human authority is required.
  </sub>
</p>

## How It Works

### Authority (`documentation/`)

Constitutional contracts that define what the system is allowed to do, what qualifies as a valid procedure, and what a valid output record must contain. These documents are the top of the hierarchy and intentionally override code when there’s ambiguity. If a lower-level artifact conflicts, the correct outcome is escalation—not reinterpretation.

### Mandates (`mandates/`)

Authoritative constraints and thresholds per mandate (e.g., confidence floors, leverage limits, liquidity buffers). Mandates are machine-readable YAML plus supporting IPS text, and they define the boundaries of permitted judgment. Divergence across mandates is a feature: the same procedure can yield different outcomes because constraints differ.

### Procedures (`judgment_loops/`)

Binding judgment logic specifications (markdown + trigger thresholds). Procedures encode how judgment is applied under a mandate, including permitted outcomes and escalation rules. Procedures may define trigger mechanics (e.g., persistence windows) but must not duplicate mandate limits.

### Sensing (`src/buffet/sensing/`)

Deterministic measurement only (scenario inputs in YAML). No market data feeds. No adaptive data pipelines. No “models that move the goalposts.” The sensing layer produces a minimal state snapshot used by the procedure.

### Reasoning (`src/buffet/reasoning/`)

Minimal deterministic logic to compute alignment, confidence, and short rationales. This layer is intentionally “boring”: it exists to make reasoning auditable and repeatable rather than clever. If uncertainty exceeds authority, it drives escalation rather than discretion.

### Execution + Memory (`src/buffet/execution/`, `data/processed/`)

Orchestrates one loop end-to-end and writes append-only Judgment Records. Records are immutable artifacts; new runs create new files. Escalations are routed to separate append-only artifacts, keeping human governance notes distinct from machine outputs.

### Evaluation (`judgment_loops/*/eval/`, `src/buffet/simulation/`)

Scenario-based expected outcomes that prevent procedural drift. If changes cause a mandate/scenario to flip outcomes unexpectedly, evaluation fails. This is the “unit test” for institutional intent.

### Skills (`skills/`)

Packaging for agent runtimes only; they reference canonical sources rather than duplicating them. Skills can have lifecycle metadata (draft→active) without becoming a second implementation. Any divergence is a bug by definition.

## Institutional Learning (No Trial-and-Error)

MandateOS does not “learn” by experimenting with capital. The institution learns by reviewing Judgment Records and deliberately updating mandates and procedures.

Learning occurs through governed institutional processes:

- human review of Judgment Records,
- explicit mandate revisions,
- versioned procedure updates,
- scenario-based evaluation.

Changes are introduced deliberately, reviewed ex ante, and audited ex post.
Progress is communicated as versioned diffs:
*what changed, why it changed, and what behavior is expected to differ.*

This allows institutions to adapt over time without incurring failure as a training signal.

## Versioning & Reproducibility

If a record references mandate v1.0 and procedure v1, you can open those exact files and inspect the authority and logic that governed the judgment. Reproducing the exact output requires the same execution engine version.

## Evaluation

Procedure regression checks live under `judgment_loops/*/eval/`.

```bash
uv run python -m buffet.simulation.eval_procedures
```

## Outputs

Machine outputs are append-only and written under `data/processed/`.
MandateOS intentionally does not execute trades, allocate capital, or optimize returns.

## Quickstart

```bash
uv run python -m buffet.execution.run_example \
  --mandate mandates/liability_driven/db_pension_v1/mandate.yaml \
  --scenario judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml
```

```bash
uv run pytest -q
```
