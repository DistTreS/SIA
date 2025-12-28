import { Router } from "express";
import {
  inputSesi,
  rekapKelas,
  rekapSiswa,
  jadwalHariIniHandler,
} from "./pengendali.js";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";

const router = Router();

router.use(otentikasi);

router.post("/sesi", otorisasi("absensi.input"), inputSesi);
router.get("/hari-ini", otorisasi("absensi.baca"), jadwalHariIniHandler);
router.get("/rekap/kelas/:kelasId", otorisasi("absensi.baca"), rekapKelas);
router.get("/rekap/siswa/:siswaId", otorisasi("absensi.baca"), rekapSiswa);

export default router;
