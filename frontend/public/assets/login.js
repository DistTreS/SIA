const defaultApiBase = "http://localhost:3000";

const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const storage = {
  getToken: () => localStorage.getItem("sia_token"),
  setToken: (value) => localStorage.setItem("sia_token", value),
  clearToken: () => localStorage.removeItem("sia_token"),
  getUser: () => {
    const data = localStorage.getItem("sia_user");
    return data ? JSON.parse(data) : null;
  },
  setUser: (value) => localStorage.setItem("sia_user", JSON.stringify(value)),
  clearUser: () => localStorage.removeItem("sia_user"),
};

document.addEventListener("DOMContentLoaded", () => {
  const existingToken = storage.getToken();
  if (existingToken) {
    window.location.href = "/dashboard";
    return;
  }
  // API base dipatok ke localhost:3000
});

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";

  const apiBase = defaultApiBase;
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  try {
    const response = await fetch(`${apiBase}/otentikasi/masuk`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    if (!response.ok) {
      loginError.textContent = result?.message || "Login gagal.";
      return;
    }
    storage.setToken(result.token);
    storage.setUser(result.pengguna);
    window.location.href = "/dashboard";
  } catch (error) {
    loginError.textContent = "Tidak bisa terhubung ke server.";
  }
});
