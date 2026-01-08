"""Escalation routing for judgment outcomes."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict

import yaml

from buffet.contracts.judgment_record import JudgmentRecord


def route_escalation(record: JudgmentRecord, output_dir: Path) -> Path:
    """Write an escalation stub record for human review."""
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.fromisoformat(record.timestamp.replace("Z", "+00:00"))
    filename = f"{timestamp.strftime('%Y%m%dT%H%M%SZ')}_{record.record_id}.yaml"
    path = output_dir / filename
    if path.exists():
        raise FileExistsError(f"Escalation record already exists: {path}")
    payload: Dict[str, object] = {
        "record_id": record.record_id,
        "timestamp": record.timestamp,
        "mandate_id": record.authority.get("mandate_id"),
        "procedure_id": record.authority.get("procedure_id"),
        "reason": record.escalation.get("escalation_reason") if record.escalation else None,
    }
    with path.open("w", encoding="utf-8") as handle:
        yaml.safe_dump(payload, handle, sort_keys=True)
    return path
