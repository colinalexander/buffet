"""Rationale formatting for deterministic explanations."""

from __future__ import annotations

from buffet.mandates.loader import Mandate
from buffet.reasoning.align import AlignmentResult
from buffet.reasoning.confidence import ConfidenceResult
from buffet.sensing.scenario import ScenarioInput


def outcome_rationale(
    mandate: Mandate,
    scenario: ScenarioInput,
    alignment: AlignmentResult,
    confidence: ConfidenceResult,
) -> str:
    """Compose a short, deterministic rationale string."""
    parts = [
        f"Regime={scenario.environment.rate_regime}",
        f"gross_exposure={scenario.portfolio.gross_exposure:.2f}",
        f"liquidity_buffer_months={scenario.portfolio.liquidity_buffer_months}",
        f"confidence={confidence.level:.2f}",
        f"mandate={mandate.mandate_id}",
    ]
    if alignment.hard_constraints_breached:
        parts.append("hard_constraint_breach")
    elif alignment.constraints_at_risk:
        parts.append("constraints_at_risk")
    else:
        parts.append("within_constraints")
    return " | ".join(parts)
