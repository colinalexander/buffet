"""Scenario input parsing for deterministic sensing stubs."""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Optional

import yaml


@dataclass(frozen=True)
class EnvironmentState:
    """Minimal environmental regime snapshot."""

    rate_regime: str
    inflation_regime: str
    uncertainty: float


@dataclass(frozen=True)
class PortfolioState:
    """Minimal portfolio exposure snapshot."""

    gross_exposure: float
    liquidity_buffer_months: int
    funding_ratio: Optional[float]


@dataclass(frozen=True)
class ScenarioInput:
    """Deterministic scenario input for sensing."""

    scenario_id: str
    as_of: str
    environment: EnvironmentState
    portfolio: PortfolioState


_DEFAULT_ENV = EnvironmentState(
    rate_regime="stable",
    inflation_regime="stable",
    uncertainty=0.1,
)
_DEFAULT_PORTFOLIO = PortfolioState(
    gross_exposure=1.0,
    liquidity_buffer_months=12,
    funding_ratio=None,
)


def _get_nested(data: Dict[str, Any], *keys: str, default: Any = None) -> Any:
    current: Any = data
    for key in keys:
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]
    return current


def load_scenario(path: Path) -> ScenarioInput:
    """Load a scenario YAML file, falling back to defaults when needed."""
    data = yaml.safe_load(path.read_text()) if path.exists() else None
    data = data or {}

    scenario_id = str(data.get("scenario_id") or path.stem)
    as_of = str(data.get("as_of") or "1970-01-01T00:00:00Z")

    env = EnvironmentState(
        rate_regime=str(_get_nested(data, "environment", "rate_regime", default=_DEFAULT_ENV.rate_regime)),
        inflation_regime=str(
            _get_nested(data, "environment", "inflation_regime", default=_DEFAULT_ENV.inflation_regime)
        ),
        uncertainty=float(_get_nested(data, "environment", "uncertainty", default=_DEFAULT_ENV.uncertainty)),
    )

    portfolio = PortfolioState(
        gross_exposure=float(_get_nested(data, "portfolio", "gross_exposure", default=_DEFAULT_PORTFOLIO.gross_exposure)),
        liquidity_buffer_months=int(
            _get_nested(data, "portfolio", "liquidity_buffer_months", default=_DEFAULT_PORTFOLIO.liquidity_buffer_months)
        ),
        funding_ratio=_get_nested(data, "portfolio", "funding_ratio", default=_DEFAULT_PORTFOLIO.funding_ratio),
    )
    funding_ratio = float(portfolio.funding_ratio) if portfolio.funding_ratio is not None else None
    portfolio = PortfolioState(
        gross_exposure=portfolio.gross_exposure,
        liquidity_buffer_months=portfolio.liquidity_buffer_months,
        funding_ratio=funding_ratio,
    )

    return ScenarioInput(
        scenario_id=scenario_id,
        as_of=as_of,
        environment=env,
        portfolio=portfolio,
    )
