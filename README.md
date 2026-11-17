# GamePortal - Gaming News and Reviews

Responsive 5-page website about gaming news, upcoming releases, reviews, screenshots and user feedback. Built with HTML5, CSS3 and Bootstrap 5.3, and extended with JavaScript, jQuery and a public news API.

**Live Website:** https://cumcordia.github.io/game-portal/

---

## Team Members

- **Member 1:** Alikhan Kassen
- **Member 2:** Abilmansur Tleubay
- **Member 3:** Sergey Kim

---

## Project Overview

GamePortal is a 5-page website built with semantic HTML5, CSS3 and Bootstrap 5.3. It includes a live gaming news feed, a release calendar with a game table, an about page with team profiles, a screenshot gallery and a contact/FAQ page.

The project started as a static midterm website, expanded in the endterm with validation, search, filtering, CRUD and a lightbox, and was completed for the final with a Light/Dark theme toggle, `localStorage` sign-in persistence, a jQuery FAQ and live API integration. All JavaScript files are organized in `/js/`.

---

## Features Implemented

**General**

- **5 Responsive Pages:** Home (`index.html`), About (`about.html`), Releases (`releases.html`), Gallery (`gallery.html`) and Contact (`contact.html`).
- **Responsive Design:** Bootstrap 5 grid + custom media queries for mobile and tablet screens.
- **Layout:** Flexbox navigation/cards and CSS Grid screenshot gallery.
- **Light / Dark Theme (`theme.js`):** Theme toggle in the navbar on every page, built with `:root` / `[data-bs-theme="light"]` CSS variables and saved in `localStorage` across refreshes.

**Home (`index.html`)**

- Live gaming news loaded from the GNews API via `fetch()` in JSON format, with keyword search, topic filters, refresh and error/empty-state handling.
- Top 5 sidebar and Bootstrap article modals populated dynamically with jQuery.

**About (`about.html`)**

- Team profile cards with real-time search (`.on("input")`) and category filter buttons updating with `.fadeIn()` / `.fadeOut()`.
- Animated statistic counters using jQuery `.animate()`.

**Releases (`releases.html`)**

- Full CRUD table: add, edit, cancel and delete game entries with required-field and 0–10 score validation (stored in memory for the session).

**Gallery (`gallery.html`)**

- Screenshot grid with a jQuery lightbox supporting arrows, keyboard (Esc, Left/Right), touch swipe and `.fadeIn()` / `.fadeOut()` / `.animate()` transitions.

**Contact (`contact.html`)**

- Feedback form with validation styles.
- Sign-in form with RegEx email validation, password strength indicator and confirmation match. Non-sensitive session state is saved in `localStorage` (`auth.js`) to show the user's name and a Logout button across all pages (passwords are not saved).
- 5-question FAQ section (`faq.js`) with smooth jQuery `.slideToggle()` animations and `+` / `−` indicators.

---

## Technologies Used

- HTML5 & CSS3 (CSS Variables, Flexbox, Grid)
- Bootstrap 5.3
- JavaScript (ES6), `fetch()` API & `localStorage`
- jQuery
- Regular Expressions (RegEx)
- Git & GitHub Pages

---

## Member Contributions

| Member         | Responsibilities                                                                                                                                                                                           |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alikhan**    | Base templates, global `:root` CSS, `index.html` (modals and GNews API `fetch()` integration with search, filters and error handling), `gallery.html` (lightbox) and GitHub Pages deployment verification. |
| **Abilmansur** | `contact.html` (feedback and validated sign-in form), `auth.js` (`localStorage` sign-in/logout state across all pages), `releases.html` (dynamic CRUD table) and `README.md`.                              |
| **Sergey**     | `about.html` (team profiles, search, category filters, animated counters), `theme.js` and light/dark CSS theming across all pages, `faq.js` (jQuery `.slideToggle()` FAQ) and group report.                |

---

## AI Usage Acknowledgment

AI tools were used as supporting development tools and are credited on the website and in the project report:

- **Claude:** Reviewed and debugged the public API integration.
- **ChatGPT:** Assisted with examples and debugging for `localStorage` sign-in/logout.
- **Gemini:** Assisted with debugging light/dark theme toggle.
