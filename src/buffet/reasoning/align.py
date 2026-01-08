"""Alignment checks against mandate constraints."""

from __future__ import annotations

from dataclasses import dataclass
from typing import List

from buffet.mandates.loader import Mandate
from buffet.sensing.scenario import ScenarioInput


@dataclass(frozen=True)
class AlignmentResult:
    """Result of alignment evaluation."""

    status: str
    hard_constraints_breached: bool
    constraints_at_risk: List[str]
    recommended_changes: List[str]


def evaluate_alignment(mandate: Mandate, scenario: ScenarioInput) -> AlignmentResult:
    """Evaluate whether the scenario aligns with mandate constraints."""
    hard_breach = False
    at_risk: List[str] = []
    recommended: List[str] = []

    max_gross = mandate.max_gross_exposure
    if max_gross is not None and scenario.portfolio.gross_exposure > max_gross:
        hard_breach = True
        recommended.append("Reduce gross exposure to mandate maximum")

    min_buffer = mandate.min_liquidity_buffer_months
    if min_buffer is not None and scenario.portfolio.liquidity_buffer_months < min_buffer:
        at_risk.append("liquidity_buffer_months")
        recommended.append("Increase liquidity buffer to mandate minimum")

    min_funding = mandate.min_funding_ratio
    if min_funding is not None and scenario.portfolio.funding_ratio is not None:
        if scenario.portfolio.funding_ratio < min_funding:
            hard_breach = True
            recommended.append("Restore funding ratio above mandate minimum")

    status = "aligned"
    if hard_breach or at_risk:
        status = "misaligned"

    return AlignmentResult(
        status=status,
        hard_constraints_breached=hard_breach,
        constraints_at_risk=at_risk,
        recommended_changes=recommended,
    )
