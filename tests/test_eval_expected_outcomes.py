"""Tests for expected outcomes evaluation harness."""

from pathlib import Path

from buffet.simulation.eval_procedures import evaluate_expected_outcomes


def test_eval_expected_outcomes() -> None:
    """Ensure expected outcomes match procedure results."""
    expected_path = Path(
        "judgment_loops/rate_regime_adjustment/eval/expected_outcomes.yaml"
    )
    evaluate_expected_outcomes(expected_path)
