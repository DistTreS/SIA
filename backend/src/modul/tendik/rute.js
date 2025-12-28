import { Router } from "express";
import {
  daftarHandler,
  ambilHandler,
  buatHandler,
  ubahHandler,
  hapusHandler,
} from "./pengendali.js";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";

const router = Router();

router.use(otentikasi);

router.get("/", otorisasi("data-master.baca"), daftarHandler);
router.get("/:id", otorisasi("data-master.baca"), ambilHandler);
router.post("/", otorisasi("data-master.tulis"), buatHandler);
router.put("/:id", otorisasi("data-master.tulis"), ubahHandler);
router.delete("/:id", otorisasi("data-master.tulis"), hapusHandler);

export default router;
