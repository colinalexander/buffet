"""Print summaries for the latest judgment records."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import List

import yaml


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments."""
    parser = argparse.ArgumentParser(description="Print latest judgment records.")
    parser.add_argument("count", nargs="?", type=int, default=2)
    return parser.parse_args()


def get_latest_records(records_dir: Path, count: int) -> List[Path]:
    """Return the newest record paths by filename timestamp."""
    records = sorted(records_dir.glob("*.yaml"))
    if not records:
        return []
    records = records[-count:]
    return list(reversed(records))


def print_summary(path: Path) -> None:
    """Print a short summary for a single record."""
    data = yaml.safe_load(path.read_text())
    authority = data.get("authority", {})
    outcome = data.get("outcome", {})
    confidence = data.get("confidence", {})
    constraints = data.get("constraints", {})
    behavior = data.get("behavior", {})

    print(str(path))
    print(f"  authority.mandate_id: {authority.get('mandate_id')}")
    print(f"  authority.procedure_id: {authority.get('procedure_id')}")
    print(f"  outcome.type: {outcome.get('type')}")
    print(f"  confidence.level: {confidence.get('level')}")
    print(f"  constraints.hard_constraints_breached: {constraints.get('hard_constraints_breached')}")
    print(f"  behavior.inaction: {behavior.get('inaction')}")
    print(f"  behavior.escalated: {behavior.get('escalated')}")


def main() -> int:
    """Entry point for printing summaries."""
    args = parse_args()
    records_dir = Path("data/processed/judgment_records")
    if not records_dir.exists():
        print(f"No records directory found at {records_dir}")
        return 1

    latest = get_latest_records(records_dir, max(1, args.count))
    if not latest:
        print("No judgment records found.")
        return 1

    for path in latest:
        print_summary(path)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
