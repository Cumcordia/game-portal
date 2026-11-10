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
  const formTitle = document.getElementById("game-form-title");
  const submitButton = document.getElementById("game-submit");
  const cancelButton = document.getElementById("game-cancel");

  let editingIndex = null;

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

      const actions = document.createElement("td");
      const buttons = document.createElement("div");
      buttons.className = "d-flex gap-2";

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-sm btn-outline-light";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit ${game.name}`);
      editButton.addEventListener("click", () => startEditing(index));

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-sm btn-outline-danger";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${game.name}`);
      deleteButton.addEventListener("click", () => deleteGame(index));

      buttons.append(editButton, deleteButton);
      actions.append(buttons);
      row.append(actions);

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
  function resetEditor() {
    editingIndex = null;
    form.reset();

    [nameInput, platformsInput].forEach((input) => {
      input.setCustomValidity("");
    });

    formTitle.textContent = "Add a game";
    submitButton.textContent = "Add game";
    cancelButton.hidden = true;
  }

  function startEditing(index) {
    const game = games[index];
    resetEditor();

    editingIndex = index;

    nameInput.value = game.name;
    dateInput.value = game.date;
    platformsInput.value = game.platforms;
    scoreInput.value = game.score;

    formTitle.textContent = "Edit game";
    submitButton.textContent = "Save changes";
    cancelButton.hidden = false;

    status.className = "mt-3";
    status.textContent = "";

    form.scrollIntoView({ block: "center" });
    nameInput.focus({ preventScroll: true });
  }

  function deleteGame(index) {
    const game = games[index];

    if (!window.confirm(`Delete "${game.name}"?`)) return;

    games.splice(index, 1);

    if (editingIndex === index) {
      resetEditor();
    } else if (editingIndex !== null && index < editingIndex) {
      editingIndex -= 1;
    }

    renderGames();

    status.className = "alert alert-success mt-3";
    status.textContent = "Game deleted.";
  }

  cancelButton.addEventListener("click", () => {
    resetEditor();
    status.className = "mt-3";
    status.textContent = "";
  });
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
    const isEditing = editingIndex !== null;

    if (isEditing) {
      games[editingIndex] = game;
    } else {
      games.push(game);
    }

    resetEditor();
    renderGames();

    status.className = "alert alert-success mt-3";
    status.textContent = isEditing ? "Game updated." : "Game added.";
  });

  renderGames();
})();

// =================================================================
// Homepage Part
// =================================================================
$(function () {
  const $modalEl = $("#articleModal");
  if ($modalEl.length === 0) return;

  const articles = {
    gta6: {
      title: "Grand Theft Auto VI",
      tags: ["Main Announcement", "PS5", "Xbox"],
      paragraphs: [
        "The long-awaited return to Vice City is almost here. The first trailer shows a sun-soaked, neon-lit map that feels bigger and more alive than anything the series has done before.",
        "Fans have already broken down the footage frame by frame: dynamic crowds, a reworked driving model and a story that follows a pair of criminals on the run.",
        "The release is scheduled for 19 November 2026 on PS5 and Xbox. A PC version has not been announced yet.",
      ],
    },
    "top-1": {
      title: "Half-Life 3 release in doubt again: rumors and facts",
      tags: ["Top 5 of the week", "PC"],
      paragraphs: [
        "Another wave of leaks has revived talk about Half-Life 3, but there is still no official confirmation from Valve.",
        "We separate what is known from what is pure speculation: job listings, datamined files and community theories.",
      ],
    },
    "top-2": {
      title: "The Best Graphics Cards for 4K Gaming in 2026",
      tags: ["Top 5 of the week", "Hardware"],
      paragraphs: [
        "Playing at 4K with high settings still demands a powerful GPU. We compared the current lineup by performance, power draw and price.",
        "Our pick depends on your budget: a high-end card for maximum settings and ray tracing, or a mid-range model with upscaling for a smooth 60 FPS.",
      ],
    },
    "top-3": {
      title: "Steam Deck 2 Review: Is It Worth Buying?",
      tags: ["Top 5 of the week", "Handheld"],
      paragraphs: [
        "The new handheld brings a faster chip, a better screen and longer battery life. But is the upgrade worth it for owners of the first model?",
        "In this review we look at performance in demanding games, build quality, heat and noise, and who should wait for a discount.",
      ],
    },
    "top-4": {
      title: "10 Hidden Details in the Elden Ring DLC Trailer",
      tags: ["Top 5 of the week", "PC", "PS5", "Xbox"],
      paragraphs: [
        "The trailer is packed with references: familiar armor sets, a mysterious silhouette in the background and new enemy designs.",
        "We went through it shot by shot and collected ten details that hint at the story and the new region.",
      ],
    },
    "top-5": {
      title: "Results of sales at specialized stores",
      tags: ["Top 5 of the week", "Sales"],
      paragraphs: [
        "Seasonal sales ended with record numbers for several digital stores. Indie hits and older AAA games performed best.",
        "Here is a short summary of the best-selling titles and the biggest discounts of the week.",
      ],
    },
    "news-1": {
      title: "The Witcher 4 Update",
      tags: ["PC", "PS5"],
      paragraphs: [
        "The developers have shared new details about the Unreal Engine 5 game engine that powers the next chapter of the saga.",
        "According to the team, the new technology allows for denser cities, more detailed characters and seamless transitions between locations.",
      ],
    },
    "news-2": {
      title: "S.T.A.L.K.E.R. 2 Update",
      tags: ["Xbox", "PC"],
      paragraphs: [
        "A major patch has been released, fixing optimization issues and improving AI behavior in the Zone.",
        "Players should notice more stable frame rates, fewer crashes and smarter enemy tactics during firefights.",
      ],
    },
    "news-3": {
      title: "Announcement of a new exclusive",
      tags: ["PS5"],
      paragraphs: [
        "Naughty Dog has unveiled a new sci-fi project. The teaser shows a lone traveler on an abandoned station.",
        "The studio promises a story-driven adventure, but the release window and gameplay details are still under wraps.",
      ],
    },
    "news-4": {
      title: "Cyberpunk 2077 Sequel",
      tags: ["PC", "PS5", "Xbox"],
      paragraphs: [
        "Project Orion enters the active development stage in Boston, with a growing team working on the next Night City story.",
        "The studio says it wants to build on the lessons of the first game and deliver a more polished launch.",
      ],
    },
  };

  const modal = bootstrap.Modal.getOrCreateInstance($modalEl[0]);
  const $title = $("#articleModalTitle");
  const $img = $("#articleModalImg");
  const $tags = $("#articleModalTags");
  const $body = $("#articleModalBody");

  function openArticle(id, $source) {
    const article = articles[id];
    if (!article) return;

    $title.text(article.title);

    const $srcImg = $source.find("img").first();
    if ($srcImg.length) {
      $img.attr({ src: $srcImg.attr("src"), alt: $srcImg.attr("alt") });
      $img.removeClass("d-none");
    } else {
      $img.removeAttr("src").addClass("d-none");
    }

    $tags.empty();
    article.tags.forEach(function (tag) {
      $("<span>", { class: "badge badge-platform me-1", text: tag }).appendTo(
        $tags,
      );
    });

    $body.empty();
    article.paragraphs.forEach(function (text) {
      $("<p>").text(text).appendTo($body);
    });

    modal.show();
  }

  $("[data-article]")
    .css("cursor", "pointer")
    .on("click", function (e) {
      e.preventDefault();
      openArticle($(this).attr("data-article"), $(this));
    });
});

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
// Gallery part
// =================================================================

$(function () {
  const $items = $(".gallery-item");
  const $lightbox = $("#lightbox");
  const $img = $("#lightbox-img");
  const $title = $("#lightbox-title");
  const $counter = $("#lightbox-counter");
  const total = $items.length;
  const FADE = 300;
  const SWAP = 200;
  let current = 0;
  let busy = false;

  function dataFor(index) {
    const $it = $items.eq(index);
    return {
      src: $it.find("img").attr("src"),
      alt: $it.find("img").attr("alt"),
      title: $it.find("figcaption").text(),
    };
  }

  function render(index) {
    const d = dataFor(index);
    $img.attr({ src: d.src, alt: d.alt });
    $title.text(d.title);
    $counter.text(index + 1 + " / " + total);
  }

  function open(index) {
    current = index;
    render(current);
    $img.css("opacity", 1);
    $("body").css("overflow", "hidden");
    $lightbox.stop(true, true).fadeIn(FADE);
    $lightbox.find(".lightbox-close").trigger("focus");
  }

  function close() {
    $lightbox.stop(true, true).fadeOut(FADE, function () {
      $("body").css("overflow", "");
      $items.eq(current).trigger("focus");
    });
  }

  function go(step) {
    if (busy) return;
    busy = true;
    current = (current + step + total) % total;
    const d = dataFor(current);

    $img.stop(true).animate({ opacity: 0 }, SWAP, function () {
      $img.off("load.lb").one("load.lb", function () {
        $title.text(d.title);
        $counter.text(current + 1 + " / " + total);
        $img.animate({ opacity: 1 }, SWAP, function () {
          busy = false;
        });
      });
      $img.attr({ src: d.src, alt: d.alt });
    });
  }

  $items.on("click", function () {
    open($items.index(this));
  });
  $items.on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open($items.index(this));
    }
  });

  $(".lightbox-prev").on("click", function (e) {
    e.stopPropagation();
    go(-1);
  });
  $(".lightbox-next").on("click", function (e) {
    e.stopPropagation();
    go(1);
  });
  $(".lightbox-close").on("click", close);

  $(".lightbox-inner").on("click", function (e) {
    if (e.target === this) close();
  });

  $(document).on("keydown", function (e) {
    if (!$lightbox.is(":visible")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
  });

  let startX = null;
  $lightbox.on("touchstart", function (e) {
    startX = e.originalEvent.touches[0].clientX;
  });
  $lightbox.on("touchend", function (e) {
    if (startX === null) return;
    const dx = e.originalEvent.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    startX = null;
  });
});
