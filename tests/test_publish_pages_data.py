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

    record_path = in_dir / "record_1.yaml"
    record_path.write_text(yaml.safe_dump(record, sort_keys=True))

    record2 = dict(record)
    record2["record_id"] = "def"
    record2["timestamp"] = "2022-01-02T00:00:00Z"
    record2["behavior"] = dict(record["behavior"])
    record2["behavior"]["decision_latency_ms"] = 1234

    record_path2 = in_dir / "record_2.yaml"
    record_path2.write_text(yaml.safe_dump(record2, sort_keys=True))

    index = publish_pages_data(in_dir=in_dir, out_dir=out_dir, clean=True)

    index_path = out_dir / "index.json"
    assert index_path.exists()
    parsed_index = json.loads(index_path.read_text())

    assert "records" in parsed_index
    assert len(parsed_index["records"]) == 2
    entry = parsed_index["records"][0]
    for key in [
        "path",
        "record_id",
        "timestamp",
        "mandate_id",
        "procedure_id",
        "outcome_type",
        "confidence_level",
        "published_from",
        "judgment_fingerprint",
    ]:
        assert key in entry
    assert entry["path"].startswith("data/records/")

    fingerprints = {e["judgment_fingerprint"] for e in parsed_index["records"]}
    assert len(fingerprints) == 1

    assert "groups" in parsed_index
    assert len(parsed_index["groups"]) == 1
    group = parsed_index["groups"][0]
    assert group["count"] == 2
    assert group["fingerprint"] in fingerprints
    assert group["representative_path"] in {e["path"] for e in parsed_index["records"]}
    assert group["first_timestamp"] == "2022-01-01T00:00:00Z"
    assert group["last_timestamp"] == "2022-01-02T00:00:00Z"
    assert [e["timestamp"] for e in group["emissions"]] == ["2022-01-02T00:00:00Z", "2022-01-01T00:00:00Z"]

    records_dir = out_dir / "records"
    record_files = list(records_dir.glob("*.json"))
    assert len(record_files) == 2
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
        "judgment_fingerprint",
        "_published_from",
        "_published_at",
    ]:
        assert key in record_json

    assert len(index["records"]) == 2
    assert len(index["groups"]) == 1
