# GamePortal - Gaming News and Reviews

Responsive 5-page website about gaming news, upcoming releases, reviews, screenshots and user feedback. Built with HTML5, CSS3 and Bootstrap 5.3 and extended with JavaScript and jQuery for interactivity and dynamic behavior.

**Live Website:** https://cumcordia.github.io/game-portal/

---

## Team Members

- **Member 1:** Alikhan Kassen
- **Member 2:** Abilmansur Tleubay
- **Member 3:** Sergey Kim

---

## Project Overview

GamePortal is a 5-page website built with semantic HTML5, CSS3 and Bootstrap 5.3. The site includes a home feed with top stories, a release calendar with a game table, an about page with team profiles, a screenshot gallery and a feedback/registration page.

The project was first built as a static midterm website and then extended for the endterm with client-side form validation, real-time search and filtering, a dynamic releases table, article pop-ups and an image gallery with a lightbox. The same topic, structure and repository are used throughout, and all HTML, CSS and responsiveness requirements remain intact. All JavaScript lives in `/js/script.js`.

---

## Features Implemented

**General**

- **5 Responsive Pages:** Home (`index.html`), About (`about.html`), Releases (`releases.html`), Gallery (`gallery.html`) and Contact (`contact.html`).
- **Responsive Design:** Bootstrap 5 grid + custom media queries for mobile and tablet screens.
- **Layout:** Flexbox navigation/cards, CSS Grid screenshot gallery, absolutely positioned badges.
- **Single CSS File:** External styles in `/css/style.css` using `:root` color variables.

**Home (`index.html`)**

- News feed with top stories and news cards.
- Clicking a card opens a Bootstrap modal with the full article, tags and image, filled dynamically with jQuery.

**About (`about.html`)**

- Team profile cards.
- Real-time search bar that filters cards as the user types (`.on("input")`), case-insensitive, by name, role, bio and tags.
- Category filter buttons that work together with the search bar; results update instantly with jQuery `.fadeIn()` / `.fadeOut()` and a "no results" message.
- Animated statistic counters (jQuery `.animate()`).

**Releases (`releases.html`)**

- Full CRUD functionality: dynamically display games, add new   entries, edit existing records, cancel editing, and delete games with confirmation.
- Required-field validation and score validation from 0 to 10.
- Data is stored in memory and resets on page reload.

**Gallery (`gallery.html`)**

- Screenshot grid built with HTML, CSS Grid and Bootstrap.
- jQuery lightbox that opens on click or Enter/Space, with previous/next arrows, close button, image counter and title.
- Smooth `.fadeIn()`, `.fadeOut()` and `.animate()` transitions when opening, closing and switching images.
- Keyboard (Esc, left/right arrows) and touch-swipe navigation.

**Contact (`contact.html`)**

- Feedback form with `:focus` states and validation styles.
- Registration form with client-side validation: required-field checks for name, email, password and confirmation; email format check using a Regular Expression; password strength indicator (Weak / Medium / Strong); password confirmation match.
- Real-time feedback while typing and on blur using Bootstrap `is-valid` / `is-invalid` states and error messages.
- Submission is blocked if validation fails; a Bootstrap alert explains what to fix and focus moves to the first invalid field.

---

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5.3
- JavaScript (ES6)
- jQuery
- Regular Expressions (RegEx)
- Git and GitHub Pages

---

## Member Contributions

| Member         | Responsibilities                                                                                                                                                                                                                                       |
| :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Alikhan**    | Repository setup, base templates, shared navigation and footer, global `:root` CSS variables. `index.html` (news feed, jQuery article modals) and `gallery.html` (gallery grid, lightbox with arrows and fade/animate transitions).                    |
| **Abilmansur** | `contact.html` (feedback form, registration form with RegEx email validation, password strength indicator, password confirmation, real-time feedback) and `releases.html` (table structure, `:nth-child()` styling, dynamic CRUD table with adding, editing, canceling edits, and deletion with confirmation ). |
| **Sergey**     | `about.html` (team profiles, CSS Grid layout, image positioning overlays, real-time search, category filters, animated counters) and project documentation (`README.md`).                                                                              |
