"""Append-only record storage for judgment outputs."""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict

import yaml

from buffet.contracts.judgment_record import JudgmentRecord


def _compact_timestamp(iso_timestamp: str) -> str:
    """Convert ISO-8601 timestamp to compact form for filenames."""
    normalized = iso_timestamp.replace("Z", "+00:00")
    parsed = datetime.fromisoformat(normalized)
    return parsed.strftime("%Y%m%dT%H%M%SZ")


def write_judgment_record(record: JudgmentRecord, output_dir: Path) -> Path:
    """Write a judgment record in append-only mode."""
    output_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{_compact_timestamp(record.timestamp)}_{record.record_id}.yaml"
    path = output_dir / filename
    if path.exists():
        raise FileExistsError(f"Judgment record already exists: {path}")
    payload: Dict[str, object] = record.to_dict()
    with path.open("w", encoding="utf-8") as handle:
        yaml.safe_dump(payload, handle, sort_keys=True)
    return path
