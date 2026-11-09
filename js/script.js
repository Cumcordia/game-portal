// =================================================================
// Abilmansur's Part
// Registration form
// =================================================================
(() => {
  const form = document.getElementById("registration-form");
  if (!form) return;

  const name = document.getElementById("reg-name");
  const email = document.getElementById("reg-email");
  const password = document.getElementById("reg-password");
  const confirmPassword = document.getElementById("reg-confirm");
  const strength = document.getElementById("password-strength");
  const status = document.getElementById("registration-status");
  const fields = [name, email, password, confirmPassword];

  function showFeedback(field, message) {
    const valid = message === "";

    field.classList.toggle("is-valid", valid);
    field.classList.toggle("is-invalid", !valid);
    field.setAttribute("aria-invalid", String(!valid));

    document.getElementById(`${field.id}-error`).textContent = message;

    return valid;
  }

  function validate(field) {
    let message = "";

    if (field.value.trim() === "") {
      message = "This field is required.";
    } else if (field === email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email.value.trim())) {
        message = "Enter a valid email, for example name@example.com.";
      }
    } else if (field === password && password.value.length < 8) {
      message = "Use at least 8 characters.";
    } else if (
      field === confirmPassword &&
      confirmPassword.value !== password.value
    ) {
      message = "Passwords do not match.";
    }

    return showFeedback(field, message);
  }

  function updateStrength() {
    const value = password.value;

    if (value === "") {
      strength.textContent = "Strength: —";
      strength.className = "small mt-2";
      return;
    }

    const variety = [
      /[a-z]/.test(value),
      /[A-Z]/.test(value),
      /[0-9]/.test(value),
      /[^a-zA-Z0-9\s]/.test(value),
    ].filter(Boolean).length;

    let label = "Weak";
    let color = "text-danger";

    if (value.length >= 12 && variety === 4) {
      label = "Strong";
      color = "text-success";
    } else if (value.length >= 8 && variety >= 2) {
      label = "Medium";
      color = "text-warning";
    }

    strength.textContent = `Strength: ${label}`;
    strength.className = `small mt-2 ${color}`;
  }

  fields.forEach((field) => {
    field.addEventListener("input", () => {
      status.textContent = "";
      status.className = "mt-3";

      validate(field);

      if (field === password) {
        updateStrength();

        if (
          confirmPassword.value !== "" ||
          confirmPassword.classList.contains("is-invalid")
        ) {
          validate(confirmPassword);
        }
      }
    });

    field.addEventListener("blur", () => validate(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const results = fields.map((field) => validate(field));

    if (!results.every(Boolean)) {
      status.className = "alert alert-danger mt-3";
      status.textContent = "Please correct the highlighted fields.";
      fields.find((field, index) => !results[index]).focus();
      return;
    }

    status.className = "alert alert-success mt-3";
    status.textContent =
      "Validation passed! This is a demo; no account was created.";

    form.reset();

    fields.forEach((field) => {
      field.classList.remove("is-valid", "is-invalid");
      field.removeAttribute("aria-invalid");
      document.getElementById(`${field.id}-error`).textContent = "";
    });

    updateStrength();
  });
})();
// Release calendar: create and read
(() => {
  const form = document.getElementById("game-form");
  if (!form) return;

  const body = document.getElementById("games-body");
  const nameInput = document.getElementById("game-name");
  const dateInput = document.getElementById("game-date");
  const platformsInput = document.getElementById("game-platforms");
  const scoreInput = document.getElementById("game-score");
  const status = document.getElementById("game-status");

  const games = [
    {
      name: "Grand Theft Auto VI",
      date: "2026-11-19",
      platforms: "PS5, Xbox",
      score: "",
    },
    {
      name: "Warhammer 40,000: Dawn of War IV",
      date: "2026-12-03",
      platforms: "PC",
      score: "",
    },
    {
      name: "Professor Layton and the New World of Steam",
      date: "2026-12-10",
      platforms: "Switch, Switch 2",
      score: "",
    },
    {
      name: "Path of Exile 2",
      date: "2026-12-11",
      platforms: "PC, PS5, Xbox",
      score: "",
    },
  ];

  function renderGames() {
    body.replaceChildren();

    games.forEach((game, index) => {
      const row = document.createElement("tr");

      const values = [
        game.name,
        game.date,
        game.platforms,
        game.score === "" ? "TBA" : game.score,
      ];

      values.forEach((value, column) => {
        const cell = document.createElement("td");
        cell.textContent = value;

        if (column === 3) {
          cell.classList.add("score");
        }

        row.append(cell);
      });

      // Action buttons will be added in the next step.

      body.append(row);
    });

    if (games.length === 0) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");

      cell.colSpan = body.closest("table").tHead.rows[0].cells.length;
      cell.textContent = "No games yet. Add your first game above.";
      cell.className = "text-center py-4";

      row.append(cell);
      body.append(row);
    }
  }

  function readGame() {
    return {
      name: nameInput.value.trim(),
      date: dateInput.value,
      platforms: platformsInput.value.trim(),
      score: scoreInput.value,
    };
  }

  [nameInput, platformsInput].forEach((input) => {
    input.addEventListener("input", () => input.setCustomValidity(""));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    [nameInput, platformsInput].forEach((input) => {
      input.setCustomValidity(
        input.value.trim() === "" ? "Please fill out this field." : "",
      );
    });

    if (!form.reportValidity()) return;

    const game = readGame();

    games.push(game);
    form.reset();

    renderGames();

    status.className = "alert alert-success mt-3";
    status.textContent = "Game added.";
  });

  renderGames();
})();

// =================================================================
// Sergey's Part
// ABOUT PAGE: Dynamic Search, department filter, animated counter
// =================================================================

$(document).ready(function () {
  initAboutSearchAndFilter();
  initStatCounters();
});

// Requirement 2.2: search and category filter
function initAboutSearchAndFilter() {
  const $searchInput = $("#team-search-input");
  const $filterButtons = $(".team-filter-btn");
  const $cards = $(".team-card-wrapper");
  const $noResults = $("#no-team-results");

  if ($searchInput.length === 0 || $cards.length === 0) return;

  let activeCategory = "all";

  function applyFilter() {
    const query = $searchInput.val().trim().toLowerCase();
    let visibleCount = 0;

    $cards.each(function () {
      const $card = $(this);
      const name = $card.find(".team-name").text().toLowerCase();
      const role = $card.find(".team-role").text().toLowerCase();
      const bio = $card.find(".team-bio").text().toLowerCase();
      const tags = $card.find(".team-tags").text().toLowerCase();
      const category = $card.attr("data-category") || "";

      const matchesSearch =
        name.includes(query) ||
        role.includes(query) ||
        bio.includes(query) ||
        tags.includes(query);

      const matchesCategory =
        activeCategory === "all" || category === activeCategory;

      if (matchesSearch && matchesCategory) {
        $card.stop(true, true).fadeIn(200);
        visibleCount++;
      } else {
        $card.stop(true, true).fadeOut(200);
      }
    });

    if (visibleCount === 0) {
      $noResults.stop(true, true).fadeIn(200);
    } else {
      $noResults.stop(true, true).hide();
    }
  }

  // Real-time dynamic search on input
  $searchInput.on("input", applyFilter);

  // Category filter button click
  $filterButtons.on("click", function () {
    $filterButtons.removeClass("active");
    $(this).addClass("active");
    activeCategory = $(this).attr("data-category") || "all";
    applyFilter();
  });
}

// Animated numbers
function initStatCounters() {
  const $counters = $(".counter-value");
  if ($counters.length === 0) return;

  $counters.each(function () {
    const $this = $(this);
    const target = parseInt($this.attr("data-target"), 10);
    const suffix = $this.attr("data-suffix") || "";

    $({ countNum: 0 }).animate(
      { countNum: target },
      {
        duration: 1500,
        easing: "swing",
        step: function () {
          $this.text(Math.floor(this.countNum) + suffix);
        },
        complete: function () {
          $this.text(this.countNum + suffix);
        },
      },
    );
  });
}

// =================================================================
