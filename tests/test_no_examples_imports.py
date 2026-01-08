"""Tests to prevent runtime imports from examples."""

from pathlib import Path


def test_no_examples_imports() -> None:
    """Ensure src code does not reference examples/ paths."""
    base = Path("src/buffet")
    for path in base.rglob("*.py"):
        content = path.read_text(encoding="utf-8")
        assert "examples/" not in content, f"examples/ referenced in {path}"
