## MandateOS Process Diagram Prompt (Source of Truth)

Goal: a calm, institutional diagram explaining MandateOS as **governed judgment** (audit artifacts, not execution).

Required semantics:
- Emphasize **READ-ONLY / NO TRADES** (must be unmissable).
- Authority hierarchy must be explicit and non-engineer-friendly:
  - **Authority Contracts** are **constitutional (highest authority)**.
  - Authority: contracts → mandates → procedures → code.
- Escalation must be framed as a **designed safety valve / authority boundary crossing**, not an error.
- Outputs must clearly separate:
  - Append-only **Judgment Records** at `data/processed/judgment_records/`
  - Append-only **Escalations** at `data/processed/escalations/`
- Include “No portfolio mutation” and “No external data fetch” where relevant.

Style constraints:
- Professional, neutral tone (no “risk alarm” red).
- Minimal iconography; if used, a subtle lock glyph for constitutional contracts.
- Clean layout suitable for CIO / Risk / Compliance decks.

