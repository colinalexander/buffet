"""Judgment Record schema model used for serialized outputs."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional


ALLOWED_OUTCOMES = {"affirm_alignment", "recommend_adjustment", "escalate"}


@dataclass(frozen=True)
class JudgmentRecord:
    """Structured record capturing an auditable judgment outcome."""

    record_id: str
    timestamp: str
    authority: Dict[str, Any]
    invocation: Dict[str, Any]
    state: Dict[str, Any]
    outcome: Dict[str, Any]
    confidence: Dict[str, Any]
    constraints: Dict[str, Any]
    compliance: Dict[str, Any]
    behavior: Dict[str, Any]
    audit: Dict[str, Any]
    adjustment: Optional[Dict[str, Any]] = None
    inaction: Optional[Dict[str, Any]] = None
    escalation: Optional[Dict[str, Any]] = None

    def to_dict(self) -> Dict[str, Any]:
        """Return a serialized dictionary with required fields."""
        data: Dict[str, Any] = {
            "record_id": self.record_id,
            "timestamp": self.timestamp,
            "authority": self.authority,
            "invocation": self.invocation,
            "state": self.state,
            "outcome": self.outcome,
            "confidence": self.confidence,
            "constraints": self.constraints,
            "compliance": self.compliance,
            "behavior": self.behavior,
            "audit": self.audit,
        }
        if self.adjustment is not None:
            data["adjustment"] = self.adjustment
        if self.inaction is not None:
            data["inaction"] = self.inaction
        if self.escalation is not None:
            data["escalation"] = self.escalation
        return data

    @staticmethod
    def validate_fields(data: Dict[str, Any]) -> None:
        """Validate that required Judgment Record fields are present."""
        required = {
            "record_id",
            "timestamp",
            "authority",
            "invocation",
            "state",
            "outcome",
            "confidence",
            "constraints",
            "compliance",
            "behavior",
            "audit",
        }
        missing = required.difference(data.keys())
        if missing:
            raise ValueError(f"Missing required judgment record fields: {sorted(missing)}")

        outcome = data.get("outcome", {})
        if not isinstance(outcome, dict):
            raise ValueError("Outcome must be a mapping")
        outcome_type = outcome.get("type")
        if outcome_type not in ALLOWED_OUTCOMES:
            raise ValueError("Outcome type is invalid")

        behavior = data.get("behavior", {})
        if not isinstance(behavior, dict):
            raise ValueError("Behavior must be a mapping")
        expected_types = {
            "tool_calls": int,
            "procedure_branches_taken": list,
            "decision_latency_ms": int,
            "escalated": bool,
            "inaction": bool,
        }
        for key, expected_type in expected_types.items():
            if key not in behavior:
                raise ValueError(f"Behavior field missing: {key}")
            if not isinstance(behavior[key], expected_type):
                raise ValueError(f"Behavior field has wrong type: {key}")
