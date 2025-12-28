import {
  otentikasiPengguna,
  resetKataSandi,
  buatPenggunaBaru,
  ubahPengguna,
  nonaktifkanPenggunaId,
} from "./layanan.js";
import { terbitkanToken } from "../../perantara/otentikasi.js";
import { daftarPengguna, ambilPenggunaById } from "./repository.js";

function formatPengguna(user) {
  if (!user) return null;
  const peranList = Array.isArray(user.peran) ? user.peran : user.peran ? [user.peran] : [];
  return {
    id: user.id,
    username: user.username,
    email: user.email ?? null,
    nama_lengkap: user.namaLengkap ?? null,
    peran: peranList,
    aktif: user.aktif ?? true,
  };
}

function bolehKelolaAdmin(req, peranTarget) {
  const targetList = Array.isArray(peranTarget) ? peranTarget : [peranTarget];
  if (!targetList.includes("Admin")) return true;
  const peranUser = req.user?.peran;
  return Array.isArray(peranUser) ? peranUser.includes("Admin") : peranUser === "Admin";
}

export async function masuk(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username dan password wajib diisi" });
    }
    const user = await otentikasiPengguna(username, password);
    if (!user) {
      return res.status(401).json({ message: "Kredensial tidak valid" });
    }
    req.session.userId = user.id;
    const token = terbitkanToken(user);
    return res.json({
      token,
      pengguna: { id: user.id, username: user.username, peran: user.peran },
    });
  } catch (error) {
    return next(error);
  }
}

export function keluar(req, res) {
  req.session.destroy(() => {
    res.json({ message: "Berhasil keluar" });
  });
}

export async function resetKataSandiHandler(req, res, next) {
  try {
    const { newPassword, kataSandiBaru } = req.body;
    const resolvedPassword = newPassword || kataSandiBaru;
    if (!resolvedPassword) {
      return res.status(400).json({ message: "Password baru wajib diisi" });
    }
    const updated = await resetKataSandi(req.user.id, resolvedPassword);
    if (!updated) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    return res.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    return next(error);
  }
}

export async function daftarPenggunaHandler(req, res, next) {
  try {
    const users = await daftarPengguna();
    const isAdmin = Array.isArray(req.user?.peran)
      ? req.user.peran.includes("Admin")
      : req.user?.peran === "Admin";
    const data = users
      .filter((user) => isAdmin || !user.peran?.includes("Admin"))
      .map(formatPengguna);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function buatPenggunaHandler(req, res, next) {
  try {
    const payload = req.body || {};
    const kataSandi = payload.password || payload.kataSandi;
    const peranList = Array.isArray(payload.peran)
      ? payload.peran
      : payload.peran
      ? [payload.peran]
      : [];
    if (!payload.username || !payload.email || peranList.length === 0 || !kataSandi) {
      return res.status(400).json({ message: "Data pengguna belum lengkap" });
    }
    if (!bolehKelolaAdmin(req, peranList)) {
      return res.status(403).json({ message: "Tidak diizinkan membuat Admin" });
    }
    const created = await buatPenggunaBaru(payload);
    if (!created) {
      return res
        .status(400)
        .json({ message: "Peran tidak ditemukan atau data tidak valid" });
    }
    return res.status(201).json({ data: formatPengguna(created) });
  } catch (error) {
    return next(error);
  }
}

export async function ubahPenggunaHandler(req, res, next) {
  try {
    const { id } = req.params;
    const payload = req.body || {};
    const allowedKeys = [
      "username",
      "email",
      "password",
      "kataSandi",
      "peran",
      "nama_lengkap",
      "guru_id",
      "aktif",
    ];
    const hasPayload = allowedKeys.some((key) => payload[key] !== undefined);
    if (!hasPayload) {
      return res.status(400).json({ message: "Tidak ada data yang diperbarui" });
    }
    const existing = await ambilPenggunaById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    if (!bolehKelolaAdmin(req, existing.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan mengubah Admin" });
    }
    if (payload.peran && !bolehKelolaAdmin(req, payload.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan menjadikan Admin" });
    }
    const updated = await ubahPengguna(id, payload);
    if (!updated) {
      return res
        .status(400)
        .json({ message: "Peran tidak ditemukan atau data tidak valid" });
    }
    return res.json({ data: formatPengguna(updated) });
  } catch (error) {
    return next(error);
  }
}

export async function hapusPenggunaHandler(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await ambilPenggunaById(id);
    if (!existing) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    if (!bolehKelolaAdmin(req, existing.peran)) {
      return res.status(403).json({ message: "Tidak diizinkan menonaktifkan Admin" });
    }
    const updated = await nonaktifkanPenggunaId(id);
    if (!updated) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }
    return res.json({ data: formatPengguna(updated) });
  } catch (error) {
    return next(error);
  }
}
