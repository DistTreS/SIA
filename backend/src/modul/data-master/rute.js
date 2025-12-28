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

router.get("/:entitas", otorisasi("data-master.baca"), daftarHandler);
router.get("/:entitas/:id", otorisasi("data-master.baca"), ambilHandler);
router.post("/:entitas", otorisasi("data-master.tulis"), buatHandler);
router.put("/:entitas/:id", otorisasi("data-master.tulis"), ubahHandler);
router.delete("/:entitas/:id", otorisasi("data-master.tulis"), hapusHandler);

export default router;
