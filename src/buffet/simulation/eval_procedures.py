"""Scenario-based evaluator for judgment procedures."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List

import yaml

from buffet.mandates.loader import load_mandate
from buffet.procedures.rate_regime_adjustment import RateRegimeAdjustmentProcedure, load_thresholds
from buffet.sensing.scenario import load_scenario


@dataclass(frozen=True)
class ExpectedOutcomeCase:
    """Expected outcome specification for a scenario and mandate."""

    mandate_path: Path
    scenario_path: Path
    expected_outcome: str


def load_expected_outcomes(path: Path) -> List[ExpectedOutcomeCase]:
    """Load expected outcomes from YAML."""
    data = yaml.safe_load(path.read_text()) or {}
    cases = data.get("cases", [])
    parsed: List[ExpectedOutcomeCase] = []
    for case in cases:
        parsed.append(
            ExpectedOutcomeCase(
                mandate_path=Path(case["mandate"]),
                scenario_path=Path(case["scenario"]),
                expected_outcome=str(case["expected_outcome"]),
            )
        )
    return parsed


def evaluate_expected_outcomes(expected_outcomes_path: Path) -> None:
    """Run the procedure in dry-run mode and assert expected outcomes."""
    thresholds_path = Path("judgment_loops/rate_regime_adjustment/thresholds.yaml")
    thresholds = load_thresholds(thresholds_path)
    procedure = RateRegimeAdjustmentProcedure()

    for case in load_expected_outcomes(expected_outcomes_path):
        mandate = load_mandate(case.mandate_path)
        scenario = load_scenario(case.scenario_path)
        record = procedure.judge(
            mandate,
            scenario,
            thresholds,
            decision_latency_ms=0,
        )
        outcome_type = record.outcome.get("type")
        if outcome_type != case.expected_outcome:
            raise AssertionError(
                "Expected outcome mismatch: "
                f"mandate={case.mandate_path}, scenario={case.scenario_path}, "
                f"expected={case.expected_outcome}, got={outcome_type}"
            )


def main() -> int:
    """CLI entrypoint for evaluation harness."""
    expected_path = Path(
        "judgment_loops/rate_regime_adjustment/eval/expected_outcomes.yaml"
    )
    evaluate_expected_outcomes(expected_path)
    print("All expected outcomes satisfied.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
