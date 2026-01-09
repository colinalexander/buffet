const STORAGE_KEY = "mandateos.viewer.onboarding.v1.completed";

const DEFAULT_STEPS = [
  {
    title: "How to read one Judgment Record",
    body: [
      "Start with the outcome: affirm alignment, recommend adjustment, or escalate.",
      "Confirm authority bindings: mandate + procedure versions referenced by the record.",
      "Scan constraints and confidence to understand why the outcome was produced.",
      "Treat the record as an audit artifact: append-only, time-stamped, reproducible under the referenced sources.",
    ],
  },
  {
    title: "When escalation requires human action",
    body: [
      "Escalate means an authority boundary was reached (e.g., hard constraint breach, confidence below floor, unresolved tradeoff).",
      "Automation is suspended: the system must not proceed as if a decision were made.",
      "Assign an accountable owner, record committee disposition, and route any portfolio action through human-controlled execution outside MandateOS.",
    ],
  },
];

function ensureDialog() {
  let dialog = document.getElementById("onboarding-dialog");
  if (dialog) {
    return dialog;
  }

  dialog = document.createElement("dialog");
  dialog.id = "onboarding-dialog";
  dialog.className = "dialog";
  dialog.setAttribute("aria-label", "Onboarding");

  dialog.innerHTML = `
    <form method="dialog" class="dialog-card">
      <div class="dialog-header">
        <div>
          <div class="dialog-kicker">MandateOS</div>
          <h2 class="dialog-title">Judgment Viewer onboarding</h2>
        </div>
        <button class="btn btn-ghost" value="close" aria-label="Close onboarding">Close</button>
      </div>
      <div id="onboarding-step" class="dialog-body"></div>
      <div class="dialog-footer">
        <div class="dialog-progress" id="onboarding-progress"></div>
        <div class="dialog-actions">
          <button type="button" class="btn" id="onboarding-prev">Back</button>
          <button type="button" class="btn btn-primary" id="onboarding-next">Next</button>
        </div>
      </div>
    </form>
  `;

  document.body.appendChild(dialog);
  return dialog;
}

function renderStep(dialog, steps, stepIndex) {
  const step = steps[stepIndex];
  const body = dialog.querySelector("#onboarding-step");
  const progress = dialog.querySelector("#onboarding-progress");
  const prev = dialog.querySelector("#onboarding-prev");
  const next = dialog.querySelector("#onboarding-next");

  body.innerHTML = `
    <h3 class="dialog-step-title">${step.title}</h3>
    <ul class="dialog-list">${step.body.map((line) => `<li>${line}</li>`).join("")}</ul>
  `;
  progress.textContent = `Step ${stepIndex + 1} of ${steps.length}`;
  prev.disabled = stepIndex === 0;
  next.textContent = stepIndex === steps.length - 1 ? "Done" : "Next";
}

export function openOnboarding({ steps = DEFAULT_STEPS, markComplete = true } = {}) {
  const dialog = ensureDialog();
  let stepIndex = 0;

  const prev = dialog.querySelector("#onboarding-prev");
  const next = dialog.querySelector("#onboarding-next");

  const advance = (delta) => {
    stepIndex = Math.min(steps.length - 1, Math.max(0, stepIndex + delta));
    renderStep(dialog, steps, stepIndex);
  };

  const onPrev = () => advance(-1);
  const onNext = () => {
    if (stepIndex >= steps.length - 1) {
      if (markComplete) {
        try {
          localStorage.setItem(STORAGE_KEY, "true");
        } catch {
          // ignore storage issues
        }
      }
      dialog.close();
      return;
    }
    advance(1);
  };

  prev.addEventListener("click", onPrev);
  next.addEventListener("click", onNext);

  dialog.addEventListener(
    "close",
    () => {
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
    },
    { once: true }
  );

  renderStep(dialog, steps, stepIndex);
  dialog.showModal();
}

export function shouldAutoOpenOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "true";
  } catch {
    return true;
  }
}

