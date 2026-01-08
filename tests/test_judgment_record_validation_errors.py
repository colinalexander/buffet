"""Tests for judgment record validation errors."""

import pytest

from buffet.contracts.judgment_record import JudgmentRecord


def _valid_record() -> dict:
    return {
        "record_id": "abc",
        "timestamp": "2022-01-01T00:00:00Z",
        "authority": {},
        "invocation": {},
        "state": {},
        "outcome": {"type": "affirm_alignment", "description": "ok"},
        "confidence": {},
        "constraints": {},
        "compliance": {},
        "behavior": {
            "tool_calls": 0,
            "procedure_branches_taken": [],
            "decision_latency_ms": 0,
            "escalated": False,
            "inaction": True,
        },
        "audit": {},
    }


def test_validation_passes() -> None:
    """Ensure a valid record passes validation."""
    data = _valid_record()
    JudgmentRecord.validate_fields(data)


def test_missing_required_field_raises() -> None:
    """Ensure missing required fields raise errors."""
    data = _valid_record()
    data.pop("authority")
    with pytest.raises(ValueError):
        JudgmentRecord.validate_fields(data)


def test_invalid_outcome_type_raises() -> None:
    """Ensure invalid outcome types raise errors."""
    data = _valid_record()
    data["outcome"]["type"] = "trade"
    with pytest.raises(ValueError):
        JudgmentRecord.validate_fields(data)


def test_behavior_wrong_type_raises() -> None:
    """Ensure behavior fields enforce type checks."""
    data = _valid_record()
    data["behavior"]["tool_calls"] = "zero"
    with pytest.raises(ValueError):
        JudgmentRecord.validate_fields(data)
