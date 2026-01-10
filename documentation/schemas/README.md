# Canonical Judgment Record Schemas

This directory contains **canonical, machine-validatable schemas** for governance artifacts.

- `documentation/schemas/judgment_record.schema.json` is the canonical validator for Judgment Records produced by procedures in this repository.
- `docs/schemas/**` is **non-authoritative** and exists only to support the static viewer UI and published snapshots under `docs/data/`.
- Judgment Records are **append-only** artifacts written under `data/processed/judgment_records/` (with escalation stubs routed to `data/processed/escalations/`).

## Extension Policy

This schema intentionally keeps the required top-level core minimal and allows additional fields.

- Top-level extensions MUST be prefixed with `x_` (e.g., `x_skill_trace`).
- Unprefixed keys should be treated as part of the canonical contract and only added with governance review.
