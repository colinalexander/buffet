"""Tests for documentation hierarchy references."""

from pathlib import Path


def test_document_hierarchy_reference() -> None:
    """Ensure documentation/README.md lists contracts in order."""
    doc_path = Path("documentation/README.md")
    assert doc_path.exists(), "documentation/README.md must exist"
    content = doc_path.read_text(encoding="utf-8")

    authority = "documentation/JUDGMENT_AUTHORITY.md"
    procedure_contract = "documentation/PROCEDURE_CONTRACT.md"
    record_schema = "documentation/JUDGMENT_RECORD_SCHEMA.md"

    authority_index = content.find(authority)
    procedure_index = content.find(procedure_contract)
    schema_index = content.find(record_schema)

    assert authority_index != -1, "Missing JUDGMENT_AUTHORITY reference"
    assert procedure_index != -1, "Missing PROCEDURE_CONTRACT reference"
    assert schema_index != -1, "Missing JUDGMENT_RECORD_SCHEMA reference"
    assert authority_index < procedure_index < schema_index, "Contract order is incorrect"
