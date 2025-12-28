import {
  daftarTendik,
  ambilTendik,
  buatTendikBaru,
  ubahTendikId,
  nonaktifkanTendikId,
} from "./layanan.js";
import { cariPenggunaDenganTendikId } from "../otentikasi/repository.js";

function bolehKelolaAdmin(req, peranTarget) {
  const daftarPeran = Array.isArray(peranTarget)
    ? peranTarget
    : peranTarget
    ? [peranTarget]
    : [];
  if (!daftarPeran.includes("Admin")) return true;
  const peranUser = req.user?.peran;
  return Array.isArray(peranUser) ? peranUser.includes("Admin") : peranUser === "Admin";
}

function ambilPayload(req) {
  const payload = req.body || {};
  return {
    tendik: payload.tendik || {},
    akun: payload.akun || null,
  };
}

export async function daftarHandler(_req, res, next) {
  try {
    const data = await daftarTendik();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function ambilHandler(req, res, next) {
  try {
    const { id } = req.params;
    const data = await ambilTendik(id);
    if (!data) {
      return res.status(404).json({ message: "Tendik tidak ditemukan" });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function buatHandler(req, res, next) {
  try {
    const { tendik, akun } = ambilPayload(req);
    if (!tendik?.nama_lengkap) {
      return res.status(400).json({ message: "Nama lengkap wajib diisi" });
    }
    if (akun?.peran && !bolehKelolaAdmin(req, akun.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan membuat Admin" });
    }
    const data = await buatTendikBaru(tendik, akun);
    res.status(201).json({ data });
  } catch (error) {
    next(error);
  }
}

export async function ubahHandler(req, res, next) {
  try {
    const { id } = req.params;
    const { tendik, akun } = ambilPayload(req);
    const existingAkun = await cariPenggunaDenganTendikId(id);
    if (existingAkun?.peran && !bolehKelolaAdmin(req, existingAkun.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan mengubah Admin" });
    }
    if (akun?.peran && !bolehKelolaAdmin(req, akun.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan menjadikan Admin" });
    }
    const data = await ubahTendikId(id, tendik, akun);
    if (!data) {
      return res.status(404).json({ message: "Tendik tidak ditemukan" });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function hapusHandler(req, res, next) {
  try {
    const { id } = req.params;
    const existingAkun = await cariPenggunaDenganTendikId(id);
    if (existingAkun?.peran && !bolehKelolaAdmin(req, existingAkun.peran)) {
      return res
        .status(403)
        .json({ message: "Tidak diizinkan menonaktifkan Admin" });
    }
    const data = await nonaktifkanTendikId(id);
    if (!data) {
      return res.status(404).json({ message: "Tendik tidak ditemukan" });
    }
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
