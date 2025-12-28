import { Router } from "express";
import {
  buatJadwalHandler,
  statusJobHandler,
  infoJadwalHandler,
  publikasiHandler,
  daftarJobHandler,
} from "./pengendali.js";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";

const router = Router();

router.use(otentikasi);

router.post("/buat", otorisasi("jadwal.buat"), buatJadwalHandler);
router.get("/pekerjaan", otorisasi("jadwal.baca"), daftarJobHandler);
router.get("/pekerjaan/:jobId", otorisasi("jadwal.baca"), statusJobHandler);
router.get("/", otorisasi("jadwal.baca"), infoJadwalHandler);
router.post("/publikasi", otorisasi("jadwal.publikasi"), publikasiHandler);

export default router;
