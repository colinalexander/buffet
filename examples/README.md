# Examples

This directory contains **illustrative, non-authoritative artifacts**.

Artifacts under `examples/` exist solely to demonstrate:

* how mandates, procedures, and judgment records fit together,
* how the *same judgment procedure* produces different outcomes
  under different mandate constraint structures, and
* how judgment behavior diverges without changing logic.

These artifacts are **not**:

* executable system inputs,
* governing authority,
* production outputs, or
* relied upon by any code in this repository.

They must **NEVER** be imported, referenced, or depended on by runtime or
implementation logic.
They are YAML-only records for illustration.

---

## Judgment Record Examples

The following example judgment records illustrate reuse vs. divergence
under the same 2022 rate-regime shock:

```text
examples/judgment_records/
├── rate_regime_2022_db_pension.yaml
└── rate_regime_2022_endowment.yaml
```

### Interpretation Guidance

* Both records are produced by the **same procedure**:
  `judgment_loops/rate_regime_adjustment/procedure.md`
* Divergence arises exclusively from differences in the governing mandates:

  * `db_pension_v1` (liability-driven)
  * `endowment_v1` (perpetual capital)

Any behavior that cannot be explained by mandate differences
indicates a design or procedural error.

---

## Non-Authority Notice

If an artifact in this directory conflicts with:

1. `JUDGMENT_AUTHORITY.md`
2. `PROCEDURE_CONTRACT.md`
3. `JUDGMENT_RECORD_SCHEMA.md`
4. a governing mandate

then the artifact in this directory is **incorrect by definition**.

---

## Change Policy

Examples may be added, modified, or removed freely.
They do not require governance review.

Changes here do **not** constitute changes in system behavior.
