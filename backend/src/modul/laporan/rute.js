import { Router } from "express";
import {
  statistikAbsensiHandler,
  bebanMengajarHandler,
} from "./pengendali.js";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";

const router = Router();

router.use(otentikasi);

router.get("/absensi", otorisasi("laporan.baca"), statistikAbsensiHandler);
router.get("/beban-mengajar", otorisasi("laporan.baca"), bebanMengajarHandler);

export default router;
