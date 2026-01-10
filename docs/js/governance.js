import { formatShortDate, truncate } from "./core.js";

export const OUTCOME_CONTEXT = {
  affirm_alignment: {
    title: "Affirm Alignment",
    governance_meaning:
      "The procedure ran under the referenced mandate and found the state within authority bounds. Automation may continue with no change requested.",
    why_it_matters:
      "Creates an audit-ready trace showing the mandate was checked, constraints were satisfied, and the institution explicitly chose inaction under documented authority.",
    who_acts: ["Operations / oversight monitoring"],
    typical_next_steps: [
      "File record for audit retention.",
      "Continue monitoring cadence; no approval required.",
      "Review only if trend persists or context changes.",
    ],
  },
  recommend_adjustment: {
    title: "Recommend Adjustment",
    governance_meaning:
      "The procedure recommends an exposure-level adjustment that remains within the mandate’s authority boundaries. The system never places trades.",
    why_it_matters:
      "Provides a governance-relevant change request with bounded authority. Committees can accept, reject, or revise via human-controlled processes.",
    who_acts: ["Portfolio team", "Risk officer (review)"],
    typical_next_steps: [
      "Review recommended changes and supporting evidence.",
      "Confirm the changes remain within mandate constraints.",
      "Document acceptance/rejection and route any portfolio change through human-controlled processes outside MandateOS.",
    ],
  },
  escalate: {
    title: "Escalate",
    governance_meaning:
      "Authority limits were reached (e.g., hard constraint breach, confidence below floor, or unresolved tradeoff). Automation is suspended until human authority decides.",
    why_it_matters:
      "This is the designed safety valve: escalation halts automated judgment when fiduciary judgment is required, preserving explicit authority boundaries and auditability.",
    who_acts: ["Investment committee", "Risk committee", "Compliance"],
    typical_next_steps: [
      "Acknowledge escalation and assign an owner.",
      "Review mandate + procedure versions referenced by the record.",
      "Decide and document resolution; update mandate/procedure if needed.",
    ],
  },
};

export function outcomeLabel(outcomeType) {
  return OUTCOME_CONTEXT[outcomeType]?.title || outcomeType || "Unknown";
}

export function buildGovernanceSummary(meta, data) {
  const outcomeType = data?.outcome?.type || meta?.outcome_type || "unknown";
  const context = OUTCOME_CONTEXT[outcomeType] || null;

  const mandate = data?.authority?.mandate_id || meta?.mandate_id || "unknown mandate";
  const procedure = data?.authority?.procedure_id || meta?.procedure_id || "unknown procedure";
  const date = formatShortDate(data?.timestamp || meta?.timestamp);

  const confidence = data?.confidence?.level ?? meta?.confidence_level;
  const confidenceText =
    confidence === undefined || confidence === null ? null : `Confidence ${Number(confidence).toFixed(2)}`;

  const regime = data?.state?.environment_summary?.regime_state;
  const hardBreached = data?.constraints?.hard_constraints_breached;
  const atRisk = Array.isArray(data?.constraints?.constraints_at_risk) ? data.constraints.constraints_at_risk : [];

  const keyFacts = [];
  if (regime) keyFacts.push(`Regime: ${regime}`);
  if (confidenceText) keyFacts.push(confidenceText);
  if (hardBreached === true) keyFacts.push("Hard constraints breached");
  if (atRisk.length) keyFacts.push(`Constraints at risk: ${atRisk.join(", ")}`);

  const description = data?.outcome?.description ? truncate(data.outcome.description, 160) : null;
  const escalationReason = data?.escalation?.escalation_reason
    ? truncate(data.escalation.escalation_reason, 160)
    : null;

  let headline = `${outcomeLabel(outcomeType)} — ${mandate} / ${procedure}`;
  if (outcomeType === "escalate" && escalationReason) {
    headline = `Escalate — ${escalationReason}`;
  }

  const governanceWhy = context?.why_it_matters || "Governance context unavailable.";
  const requiredAction =
    outcomeType === "escalate"
      ? "Human authority required; automation suspended until reviewed."
      : outcomeType === "recommend_adjustment"
        ? "Human review required to accept/reject recommendation; no portfolio change occurs here."
        : "No action required; record is filed for audit and monitoring.";

  return {
    outcome_type: outcomeType,
    mandate_id: mandate,
    procedure_id: procedure,
    date,
    headline,
    governance_why: governanceWhy,
    required_action: requiredAction,
    key_facts: keyFacts,
    description,
    context,
  };
}
