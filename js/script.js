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
