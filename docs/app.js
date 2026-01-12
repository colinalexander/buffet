import { initViewer } from "./js/viewer.js";

const STORAGE_KEY = "mandateos.viewer.showAllEmissions";

const toggle = document.getElementById("toggle-emissions");
let showAllEmissions = false;
try {
  showAllEmissions = window.localStorage.getItem(STORAGE_KEY) === "1";
} catch {
  showAllEmissions = false;
}

if (toggle) {
  toggle.checked = showAllEmissions;
  toggle.addEventListener("change", () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, toggle.checked ? "1" : "0");
    } catch {
      // ignore
    }
    window.location.reload();
  });
}

initViewer({ showAllEmissions });
