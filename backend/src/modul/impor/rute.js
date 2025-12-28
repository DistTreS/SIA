import { Router } from "express";
import multer from "multer";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";
import { imporTendikHandler, imporSiswaHandler } from "./pengendali.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(otentikasi);

router.post("/tendik", otorisasi("data-master.tulis"), upload.single("file"), imporTendikHandler);
router.post("/siswa", otorisasi("data-master.tulis"), upload.single("file"), imporSiswaHandler);

export default router;
