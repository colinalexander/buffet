"""Tests for append-only record storage."""

from pathlib import Path

from buffet.execution.loop_runner import run_judgment_loop


def test_append_only_records() -> None:
    """Ensure repeated runs create distinct record files."""
    records_dir = Path("data/processed/judgment_records")
    escalations_dir = Path("data/processed/escalations")

    _, path_first = run_judgment_loop(
        mandate_path=Path("mandates/liability_driven/db_pension_v1/mandate.yaml"),
        scenario_path=Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml"),
        thresholds_path=Path("judgment_loops/rate_regime_adjustment/thresholds.yaml"),
        records_dir=records_dir,
        escalations_dir=escalations_dir,
    )
    _, path_second = run_judgment_loop(
        mandate_path=Path("mandates/liability_driven/db_pension_v1/mandate.yaml"),
        scenario_path=Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates.yaml"),
        thresholds_path=Path("judgment_loops/rate_regime_adjustment/thresholds.yaml"),
        records_dir=records_dir,
        escalations_dir=escalations_dir,
    )

    assert path_first.exists()
    assert path_second.exists()
    assert path_first.name != path_second.name
