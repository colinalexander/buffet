"""End-to-end runner for judgment loop execution."""

from __future__ import annotations

from dataclasses import replace
from pathlib import Path
from time import perf_counter
from typing import Tuple

from buffet.contracts.judgment_record import JudgmentRecord
from buffet.execution.escalation import route_escalation
from buffet.execution.memory import write_judgment_record
from buffet.mandates.loader import load_mandate
from buffet.procedures.rate_regime_adjustment import (
    RateRegimeAdjustmentProcedure,
    load_thresholds,
)
from buffet.sensing.scenario import load_scenario


def run_judgment_loop(
    mandate_path: Path,
    scenario_path: Path,
    thresholds_path: Path,
    records_dir: Path,
    escalations_dir: Path,
) -> Tuple[JudgmentRecord, Path]:
    """Run a single judgment loop and persist its record."""
    mandate = load_mandate(mandate_path)
    scenario = load_scenario(scenario_path)
    thresholds = load_thresholds(thresholds_path)

    procedure = RateRegimeAdjustmentProcedure()
    start = perf_counter()
    record = procedure.judge(
        mandate,
        scenario,
        thresholds,
        decision_latency_ms=0,
    )
    elapsed_ms = int((perf_counter() - start) * 1000)
    behavior = dict(record.behavior)
    behavior["decision_latency_ms"] = elapsed_ms
    record = replace(record, behavior=behavior)

    record_path = write_judgment_record(record, records_dir)
    if record.escalation is not None:
        route_escalation(record, escalations_dir)

    return record, record_path
