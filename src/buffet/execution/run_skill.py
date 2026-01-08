"""CLI entrypoint to run a judgment skill."""

from __future__ import annotations

import argparse
from pathlib import Path

from buffet.execution.loop_runner import run_judgment_loop


def build_parser() -> argparse.ArgumentParser:
    """Build CLI parser for skill execution."""
    parser = argparse.ArgumentParser(description="Run a buffet skill.")
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
    """Run the skill and persist a judgment record."""
    parser = build_parser()
    args = parser.parse_args(argv)

    record, path = run_judgment_loop(
        mandate_path=Path(args.mandate),
        scenario_path=Path(args.scenario),
        thresholds_path=Path(args.thresholds),
        records_dir=Path(args.out_dir),
        escalations_dir=Path("data/processed/escalations"),
    )

    print(f"Wrote judgment record: {path}")
    if record.escalation is not None:
        print("Escalation routed for human review.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
