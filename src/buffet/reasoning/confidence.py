"""Deterministic confidence evaluation."""

from __future__ import annotations

from dataclasses import dataclass

from buffet.sensing.scenario import ScenarioInput


@dataclass(frozen=True)
class ConfidenceResult:
    """Confidence level with a trend label."""

    level: float
    trend: str
    attribution: str


def compute_confidence(scenario: ScenarioInput) -> ConfidenceResult:
    """Compute a deterministic confidence score from scenario uncertainty."""
    uncertainty = max(0.0, min(1.0, scenario.environment.uncertainty))
    level = max(0.0, min(1.0, 0.85 - (uncertainty * 0.5)))
    if uncertainty >= 0.6:
        trend = "degrading"
    elif uncertainty <= 0.2:
        trend = "improving" if scenario.environment.rate_regime != "stable" else "stable"
    else:
        trend = "stable"
    attribution = "Derived from scenario uncertainty and regime stability."
    return ConfidenceResult(level=level, trend=trend, attribution=attribution)
