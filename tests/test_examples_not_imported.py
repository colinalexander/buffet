"""Tests that examples are not referenced by runtime code."""

from pathlib import Path


def test_examples_not_imported() -> None:
    """Ensure runtime code does not reference examples paths."""
    base = Path("src/buffet")
    assert base.exists(), "src/buffet must exist"
    for path in base.rglob("*.py"):
        content = path.read_text(encoding="utf-8")
        assert "examples/" not in content, f"examples/ referenced in {path}"
