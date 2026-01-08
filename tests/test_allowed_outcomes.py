"""Tests that procedure outcomes are in the allowed set."""

from pathlib import Path

from buffet.mandates.loader import load_mandate
from buffet.procedures.rate_regime_adjustment import RateRegimeAdjustmentProcedure, load_thresholds
from buffet.sensing.scenario import load_scenario


def test_allowed_outcomes() -> None:
    """Ensure procedure outputs only allowed outcomes."""
    allowed = {"affirm_alignment", "recommend_adjustment", "escalate"}
    mandate = load_mandate(Path("mandates/liability_driven/db_pension_v1/mandate.yaml"))
    scenario = load_scenario(
        Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml")
    )
    thresholds = load_thresholds(
        Path("judgment_loops/rate_regime_adjustment/thresholds.yaml")
    )
    record = RateRegimeAdjustmentProcedure().judge(
        mandate, scenario, thresholds, decision_latency_ms=0
    )

    assert record.outcome["type"] in allowed
