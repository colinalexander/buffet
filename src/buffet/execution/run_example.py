"""CLI entrypoint to run a single judgment example."""

from __future__ import annotations

import argparse
from pathlib import Path

from buffet.execution.loop_runner import run_judgment_loop


def build_parser() -> argparse.ArgumentParser:
    """Build the CLI argument parser."""
    parser = argparse.ArgumentParser(description="Run a buffet judgment example.")
    parser.add_argument("--mandate", required=True, help="Path to mandate YAML")
    parser.add_argument("--scenario", required=True, help="Path to scenario YAML")
    parser.add_argument(
        "--thresholds",
        default="judgment_loops/rate_regime_adjustment/thresholds.yaml",
        help="Path to procedure thresholds YAML",
    )
    parser.add_argument(
        "--out-dir",
        default="data/processed/judgment_records",
        help="Output directory for judgment records",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    """Run the example and write outputs under data/processed."""
    parser = build_parser()
    args = parser.parse_args(argv)

    records_dir = Path(args.out_dir)
    escalations_dir = Path("data/processed/escalations")

    record, record_path = run_judgment_loop(
        mandate_path=Path(args.mandate),
        scenario_path=Path(args.scenario),
        thresholds_path=Path(args.thresholds),
        records_dir=records_dir,
        escalations_dir=escalations_dir,
    )

    print(f"Wrote judgment record: {record_path}")
    if record.escalation is not None:
        print("Escalation routed for human review.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
