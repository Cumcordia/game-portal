(function () {
  "use strict";

  const STORAGE_KEY = "gameportal-theme";
  const DEFAULT_THEME = "dark";

  function getSavedTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") {
        return saved;
      }
    } catch (err) {
      // ignore storage errors
    }
    return DEFAULT_THEME;
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {}
  }

  function updateToggleUI(theme) {
    const isLight = theme === "light";
    const buttons = document.querySelectorAll("[data-theme-toggle]");

    buttons.forEach((btn) => {
      const icon = btn.querySelector("[data-theme-icon]");
      const label = btn.querySelector("[data-theme-label]");

      btn.setAttribute("aria-pressed", String(isLight));
      btn.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme",
      );

      if (icon) {
        icon.className = isLight ? "bi bi-moon-stars-fill" : "bi bi-sun-fill";
      }

      if (label) {
        label.textContent = isLight ? "Dark" : "Light";
      }
    });
  }

  function applyTheme(theme) {
    const validTheme = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", validTheme);
    updateToggleUI(validTheme);
    return validTheme;
  }

  // apply immediately
  applyTheme(getSavedTheme());

  document.addEventListener("DOMContentLoaded", () => {
    // sync button UI once navbar exists in the DOM
    updateToggleUI(
      document.documentElement.getAttribute("data-bs-theme") || DEFAULT_THEME,
    );

    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current =
          document.documentElement.getAttribute("data-bs-theme") ||
          DEFAULT_THEME;
        const next = current === "dark" ? "light" : "dark";
        applyTheme(next);
        saveTheme(next);
      });
    });
  });
})();
