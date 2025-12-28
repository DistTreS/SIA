import { Router } from "express";
import {
  masuk,
  keluar,
  resetKataSandiHandler,
  daftarPenggunaHandler,
  buatPenggunaHandler,
  ubahPenggunaHandler,
  hapusPenggunaHandler,
} from "./pengendali.js";
import { otentikasi } from "../../perantara/otentikasi.js";
import { otorisasi } from "../../perantara/rbac.js";

const router = Router();

router.post("/masuk", masuk);
router.post("/keluar", otentikasi, keluar);
router.post(
  "/reset-kata-sandi",
  otentikasi,
  otorisasi("otentikasi.reset"),
  resetKataSandiHandler
);
router.get(
  "/pengguna",
  otentikasi,
  otorisasi("otentikasi.kelola"),
  daftarPenggunaHandler
);
router.post(
  "/pengguna",
  otentikasi,
  otorisasi("otentikasi.kelola"),
  buatPenggunaHandler
);
router.put(
  "/pengguna/:id",
  otentikasi,
  otorisasi("otentikasi.kelola"),
  ubahPenggunaHandler
);
router.delete(
  "/pengguna/:id",
  otentikasi,
  otorisasi("otentikasi.kelola"),
  hapusPenggunaHandler
);

export default router;
