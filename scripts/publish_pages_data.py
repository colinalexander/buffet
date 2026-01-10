"""Publish judgment records for the GitHub Pages viewer."""

from __future__ import annotations

import argparse
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

import yaml

REQUIRED_KEYS = {
    "authority",
    "invocation",
    "state",
    "outcome",
    "confidence",
    "constraints",
    "compliance",
    "behavior",
    "audit",
}


def parse_args() -> argparse.Namespace:
    """Parse CLI arguments for publishing."""
    parser = argparse.ArgumentParser(description="Publish judgment records to docs/data.")
    parser.add_argument(
        "--in-dir",
        default="data/processed/judgment_records",
        help="Input directory of YAML judgment records",
    )
    parser.add_argument(
        "--out-dir",
        default="docs/data",
        help="Output directory for JSON snapshot",
    )
    parser.add_argument(
        "--clean",
        action="store_true",
        help="Remove existing records output before publishing",
    )
    parser.add_argument(
        "--include-examples",
        action="store_true",
        help="Include examples/ judgment records in the published index",
    )
    return parser.parse_args()


def _validate_record(data: Dict[str, Any], source: Path) -> None:
    """Validate minimal schema requirements for a record."""
    missing = REQUIRED_KEYS.difference(data.keys())
    if missing:
        raise ValueError(f"Record {source} missing keys: {sorted(missing)}")


def _load_records(paths: Iterable[Path]) -> List[Dict[str, Any]]:
    """Load and validate records from YAML files."""
    records: List[Dict[str, Any]] = []
    for path in paths:
        data = yaml.safe_load(path.read_text())
        if not isinstance(data, dict):
            raise ValueError(f"Record {path} is invalid")
        _validate_record(data, path)
        data["_source_path"] = path
        records.append(data)
    return records


def _record_json_path(out_dir: Path, source_path: Path) -> Path:
    """Return output JSON path for a record."""
    filename = f"{source_path.stem}.json"
    return out_dir / "records" / filename


def _index_entry(record: Dict[str, Any], json_path: Path, out_dir: Path) -> Dict[str, Any]:
    """Build index entry metadata."""
    authority = record.get("authority", {})
    outcome = record.get("outcome", {})
    confidence = record.get("confidence", {})
    relative_path = json_path.relative_to(out_dir.parent).as_posix()
    return {
        "path": relative_path,
        "record_id": record.get("record_id"),
        "timestamp": record.get("timestamp"),
        "mandate_id": authority.get("mandate_id"),
        "mandate_version": authority.get("mandate_version"),
        "procedure_id": authority.get("procedure_id"),
        "procedure_version": authority.get("procedure_version"),
        "outcome_type": outcome.get("type"),
        "confidence_level": confidence.get("level"),
    }


def _load_mandate_sources() -> Dict[Tuple[str, str], Path]:
    """Index mandate source files by (mandate_id, version)."""
    sources: Dict[Tuple[str, str], Path] = {}
    for path in Path("mandates").glob("**/mandate.yaml"):
        try:
            data = yaml.safe_load(path.read_text())
        except Exception:
            continue
        if not isinstance(data, dict):
            continue
        meta = data.get("meta")
        if not isinstance(meta, dict):
            continue
        mandate_id = meta.get("mandate_id")
        version = meta.get("version")
        if not mandate_id or version is None:
            continue
        sources[(str(mandate_id), str(version))] = path
    return sources


def _publish_authority_attachments(
    out_dir: Path,
    mandate_keys: Iterable[Tuple[str, str]],
    procedure_keys: Iterable[Tuple[str, str]],
    clean: bool = False,
) -> Dict[str, Any]:
    """Publish referenced mandate/procedure sources for audit packages."""
    site_root = out_dir.parent
    attachments_root = site_root / "attachments"
    if clean and attachments_root.exists():
        shutil.rmtree(attachments_root)

    mandates_out = attachments_root / "mandates"
    procedures_out = attachments_root / "procedures"
    mandates_out.mkdir(parents=True, exist_ok=True)
    procedures_out.mkdir(parents=True, exist_ok=True)

    mandate_sources = _load_mandate_sources()

    published_mandates: List[Dict[str, Any]] = []
    for mandate_id, version in sorted(set(mandate_keys)):
        source_path = mandate_sources.get((mandate_id, version))
        repo_path = source_path.as_posix() if source_path else None
        published_path = None
        if source_path:
            target_dir = mandates_out / mandate_id / version
            target_dir.mkdir(parents=True, exist_ok=True)
            target_path = target_dir / "mandate.yaml"
            shutil.copy2(source_path, target_path)
            published_path = target_path.relative_to(site_root).as_posix()
        published_mandates.append(
            {
                "mandate_id": mandate_id,
                "version": version,
                "repo_path": repo_path,
                "published_path": published_path,
            }
        )

    published_procedures: List[Dict[str, Any]] = []
    for procedure_id, version in sorted(set(procedure_keys)):
        source_path = Path("judgment_loops") / procedure_id / "procedure.md"
        repo_path = source_path.as_posix() if source_path.exists() else None
        published_path = None
        thresholds_repo_path = None
        thresholds_published_path = None
        if source_path.exists():
            target_dir = procedures_out / procedure_id / version
            target_dir.mkdir(parents=True, exist_ok=True)
            target_path = target_dir / "procedure.md"
            shutil.copy2(source_path, target_path)
            published_path = target_path.relative_to(site_root).as_posix()

            thresholds_path = source_path.parent / "thresholds.yaml"
            if thresholds_path.exists():
                thresholds_repo_path = thresholds_path.as_posix()
                thresholds_target = target_dir / "thresholds.yaml"
                shutil.copy2(thresholds_path, thresholds_target)
                thresholds_published_path = thresholds_target.relative_to(site_root).as_posix()

        published_procedures.append(
            {
                "procedure_id": procedure_id,
                "version": version,
                "repo_path": repo_path,
                "published_path": published_path,
                "thresholds_repo_path": thresholds_repo_path,
                "thresholds_published_path": thresholds_published_path,
            }
        )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "mandates": published_mandates,
        "procedures": published_procedures,
    }


def _percent(value: Any) -> str:
    """Format numeric values as a percentage string when possible."""
    try:
        num = float(value)
    except (TypeError, ValueError):
        return str(value)
    return f"{num * 100:.1f}%"


def _hard_constraint_highlights(mandate: Dict[str, Any]) -> str:
    """Create a short, audit-friendly summary of hard constraints."""
    highlights: List[str] = []

    risk = mandate.get("risk_constraints") if isinstance(mandate.get("risk_constraints"), dict) else {}
    max_dd = risk.get("max_drawdown") if isinstance(risk.get("max_drawdown"), dict) else None
    if max_dd and max_dd.get("level") is not None:
        action = max_dd.get("breach_action")
        action_text = f" ({action})" if action else ""
        highlights.append(f"Max drawdown ≤ {_percent(max_dd.get('level'))}{action_text}")

    fr = risk.get("funding_ratio") if isinstance(risk.get("funding_ratio"), dict) else None
    if fr and fr.get("minimum") is not None:
        action = fr.get("breach_action")
        action_text = f" ({action})" if action else ""
        highlights.append(f"Funding ratio ≥ {fr.get('minimum')}{action_text}")

    shortfall = risk.get("shortfall_risk") if isinstance(risk.get("shortfall_risk"), dict) else None
    if shortfall and shortfall.get("max_probability") is not None:
        horizon = shortfall.get("horizon_years")
        horizon_text = f" / {horizon}y" if horizon is not None else ""
        action = shortfall.get("breach_action")
        action_text = f" ({action})" if action else ""
        highlights.append(f"Shortfall probability ≤ {_percent(shortfall.get('max_probability'))}{horizon_text}{action_text}")

    existential = risk.get("existential_risk") if isinstance(risk.get("existential_risk"), dict) else None
    if existential and existential.get("probability_threshold") is not None:
        horizon = existential.get("horizon_years")
        horizon_text = f" / {horizon}y" if horizon is not None else ""
        action = existential.get("breach_action")
        action_text = f" ({action})" if action else ""
        highlights.append(
            f"Existential risk threshold ≤ {_percent(existential.get('probability_threshold'))}{horizon_text}{action_text}"
        )

    liquidity = mandate.get("liquidity") if isinstance(mandate.get("liquidity"), dict) else {}
    if liquidity.get("minimum_buffer_months") is not None:
        highlights.append(f"Liquidity buffer ≥ {liquidity.get('minimum_buffer_months')} months")
    forced = liquidity.get("forced_liquidation") if isinstance(liquidity.get("forced_liquidation"), dict) else None
    if forced and forced.get("prohibited") is True:
        highlights.append("Forced liquidation prohibited")

    leverage = mandate.get("leverage") if isinstance(mandate.get("leverage"), dict) else {}
    if leverage.get("max_gross_exposure") is not None:
        action = leverage.get("breach_action")
        action_text = f" ({action})" if action else ""
        highlights.append(f"Max gross exposure ≤ {leverage.get('max_gross_exposure')}{action_text}")

    return "; ".join(highlights[:4]) if highlights else "See mandate for constraint details."


def publish_mandates(
    *,
    mandates_root: Path = Path("mandates"),
    site_root: Path = Path("docs"),
    clean: bool = False,
) -> Dict[str, Any]:
    """Publish all mandates + optional artifacts for the GitHub Pages viewer."""
    out_dir = site_root / "mandates"
    if clean and out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    entries: List[Dict[str, Any]] = []
    if not mandates_root.exists():
        index = {"generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "mandates": []}
        (out_dir / "index.json").write_text(json.dumps(index, sort_keys=True, indent=2) + "\n", encoding="utf-8")
        return index

    for path in sorted(mandates_root.glob("**/mandate.yaml")):
        try:
            mandate = yaml.safe_load(path.read_text())
        except Exception:
            continue
        if not isinstance(mandate, dict):
            continue
        meta = mandate.get("meta")
        if not isinstance(meta, dict):
            continue

        mandate_id = meta.get("mandate_id")
        if not mandate_id:
            continue
        mandate_id = str(mandate_id)

        version = meta.get("version")
        version_text = "" if version is None else str(version)
        effective_date = meta.get("effective_date")
        effective_date_text = None if effective_date is None else str(effective_date)

        source_path = path.as_posix()
        dir_path = path.parent
        ips_path = (dir_path / "IPS.md") if (dir_path / "IPS.md").exists() else None
        changelog_path = (dir_path / "changelog.md") if (dir_path / "changelog.md").exists() else None

        target_dir = out_dir / mandate_id
        target_dir.mkdir(parents=True, exist_ok=True)
        published_mandate_path = target_dir / "mandate.yaml"
        shutil.copy2(path, published_mandate_path)

        published_ips = None
        if ips_path:
            published_ips_path = target_dir / "IPS.md"
            shutil.copy2(ips_path, published_ips_path)
            published_ips = published_ips_path.relative_to(site_root).as_posix()

        published_changelog = None
        if changelog_path:
            published_changelog_path = target_dir / "changelog.md"
            shutil.copy2(changelog_path, published_changelog_path)
            published_changelog = published_changelog_path.relative_to(site_root).as_posix()

        entries.append(
            {
                "mandate_id": mandate_id,
                "archetype": None if meta.get("archetype") is None else str(meta.get("archetype")),
                "investor_type": None if meta.get("investor_type") is None else str(meta.get("investor_type")),
                "version": version_text,
                "effective_date": effective_date_text,
                "owner": None if meta.get("owner") is None else str(meta.get("owner")),
                "source_path": source_path,
                "ips_path": ips_path.as_posix() if ips_path else None,
                "changelog_path": changelog_path.as_posix() if changelog_path else None,
                "published_mandate_path": published_mandate_path.relative_to(site_root).as_posix(),
                "published_ips_path": published_ips,
                "published_changelog_path": published_changelog,
                "hard_constraint_highlights": _hard_constraint_highlights(mandate),
            }
        )

    entries.sort(key=lambda e: str(e.get("mandate_id") or ""))
    index = {"generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"), "mandates": entries}
    (out_dir / "index.json").write_text(json.dumps(index, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    return index


def publish_pages_data(
    in_dir: Path,
    out_dir: Path,
    clean: bool = False,
    include_examples: bool = False,
) -> Dict[str, Any]:
    """Publish YAML records into a JSON snapshot for Pages."""
    input_paths = sorted(in_dir.glob("*.yaml"))
    if include_examples:
        examples_dir = Path("examples/judgment_records")
        if examples_dir.exists():
            input_paths.extend(sorted(examples_dir.glob("*.yaml")))

    records = _load_records(input_paths)
    published_at = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

    records_dir = out_dir / "records"
    records_dir.mkdir(parents=True, exist_ok=True)
    if clean:
        shutil.rmtree(records_dir)
        records_dir.mkdir(parents=True, exist_ok=True)

    index_entries: List[Dict[str, Any]] = []
    mandate_keys: List[Tuple[str, str]] = []
    procedure_keys: List[Tuple[str, str]] = []
    for record in records:
        source_path = record.pop("_source_path")
        json_path = _record_json_path(out_dir, source_path)
        payload = dict(record)
        payload["_published_from"] = source_path.name
        payload["_published_at"] = published_at
        with json_path.open("w", encoding="utf-8") as handle:
            json.dump(payload, handle, sort_keys=True, indent=2)
        index_entries.append(_index_entry(payload, json_path, out_dir))
        authority = payload.get("authority")
        if isinstance(authority, dict):
            mandate_id = authority.get("mandate_id")
            mandate_version = authority.get("mandate_version")
            procedure_id = authority.get("procedure_id")
            procedure_version = authority.get("procedure_version")
            if mandate_id and mandate_version is not None:
                mandate_keys.append((str(mandate_id), str(mandate_version)))
            if procedure_id and procedure_version:
                procedure_keys.append((str(procedure_id), str(procedure_version)))

    index_entries.sort(key=lambda entry: entry.get("timestamp") or "", reverse=True)
    index = {
        "generated_at": published_at,
        "records": index_entries,
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    index_path = out_dir / "index.json"
    with index_path.open("w", encoding="utf-8") as handle:
        json.dump(index, handle, sort_keys=True, indent=2)

    authority_sources = _publish_authority_attachments(
        out_dir=out_dir, mandate_keys=mandate_keys, procedure_keys=procedure_keys, clean=clean
    )
    authority_path = out_dir / "authority_sources.json"
    with authority_path.open("w", encoding="utf-8") as handle:
        json.dump(authority_sources, handle, sort_keys=True, indent=2)

    return index


def main() -> int:
    """CLI entrypoint for publishing pages data."""
    args = parse_args()
    out_dir = Path(args.out_dir)
    site_root = out_dir.parent
    publish_pages_data(
        in_dir=Path(args.in_dir),
        out_dir=out_dir,
        clean=args.clean,
        include_examples=args.include_examples,
    )
    publish_mandates(site_root=site_root, clean=args.clean)
    print("Published docs/data snapshot + docs/mandates index.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
