# Skill Version Review — Prompt Contract (v1.0)

## Purpose
Review whether a proposed new skill version is compatible with the prior version in authority boundaries, scope, checkpoints, and auditability.

This is a governance review. It does not evaluate investability, performance, or returns.

## Inputs (required, see File Inputs below)
- OLD SKILL (prior version): full SKILL.md text
- NEW SKILL (proposed version): full SKILL.md text

## Authority constraints (mandatory)
- You must not propose new skill content. Review only.
- You must not reinterpret mandates, procedures, or portfolio logic.
- You must treat skill docs as non-authoritative primitives that defer to canonical sources.

## Output (strict)
Produce a compatibility review with the following sections:

1) Summary Verdict
- Compatible: Yes / No
- Confidence: High / Medium / Low
- Escalation required: Yes / No (reason)

2) Breaking Changes (if any)
List concrete incompatibilities that would change downstream behavior or governance.
For each breaking change, include:
- What changed
- Why it matters (authority/scope/audit)
- Risk severity: High / Medium / Low

3) Authority Drift Check
Explicitly compare old vs new for:
- Humans: what humans may decide
- Models: what models may advise on
- Models: what models may NOT decide
- Escalation rules: tightened / unchanged / weakened
Flag any expansion of model authority as a breaking change unless explicitly justified.

4) Scope Drift Check
Compare old vs new for:
- Added/removed responsibilities
- Encroachment into strategies, optimization, or procedures
- Any new outputs that imply decisions rather than constraints

5) Checkpoint Compatibility
For each checkpoint in the old skill:
- Preserved: Yes / No
- If changed, classify as: Clarification / Tightening / Weakening / Redefinition

Weakening or redefinition requires escalation.

6) Auditability Compatibility
Confirm whether the new version preserves:
- Required outputs and rationale
- Record expectations
- Review cadence language
- Versioning fields

7) Recommendation
- If Compatible = Yes: list allowed next steps (e.g., bump version, update change notes).
- If Compatible = No: propose the minimal changes needed to restore compatibility.

## Interpretation Rules
- Clarification and tightening are allowed in vX.x changes.
- Any authority expansion, scope expansion, or weakening of escalation criteria is NOT allowed in vX.x.
- If the new skill changes authority boundaries, required evidence, or escalation semantics, it is a v(X+1).0 change at minimum.

## File Inputs

OLD SKILL:
<old-skill>
...
</old-skill>

NEW SKILL:
<new-skill>
...
</new-skill>

End of review.
