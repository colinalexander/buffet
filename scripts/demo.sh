#!/usr/bin/env bash
set -euo pipefail

make eval

uv run python - <<'PY'
from pathlib import Path
import yaml

from buffet.execution.loop_runner import run_judgment_loop

records_dir = Path("data/processed/judgment_records")
escalations_dir = Path("data/processed/escalations")
thresholds_path = Path("judgment_loops/rate_regime_adjustment/thresholds.yaml")
scenario_path = Path("judgment_loops/rate_regime_adjustment/scenarios/rising_rates_2022.yaml")

mandates = [
    Path("mandates/liability_driven/db_pension_v1/mandate.yaml"),
    Path("mandates/perpetual_capital/endowment_v1/mandate.yaml"),
]

paths = []
for mandate_path in mandates:
    record, record_path = run_judgment_loop(
        mandate_path=mandate_path,
        scenario_path=scenario_path,
        thresholds_path=thresholds_path,
        records_dir=records_dir,
        escalations_dir=escalations_dir,
    )
    paths.append(record_path)

print("Judgment record paths:")
for path in paths:
    print(f"- {path}")

print("\nSummaries:")
for path in paths:
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
PY
