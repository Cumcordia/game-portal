const KEY = "user";

function getUser() {
  try {
    const user = JSON.parse(localStorage.getItem(KEY));
    if (user && typeof user.name === "string" && user.name.trim() !== "") {
      return user;
    }
  } catch {}
  return null;
}

function updateUI() {
  const user = getUser();

  $("[data-auth-guest]").toggleClass("d-none", user !== null);
  $("[data-auth-user]").toggleClass("d-none", user === null);
  $("[data-auth-name]").text(user ? "Hello, " + user.name + "!" : "");
}

function signIn(name) {
  name = name.trim();
  if (name === "") return false;

  try {
    localStorage.setItem(KEY, JSON.stringify({ name: name }));
  } catch {
    return false;
  }

  updateUI();
  return true;
}

function signOut() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    alert("Failed to sign out: browser storage is unavailable")
    return;
  }
  updateUI();
}

$(function () {
  $("[data-auth-logout]").on("click", signOut);
  updateUI();
});

window.Auth = { signIn: signIn };
