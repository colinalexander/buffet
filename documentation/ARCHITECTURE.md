# Architecture

This document is for deep readers and founders. It explains how the repository implements machine-native judgment under explicit authority, and how the components are separated to prevent authority drift.

---

## 1) First Principles

**Authority is explicit.**

- Constitutional documents live under `documentation/`.
- Mandates live under `mandates/`.
- Procedures live under `judgment_loops/`.
- Code is only an implementation of those sources, never the source of truth.

**The system never outputs trades.**
Outputs are judgment records only.

**Determinism is required.**
Given the same mandate, procedure, and scenario inputs, the system produces the same judgment outcome and rationale structure. The only allowed sources of variance are:
`record_id`, `timestamp`, and `behavior.decision_latency_ms`.

---

## 2) Authority and Constraints Hierarchy

Highest to lowest:

1. `documentation/JUDGMENT_AUTHORITY.md`
2. `documentation/PROCEDURE_CONTRACT.md`
3. `documentation/JUDGMENT_RECORD_SCHEMA.md`
4. `mandates/**/mandate.yaml`
5. `judgment_loops/**/procedure.md`
6. `src/buffet/**`

Conflicts must trigger escalation. Lower-level artifacts cannot override higher-level authority.

See:

- `documentation/JUDGMENT_AUTHORITY.md`
- `documentation/PROCEDURE_CONTRACT.md`
- `documentation/JUDGMENT_RECORD_SCHEMA.md`

---

## 3) System Overview (Control Loop)

```text
Authority docs ─┐
                ├─> Mandate (YAML) ─┐
                │                  ├─> Procedure (MD + thresholds) ─> Sensing (scenario) ─> Reasoning ─> Judgment Record (append-only)
                └──────────────────┘                                                   └───────────────> Escalation (if required)
```

Key idea: the system is a governed control loop. It monitors mandate alignment, produces an auditable judgment outcome, and escalates when human authority is required.

---

## 4) System Layers

### Mandate Layer (Authority Constraints)

- Reads `mandates/**/mandate.yaml`.
- Exposes typed accessors for key limits and requirements.
- No inference or reinterpretation of mandate language.

### Procedure Layer (Binding Judgment Logic)

- Binds the process of judgment, not outcomes.
- References `procedure.md` for authority and scope.
- Uses `thresholds.yaml` only for trigger thresholds, never for mandate limits.

### Sensing Layer (Measurement)

- Deterministic scenario inputs from `judgment_loops/**/scenarios/*.yaml`.
- No external data fetching.

### Reasoning Layer (Alignment + Confidence)

- Minimal alignment checks against mandate limits.
- Deterministic confidence calculation and rationale formatting.

### Execution Layer (Orchestration)

- Runs a single loop end-to-end.
- Writes append-only records to `data/processed/judgment_records/`.
- Routes escalations to `data/processed/escalations/`.

---

## 5) Data and Outputs

### Judgment Records

- The Judgment Record is the authoritative output.
- Required fields include authority context, state snapshot, outcome, confidence, constraints, compliance, and behavior metadata.
- Records are append-only. No mutation or overwrite is permitted.

**Escalation discipline:**

- Any authority conflict, ambiguity about constraints, or required human tradeoff must result in `outcome.type == escalate`.
- Failure to escalate when required is a process failure, regardless of financial outcome.

### Examples

- `examples/` contains illustrative, non-authoritative artifacts.
- Code must not import or depend on examples.
- If an example conflicts with constitutional docs, mandates, or procedures, the example is wrong by definition.

---

## 6) Reuse vs Divergence

The architecture is designed to make behavioral divergence explicit and inspectable.

- The same procedure and the same scenario can yield different outcomes under different mandates.
- Divergence must be explainable entirely by mandate differences (constraints and priorities), not by hidden logic forks or implicit assumptions.

---

## 7) Skills Packaging

`skills/` is a packaging layer for agent runtimes:

- It references canonical sources instead of duplicating them.
- It cannot introduce new authority.
- It is non-authoritative by design.

---

## 8) Evaluation Harness

Procedure regression checks live under:

- `judgment_loops/<loop>/eval/`

Expected outcomes are scenario-based and mandate-specific. The evaluator:

- Runs in dry-run mode (no outputs written).
- Asserts outcomes against the expected cases.

---

## 9) Change Discipline

- `history/` directories are human-readable changelogs.
- Git remains authoritative for exact diffs.
- History entries must describe what changed, why, expected behavioral delta, scenarios impacted, and rollback notes.

---

## 10) Non-Scope

This repository does not:

- execute trades
- select assets
- optimize returns
- expand authority beyond mandates

---

## 11) Operating the Prototype

Common entrypoints:

- `uv run python -m buffet.execution.run_example`
- `uv run python -m buffet.execution.run_skill`
- `uv run python -m buffet.simulation.eval_procedures`

Outputs always go under `data/processed/`.
