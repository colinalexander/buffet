"""Rate regime adjustment procedure implementation."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict
from uuid import uuid4

import yaml

from buffet.contracts.judgment_record import JudgmentRecord
from buffet.mandates.loader import Mandate
from buffet.reasoning.align import AlignmentResult, evaluate_alignment
from buffet.reasoning.confidence import ConfidenceResult, compute_confidence
from buffet.reasoning.explain import outcome_rationale
from buffet.sensing.scenario import ScenarioInput
from buffet.utils.time import retained_until_date, utc_now_iso


@dataclass(frozen=True)
class ProcedureThresholds:
    """Trigger thresholds defined for the procedure."""

    minimum_confirmations: int
    review_cycles: int


def load_thresholds(path: Path) -> ProcedureThresholds:
    """Load procedure thresholds from YAML."""
    data = yaml.safe_load(path.read_text()) or {}
    persistence = data.get("persistence", {}) if isinstance(data, dict) else {}
    return ProcedureThresholds(
        minimum_confirmations=int(persistence.get("minimum_confirmations", 2)),
        review_cycles=int(persistence.get("review_cycles", 2)),
    )


class RateRegimeAdjustmentProcedure:
    """Judgment procedure for rate regime adjustments."""

    procedure_id = "rate_regime_adjustment"
    procedure_version = "v1"

    def judge(
        self,
        mandate: Mandate,
        scenario: ScenarioInput,
        thresholds: ProcedureThresholds,
        decision_latency_ms: int,
    ) -> JudgmentRecord:
        """Execute the procedure and produce a judgment record."""
        alignment = evaluate_alignment(mandate, scenario)
        confidence = compute_confidence(scenario)
        rationale = outcome_rationale(mandate, scenario, alignment, confidence)

        outcome_type = self._determine_outcome(mandate, alignment, confidence)
        branches = self._branches_taken(alignment, confidence, outcome_type, mandate.min_confidence_level)
        outcome = {
            "type": outcome_type,
            "description": rationale,
        }

        adjustment = None
        inaction = None
        escalation = None

        if outcome_type == "recommend_adjustment":
            adjustment = {
                "adjustment_unit": "exposure",
                "recommended_changes": alignment.recommended_changes or [
                    "Rebalance exposures within mandate tolerances"
                ],
                "mandate_constraints_checked": True,
            }
        elif outcome_type == "affirm_alignment":
            inaction = {
                "justification": "Exposures remain within mandate tolerances; no adjustment required.",
                "risks_acknowledged": ["Regime shift warrants continued monitoring"],
            }
        else:
            escalation = {
                "escalation_reason": "Mandate constraints breached or confidence below floor.",
                "human_authority_required": ["Investment committee review"],
                "automated_actions_suspended": True,
            }

        return JudgmentRecord(
            record_id=str(uuid4()),
            timestamp=utc_now_iso(),
            authority={
                "mandate_id": mandate.mandate_id,
                "mandate_version": mandate.mandate_version,
                "procedure_id": self.procedure_id,
                "procedure_version": self.procedure_version,
            },
            invocation={
                "trigger_type": "state_change",
                "trigger_description": f"Scenario {scenario.scenario_id}",
                "persistence_evidence": (
                    f"{thresholds.minimum_confirmations} confirmations over "
                    f"{thresholds.review_cycles} cycles"
                ),
            },
            state={
                "portfolio_summary": {
                    "key_exposures": {
                        "gross_exposure": scenario.portfolio.gross_exposure,
                    },
                    "liquidity_position": {
                        "buffer_months": scenario.portfolio.liquidity_buffer_months,
                    },
                    "leverage_level": scenario.portfolio.gross_exposure,
                },
                "environment_summary": {
                    "regime_state": scenario.environment.rate_regime,
                    "key_uncertainties": [scenario.environment.inflation_regime],
                },
            },
            outcome=outcome,
            adjustment=adjustment,
            inaction=inaction,
            escalation=escalation,
            confidence={
                "level": confidence.level,
                "trend": confidence.trend,
                "attribution": confidence.attribution,
            },
            constraints={
                "hard_constraints_breached": alignment.hard_constraints_breached,
                "constraints_at_risk": alignment.constraints_at_risk,
            },
            compliance={
                "procedure_followed": True,
                "deviations": None,
            },
            behavior={
                "tool_calls": 0,
                "procedure_branches_taken": branches,
                "decision_latency_ms": int(decision_latency_ms),
                "escalated": outcome_type == "escalate",
                "inaction": outcome_type == "affirm_alignment",
            },
            audit={
                "retained_until": retained_until_date(mandate.retention_years),
                "immutable": True,
                "superseded_by": None,
            },
        )

    def _determine_outcome(
        self,
        mandate: Mandate,
        alignment: AlignmentResult,
        confidence: ConfidenceResult,
    ) -> str:
        """Determine the outcome type based on mandate and alignment."""
        if alignment.hard_constraints_breached:
            return "escalate"
        if confidence.level < mandate.min_confidence_level:
            return "escalate"
        if alignment.status == "misaligned":
            return "recommend_adjustment"
        return "affirm_alignment"

    def _branches_taken(
        self,
        alignment: AlignmentResult,
        confidence: ConfidenceResult,
        outcome_type: str,
        min_confidence: float,
    ) -> list[str]:
        """Describe minimal procedure branches taken for audit."""
        branches: list[str] = []
        if alignment.hard_constraints_breached:
            branches.append("hard_constraint_breach")
        if alignment.constraints_at_risk:
            branches.append("constraints_at_risk")
        if confidence.level < min_confidence:
            branches.append("confidence_below_floor")
        branches.append(f"outcome_{outcome_type}")
        return branches
