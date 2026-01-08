"""Tests that procedure thresholds do not duplicate mandate constraints."""

from pathlib import Path
from typing import Any, Set

import yaml


def _collect_keys(obj: Any) -> Set[str]:
    keys: Set[str] = set()
    if isinstance(obj, dict):
        keys.update(obj.keys())
        for value in obj.values():
            keys.update(_collect_keys(value))
    elif isinstance(obj, list):
        for value in obj:
            keys.update(_collect_keys(value))
    return keys


def test_thresholds_do_not_duplicate_mandate() -> None:
    """Ensure thresholds.yaml avoids mandate constraint keys."""
    thresholds_path = Path("judgment_loops/rate_regime_adjustment/thresholds.yaml")
    data = yaml.safe_load(thresholds_path.read_text()) or {}
    keys = _collect_keys(data)

    prohibited = {
        "max_drawdown",
        "max_gross_exposure",
        "funding_ratio",
        "minimum_confidence_level",
    }
    overlap = prohibited.intersection(keys)
    assert not overlap, f"thresholds.yaml duplicates mandate constraint keys: {sorted(overlap)}"
