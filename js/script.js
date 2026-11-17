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

    if (!Auth.signIn(name.value)) {
      status.className = "alert alert-danger mt-3";
      status.textContent = "Failed to save sign-in.";
      return;
    }

    status.className = "alert alert-success mt-3";
    status.textContent = "You are signed in!";

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

// =================================================================
// Home page: Games News
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

(() => {
  const grid = document.getElementById("news-grid");
  if (!grid) return;

  const API_KEY = "API-KEY-HERE";
  const ENDPOINT = "https://gnews.io/api/v4/search";
  const FALLBACK_URL = "data/news-fallback.json";
  const PAGE_SIZE = 10;
  const CACHE_TTL = 10 * 60 * 1000;
  const SEARCH_DELAY = 500;

  const PLACEHOLDER_IMG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">' +
        '<rect width="100%" height="100%" fill="#2b2b2f"/>' +
        '<text x="50%" y="50%" fill="#b0b0b0" font-family="sans-serif" ' +
        'font-size="18" text-anchor="middle" dominant-baseline="middle">' +
        "No image</text></svg>",
    );

  const TOPICS = {
    all: '"video game" OR gaming OR esports OR PlayStation OR Xbox OR Nintendo OR Steam',
    pc: 'Steam OR "PC gaming" OR "Epic Games" OR "graphics card"',
    console: 'PlayStation OR PS5 OR Xbox OR "Nintendo Switch"',
    esports: 'esports OR "Counter-Strike" OR "Dota 2" OR "League of Legends"',
    industry:
      '"game developer" OR "game studio" OR "game release" OR "video game industry"',
  };

  const searchForm = document.getElementById("news-search-form");
  const searchInput = document.getElementById("news-search");
  const filtersBox = document.getElementById("news-filters");
  const refreshBtn = document.getElementById("news-refresh");
  const statusEl = document.getElementById("news-status");
  const errorBox = document.getElementById("news-error");
  const errorText = document.getElementById("news-error-text");
  const retryBtn = document.getElementById("news-retry");
  const emptyBox = document.getElementById("news-empty");
  const topList = document.getElementById("top-news-list");

  const modalEl = document.getElementById("articleModal");
  const modalTitle = document.getElementById("articleModalTitle");
  const modalImg = document.getElementById("articleModalImg");
  const modalTags = document.getElementById("articleModalTags");
  const modalBody = document.getElementById("articleModalBody");

  const state = { topic: "all", query: "" };
  let controller = null;
  let searchTimer = null;

  class ApiError extends Error {
    constructor(status) {
      super(`HTTP ${status}`);
      this.status = status;
    }
  }

  function toggle(element, show) {
    element.classList.toggle("d-none", !show);
  }

  function buildQuery() {
    const topic = TOPICS[state.topic];
    if (!state.query) return topic;
    const safe = state.query.replace(/["()]/g, " ").trim().slice(0, 50);
    return `"${safe}" AND (${topic})`;
  }

  function readCache(q) {
    try {
      const raw = sessionStorage.getItem(`gnews:${q}`);
      if (!raw) return null;
      const { t, data } = JSON.parse(raw);
      return Date.now() - t < CACHE_TTL ? data : null;
    } catch {
      return null;
    }
  }

  function writeCache(q, data) {
    try {
      sessionStorage.setItem(`gnews:${q}`, JSON.stringify({ t: Date.now(), data }));
    } catch {}
  }

  async function requestNews(params, cacheKey, { signal, force }) {
    let data = force ? null : readCache(cacheKey);
    if (data) return data;

    const qs = new URLSearchParams({ lang: "en", apikey: API_KEY, ...params });
    const res = await fetch(`${ENDPOINT}?${qs}`, { signal });
    if (!res.ok) throw new ApiError(res.status);

    data = await res.json();
    writeCache(cacheKey, data);
    return data;
  }

  function errorMessage(err) {
    if (err.status === 400) return "The news API rejected the request.";
    if (err.status === 401 || err.status === 403)
      return "The API refused the request: invalid key, daily limit reached, or this domain is not allowed.";
    if (err.status === 429)
      return "Too many requests. Wait a moment and try again.";
    if (err.status >= 500) return "The news service is temporarily unavailable.";
    return "Could not reach the news service. Check your connection.";
  }

  function showLoading() {
    toggle(errorBox, false);
    toggle(emptyBox, false);
    refreshBtn.disabled = true;
    grid.setAttribute("aria-busy", "true");
    statusEl.textContent = "Loading news…";
    grid.innerHTML = Array.from(
      { length: 4 },
      () => `
        <div class="col">
          <div class="card card-news" aria-hidden="true">
            <div class="news-skeleton-img"></div>
            <div class="card-body placeholder-glow">
              <span class="placeholder col-4 mb-2"></span>
              <span class="placeholder col-10 mb-2"></span>
              <span class="placeholder col-8"></span>
            </div>
          </div>
        </div>`,
    ).join("");
  }

  function finishLoading() {
    refreshBtn.disabled = false;
    grid.removeAttribute("aria-busy");
  }

  function showError(message) {
    finishLoading();
    grid.replaceChildren();
    toggle(emptyBox, false);
    errorText.textContent = message;
    toggle(errorBox, true);
    statusEl.textContent = "";
  }

  function showEmpty() {
    finishLoading();
    grid.replaceChildren();
    toggle(errorBox, false);
    toggle(emptyBox, true);
    statusEl.textContent = "0 articles found.";
  }

  function showArticles(articles, note) {
    finishLoading();
    toggle(errorBox, false);

    const list = articles.filter((a) => a && a.title);
    if (list.length === 0) {
      showEmpty();
      return;
    }

    toggle(emptyBox, false);
    grid.replaceChildren(...list.map(createCard));
    statusEl.textContent = note || `${list.length} articles`;
  }

  function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function createCard(article) {
    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("article");
    card.className = "card card-news news-card";

    const img = document.createElement("img");
    img.className = "card-img-top";
    img.alt = "";
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = article.image || PLACEHOLDER_IMG;
    img.addEventListener("error", () => {
      img.src = PLACEHOLDER_IMG;
    });

    const body = document.createElement("div");
    body.className = "card-body d-flex flex-column";

    const meta = document.createElement("div");
    meta.className = "mb-2 d-flex flex-wrap align-items-center gap-2";

    const source = document.createElement("span");
    source.className = "badge badge-platform";
    source.textContent = article.source?.name || "News";

    const date = document.createElement("small");
    date.className = "text-secondary";
    date.textContent = formatDate(article.publishedAt);

    meta.append(source, date);

    const title = document.createElement("h5");
    title.className = "card-title text-white";
    title.textContent = article.title;

    const text = document.createElement("p");
    text.className = "card-text text-secondary flex-grow-1";
    text.textContent = article.description || "";

    const more = document.createElement("button");
    more.type = "button";
    more.className =
      "btn btn-link text-danger fw-bold text-decoration-none p-0 align-self-start";
    more.textContent = "Read more →";

    body.append(meta, title, text, more);
    card.append(img, body);
    card.addEventListener("click", () => openArticle(article));
    col.append(card);
    return col;
  }

  function openArticle(article) {
    modalTitle.textContent = article.title;

    if (article.image) {
      modalImg.src = article.image;
      modalImg.alt = article.title;
      modalImg.classList.remove("d-none");
    } else {
      modalImg.removeAttribute("src");
      modalImg.classList.add("d-none");
    }

    modalTags.replaceChildren();
    const source = document.createElement("span");
    source.className = "badge badge-platform me-2";
    source.textContent = article.source?.name || "News";
    const date = document.createElement("small");
    date.className = "text-secondary";
    date.textContent = formatDate(article.publishedAt);
    modalTags.append(source, date);

    modalBody.replaceChildren();
    const p = document.createElement("p");
    p.textContent = article.description || "No description available.";
    modalBody.append(p);

    if (/^https?:\/\//i.test(article.url || "")) {
      const link = document.createElement("a");
      link.className = "btn btn-custom";
      link.href = article.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = "Read the full article";
      modalBody.append(link);
    }

    bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  async function loadFallback(signal, query = state.query) {
    try {
      const res = await fetch(FALLBACK_URL, { signal });
      if (!res.ok) return null;
      const data = await res.json();
      const q = query.toLowerCase();
      return (data.articles || []).filter(
        (a) =>
          !q || `${a.title} ${a.description || ""}`.toLowerCase().includes(q),
      );
    } catch {
      return null;
    }
  }

  async function loadNews({ force = false } = {}) {
    if (API_KEY.startsWith("PASTE")) {
      showError("Add your GNews API key to API_KEY in js/script.js.");
      return;
    }

    const q = buildQuery();
    if (controller) controller.abort();
    controller = new AbortController();
    const { signal } = controller;

    showLoading();

    try {
      const data = await requestNews(
        { q, max: String(PAGE_SIZE) },
        q,
        { signal, force },
      );
      showArticles(data.articles || []);
    } catch (err) {
      if (signal.aborted) return;

      const saved = await loadFallback(signal);
      if (signal.aborted) return;

      if (saved) {
        showArticles(saved, "Live news is unavailable. Showing saved articles.");
      } else {
        showError(errorMessage(err));
      }
    }
  }

  let topController = null;

  function showTopMessage(text, withRetry = false) {
    const p = document.createElement("p");
    p.className = "small text-secondary mb-0";
    p.textContent = text;
    topList.replaceChildren(p);

    if (withRetry) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-sm btn-outline-light mt-2";
      btn.textContent = "Try again";
      btn.addEventListener("click", () => loadTop({ force: true }));
      topList.append(btn);
    }
  }

  function showTopLoading() {
    topList.setAttribute("aria-busy", "true");
    topList.innerHTML = Array.from(
      { length: 5 },
      () =>
        '<div class="placeholder-glow mb-3" aria-hidden="true">' +
        '<span class="placeholder col-12"></span>' +
        '<span class="placeholder col-8"></span></div>',
    ).join("");
  }

  function renderTop(articles) {
    topList.removeAttribute("aria-busy");

    const seen = new Set();
    const items = articles
      .filter((a) => a && a.title && !seen.has(a.title) && seen.add(a.title))
      .slice(0, 5);

    if (items.length === 0) {
      showTopMessage("No top stories this week.");
      return;
    }

    topList.replaceChildren(
      ...items.map((article, index) => {
        const link = document.createElement("a");
        link.href = "#";
        link.className = "top-news-item";

        const num = document.createElement("span");
        num.className = "top-news-num";
        num.textContent = String(index + 1);

        const title = document.createElement("div");
        title.textContent = article.title;

        link.append(num, title);
        link.addEventListener("click", (event) => {
          event.preventDefault();
          openArticle(article);
        });
        return link;
      }),
    );
  }

  async function loadTop({ force = false } = {}) {
    if (API_KEY.startsWith("PASTE")) {
      showTopMessage("Add your GNews API key to load top stories.");
      return;
    }

    if (topController) topController.abort();
    topController = new AbortController();
    const { signal } = topController;

    showTopLoading();

    try {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/\.\d{3}Z$/, "Z");

      const data = await requestNews(
        { q: TOPICS.all, from, sortby: "relevance", max: "5" },
        "top:week",
        { signal, force },
      );
      renderTop(data.articles || []);
    } catch (err) {
      if (signal.aborted) return;

      const saved = await loadFallback(signal, "");
      if (signal.aborted) return;

      if (saved && saved.length) {
        renderTop(saved);
      } else {
        topList.removeAttribute("aria-busy");
        showTopMessage(errorMessage(err), true);
      }
    }
  }

  filtersBox.addEventListener("click", (event) => {
    const button = event.target.closest("[data-topic]");
    if (!button) return;

    filtersBox.querySelectorAll("[data-topic]").forEach((b) => {
      const active = b === button;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", String(active));
    });

    state.topic = button.dataset.topic;
    loadNews();
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const value = searchInput.value.trim();
      if (value === state.query) return;
      state.query = value;
      loadNews();
    }, SEARCH_DELAY);
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    clearTimeout(searchTimer);
    state.query = searchInput.value.trim();
    loadNews();
  });

  refreshBtn.addEventListener("click", () => {
    loadNews({ force: true });
    loadTop({ force: true });
  });
  retryBtn.addEventListener("click", () => loadNews({ force: true }));

  loadNews();
  loadTop();
})();