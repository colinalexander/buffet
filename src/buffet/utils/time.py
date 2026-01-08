"""Time helpers for deterministic formatting."""

from __future__ import annotations

from datetime import datetime, timedelta, timezone


def utc_now_iso() -> str:
    """Return current UTC timestamp in ISO-8601 format."""
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def retained_until_date(years: int) -> str:
    """Return a retained-until date string in ISO-8601 date format."""
    target = datetime.now(timezone.utc).date() + timedelta(days=365 * years)
    return target.isoformat()
