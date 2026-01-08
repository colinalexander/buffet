"""Tests for judgment record behavior fields."""

from pathlib import Path

from buffet.mandates.loader import load_mandate
from buffet.procedures.rate_regime_adjustment import RateRegimeAdjustmentProcedure, load_thresholds
from buffet.sensing.scenario import load_scenario


def test_judgment_record_behavior_fields() -> None:
    """Ensure behavior fields are present with correct types."""
    mandate = load_mandate(Path("mandates/liability_driven/db_pension_v1/mandate.yaml"))
    scenario = load_scenario(
        Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml")
    )
    thresholds = load_thresholds(
        Path("judgment_loops/rate_regime_adjustment/thresholds.yaml")
    )
    procedure = RateRegimeAdjustmentProcedure()
    record = procedure.judge(mandate, scenario, thresholds, decision_latency_ms=0)

    assert "constraints" in record.to_dict()
    assert "confidence" in record.to_dict()
    assert "compliance" in record.to_dict()
    assert "behavior" in record.to_dict()

    behavior = record.behavior
    assert isinstance(behavior["tool_calls"], int)
    assert isinstance(behavior["procedure_branches_taken"], list)
    assert isinstance(behavior["decision_latency_ms"], int)
    assert isinstance(behavior["escalated"], bool)
    assert isinstance(behavior["inaction"], bool)
