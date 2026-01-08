"""Tests for publishing pages data."""

import json
from pathlib import Path

import yaml

from scripts.publish_pages_data import publish_pages_data


def test_publish_pages_data(tmp_path: Path) -> None:
    """Publish a minimal record and validate output shape."""
    in_dir = tmp_path / "in"
    out_dir = tmp_path / "docs" / "data"
    in_dir.mkdir()

    record = {
        "record_id": "abc",
        "timestamp": "2022-01-01T00:00:00Z",
        "authority": {"mandate_id": "m1", "procedure_id": "p1"},
        "invocation": {},
        "state": {},
        "outcome": {"type": "affirm_alignment", "description": "ok"},
        "confidence": {"level": 0.7, "trend": "stable"},
        "constraints": {"hard_constraints_breached": False, "constraints_at_risk": []},
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

    record_path = in_dir / "record.yaml"
    record_path.write_text(yaml.safe_dump(record, sort_keys=True))

    index = publish_pages_data(in_dir=in_dir, out_dir=out_dir, clean=True)

    index_path = out_dir / "index.json"
    assert index_path.exists()
    parsed_index = json.loads(index_path.read_text())

    assert "records" in parsed_index
    assert len(parsed_index["records"]) == 1
    entry = parsed_index["records"][0]
    for key in [
        "path",
        "record_id",
        "timestamp",
        "mandate_id",
        "procedure_id",
        "outcome_type",
        "confidence_level",
    ]:
        assert key in entry
    assert entry["path"].startswith("data/records/")

    records_dir = out_dir / "records"
    record_files = list(records_dir.glob("*.json"))
    assert len(record_files) == 1
    record_json = json.loads(record_files[0].read_text())
    for key in [
        "authority",
        "invocation",
        "state",
        "outcome",
        "confidence",
        "constraints",
        "compliance",
        "behavior",
        "audit",
        "_published_from",
        "_published_at",
    ]:
        assert key in record_json
    assert record_json["_published_from"] == "record.yaml"

    assert len(index["records"]) == 1
