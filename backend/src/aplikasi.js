import express from "express";
import session from "express-session";
import ruteOtentikasi from "./modul/otentikasi/rute.js";
import ruteDataMaster from "./modul/data-master/rute.js";
import ruteAbsensi from "./modul/absensi/rute.js";
import ruteJadwal from "./modul/jadwal/rute.js";
import ruteJadwalPublik from "./modul/jadwal/rute-publik.js";
import ruteLaporan from "./modul/laporan/rute.js";
import ruteTendik from "./modul/tendik/rute.js";
import ruteImpor from "./modul/impor/rute.js";
import { tanganiError, tanganiTidakDitemukan } from "./perantara/error.js";

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});
app.use(
  session({
    secret: process.env.SESSION_SECRET || "sia-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/otentikasi", ruteOtentikasi);
app.use("/data-master", ruteDataMaster);
app.use("/absensi", ruteAbsensi);
app.use("/jadwal", ruteJadwal);
app.use("/jadwal/generate-publik", ruteJadwalPublik);
app.use("/laporan", ruteLaporan);
app.use("/tendik", ruteTendik);
app.use("/impor", ruteImpor);

app.use(tanganiTidakDitemukan);
app.use(tanganiError);

export default app;
