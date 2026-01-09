import { openOnboarding, shouldAutoOpenOnboarding } from "./wizard.js";

export function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const target = link.getAttribute("href")?.split("/").pop();
    if (target === path) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

export function wireOnboarding({ autoOpen = true } = {}) {
  const button = document.getElementById("nav-onboarding");
  if (button) {
    button.addEventListener("click", () => openOnboarding());
  }
  if (autoOpen && shouldAutoOpenOnboarding()) {
    openOnboarding();
  }
}

