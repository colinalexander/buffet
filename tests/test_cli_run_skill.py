"""Tests for the run_skill CLI entrypoint."""

from pathlib import Path

import yaml

from buffet.execution import run_skill


def test_run_skill_writes_record(tmp_path: Path) -> None:
    """Run the CLI main and verify a record is written."""
    out_dir = tmp_path / "records"
    exit_code = run_skill.main(
        [
            "--mandate",
            "mandates/liability_driven/db_pension_v1/mandate.yaml",
            "--scenario",
            "judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml",
            "--out-dir",
            str(out_dir),
        ]
    )

    assert exit_code == 0
    files = list(out_dir.glob("*.yaml"))
    assert len(files) == 1

    record = yaml.safe_load(files[0].read_text())
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
    ]:
        assert key in record
