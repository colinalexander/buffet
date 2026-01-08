"""Tests for expected outcome failure paths."""

from pathlib import Path

import pytest
import yaml

from buffet.simulation.eval_procedures import evaluate_expected_outcomes


def test_eval_failure_path(tmp_path: Path) -> None:
    """Ensure evaluator fails on mismatched expected outcomes."""
    expected = {
        "cases": [
            {
                "mandate": "mandates/liability_driven/db_pension_v1/mandate.yaml",
                "scenario": "judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml",
                "expected_outcome": "affirm_alignment",
            }
        ]
    }
    expected_path = tmp_path / "expected_outcomes.yaml"
    expected_path.write_text(yaml.safe_dump(expected, sort_keys=True))

    with pytest.raises(AssertionError) as excinfo:
        evaluate_expected_outcomes(expected_path)
    assert "mandates/liability_driven/db_pension_v1/mandate.yaml" in str(excinfo.value)
