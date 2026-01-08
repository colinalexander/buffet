"""Tests for escalation artifact creation."""

from pathlib import Path

import yaml

from buffet.execution.loop_runner import run_judgment_loop


def test_escalation_writes_artifact(tmp_path: Path) -> None:
    """Ensure escalation produces a record and escalation artifact."""
    records_dir = tmp_path / "records"
    escalations_dir = tmp_path / "escalations"

    record, record_path = run_judgment_loop(
        mandate_path=Path("mandates/liability_driven/db_pension_v1/mandate.yaml"),
        scenario_path=Path(
            "judgment_loops/rate_regime_adjustment/scenarios/escalation_case.yaml"
        ),
        thresholds_path=Path("judgment_loops/rate_regime_adjustment/thresholds.yaml"),
        records_dir=records_dir,
        escalations_dir=escalations_dir,
    )

    assert record_path.exists()
    assert record.outcome["type"] == "escalate"
    assert record.behavior["escalated"] is True

    escalation_files = list(escalations_dir.glob("*.yaml"))
    assert len(escalation_files) == 1
    escalation = yaml.safe_load(escalation_files[0].read_text())
    for key in ["record_id", "mandate_id", "procedure_id", "reason"]:
        assert key in escalation
