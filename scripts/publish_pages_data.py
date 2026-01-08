"""Publish judgment records for the GitHub Pages viewer."""

from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List

import yaml

REQUIRED_KEYS = {
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


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for publishing."""
    parser = argparse.ArgumentParser(description="Publish judgment records to docs/data.")
    parser.add_argument(
        "--in-dir",
        default="data/processed/judgment_records",
        help="Input directory of YAML judgment records",
    )
    parser.add_argument(
        "--out-dir",
        default="docs/data",
        help="Output directory for JSON snapshot",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing records output before publishing",
    )
    parser.add_argument(
        "--include-examples",
        action="store_true",
        help="Include examples/ judgment records in the published index",
    )
    return parser.parse_args()


def _validate_record(data: Dict[str, Any], source: Path) -> None:
    """Validate minimal schema requirements for a record."""
    missing = REQUIRED_KEYS.difference(data.keys())
    if missing:
        raise ValueError(f"Record {source} missing keys: {sorted(missing)}")


def _load_records(paths: Iterable[Path]) -> List[Dict[str, Any]]:
    """Load and validate records from YAML files."""
    records: List[Dict[str, Any]] = []
    for path in paths:
        data = yaml.safe_load(path.read_text())
        if not isinstance(data, dict):
            raise ValueError(f"Record {path} is invalid")
        _validate_record(data, path)
        data["_source_path"] = path
        records.append(data)
    return records


def _record_json_path(out_dir: Path, source_path: Path) -> Path:
    """Return output JSON path for a record."""
    filename = f"{source_path.stem}.json"
    return out_dir / "records" / filename


def _index_entry(record: Dict[str, Any], json_path: Path, out_dir: Path) -> Dict[str, Any]:
    """Build index entry metadata."""
    authority = record.get("authority", {})
    outcome = record.get("outcome", {})
    confidence = record.get("confidence", {})
    relative_path = json_path.relative_to(out_dir.parent).as_posix()
    return {
        "path": relative_path,
        "record_id": record.get("record_id"),
        "timestamp": record.get("timestamp"),
        "mandate_id": authority.get("mandate_id"),
        "procedure_id": authority.get("procedure_id"),
        "outcome_type": outcome.get("type"),
        "confidence_level": confidence.get("level"),
    }


def publish_pages_data(
    in_dir: Path,
    out_dir: Path,
    clean: bool = False,
    include_examples: bool = False,
) -> Dict[str, Any]:
    """Publish YAML records into a JSON snapshot for Pages."""
    input_paths = sorted(in_dir.glob("*.yaml"))
    if include_examples:
        examples_dir = Path("examples/judgment_records")
        if examples_dir.exists():
            input_paths.extend(sorted(examples_dir.glob("*.yaml")))

    records = _load_records(input_paths)
    published_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    records_dir = out_dir / "records"
    records_dir.mkdir(parents=True, exist_ok=True)
    if clean:
        shutil.rmtree(records_dir)
        records_dir.mkdir(parents=True, exist_ok=True)

    index_entries: List[Dict[str, Any]] = []
    for record in records:
        source_path = record.pop("_source_path")
        json_path = _record_json_path(out_dir, source_path)
        payload = dict(record)
        payload["_published_from"] = source_path.name
        payload["_published_at"] = published_at
        with json_path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, sort_keys=True, indent=2)
        index_entries.append(_index_entry(payload, json_path, out_dir))

    index_entries.sort(key=lambda entry: entry.get("timestamp") or "", reverse=True)
    index = {
        "generated_at": published_at,
        "records": index_entries,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "index.json"
    with index_path.open("w", encoding="utf-8") as handle:
        json.dump(index, handle, sort_keys=True, indent=2)

    return index


def main() -> int:
    """CLI entrypoint for publishing pages data."""
    args = parse_args()
    publish_pages_data(
        in_dir=Path(args.in_dir),
        out_dir=Path(args.out_dir),
        clean=args.clean,
        include_examples=args.include_examples,
    )
    print("Published docs/data snapshot.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
