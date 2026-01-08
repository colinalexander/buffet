"""Mandate loader with typed accessors for key fields."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional

import yaml


@dataclass(frozen=True)
class Mandate:
    """Typed view over a mandate definition."""

    raw: Dict[str, Any]
    source_path: Path

    def _get_nested(self, *keys: str, default: Any = None) -> Any:
        current: Any = self.raw
        for key in keys:
            if not isinstance(current, dict) or key not in current:
                return default
            current = current[key]
        return current

    @property
    def mandate_id(self) -> str:
        """Return the mandate identifier."""
        return str(self._get_nested("meta", "mandate_id"))

    @property
    def mandate_version(self) -> str:
        """Return the mandate version string."""
        return str(self._get_nested("meta", "version"))

    @property
    def effective_date(self) -> str:
        """Return the mandate effective date."""
        return str(self._get_nested("meta", "effective_date"))

    @property
    def min_confidence_level(self) -> float:
        """Return the minimum confidence level required by the mandate."""
        return float(self._get_nested("confidence", "minimum_confidence_level", default=0.0))

    @property
    def max_gross_exposure(self) -> Optional[float]:
        """Return the maximum gross exposure constraint if defined."""
        value = self._get_nested("leverage", "max_gross_exposure")
        return float(value) if value is not None else None

    @property
    def min_liquidity_buffer_months(self) -> Optional[int]:
        """Return the minimum liquidity buffer in months if defined."""
        value = self._get_nested("liquidity", "minimum_buffer_months")
        return int(value) if value is not None else None

    @property
    def min_funding_ratio(self) -> Optional[float]:
        """Return the minimum funding ratio if defined."""
        value = self._get_nested("risk_constraints", "funding_ratio", "minimum")
        return float(value) if value is not None else None

    @property
    def retention_years(self) -> int:
        """Return audit retention years if defined, otherwise default."""
        value = self._get_nested("audit", "rationale_retention_years")
        return int(value) if value is not None else 10


def load_mandate(path: Path) -> Mandate:
    """Load a mandate YAML file from disk."""
    data = yaml.safe_load(path.read_text())
    if not isinstance(data, dict):
        raise ValueError(f"Mandate at {path} is empty or invalid")
    return Mandate(raw=data, source_path=path)
