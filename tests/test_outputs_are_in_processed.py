"""Tests for output location enforcement."""

from pathlib import Path

from buffet.execution.loop_runner import run_judgment_loop


def test_outputs_are_in_processed() -> None:
    """Ensure records are written under data/processed/judgment_records."""
    record, path = run_judgment_loop(
        mandate_path=Path("mandates/liability_driven/db_pension_v1/mandate.yaml"),
        scenario_path=Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml"),
        thresholds_path=Path("judgment_loops/rate_regime_adjustment/thresholds.yaml"),
        records_dir=Path("data/processed/judgment_records"),
        escalations_dir=Path("data/processed/escalations"),
    )

    assert record.record_id in path.name
    assert path.exists()
    assert path.parent.resolve() == Path("data/processed/judgment_records").resolve()
