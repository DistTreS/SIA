import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = Number(process.env.FRONTEND_PORT) || 5173;
const API_BASE = "http://localhost:3000";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.get("/", (_req, res) => res.redirect("/login"));

app.get("/login", (_req, res) => {
  res.render("pages/login", { title: "Masuk", apiBase: API_BASE });
});

app.get("/dashboard", (_req, res) => {
  res.render("pages/dashboard", { title: "Dashboard", apiBase: API_BASE });
});

app.use((_req, res) => {
  res.status(404).send("Halaman tidak ditemukan");
});

app.listen(PORT, () => {
  console.log(`Frontend berjalan di http://localhost:${PORT}`);
});
