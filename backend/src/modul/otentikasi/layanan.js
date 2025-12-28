import bcrypt from "bcryptjs";
import {
  cariPenggunaDenganUsername,
  ubahKataSandiPengguna,
  buatPenggunaDenganPeran,
  ubahPenggunaDenganPeran,
  nonaktifkanPengguna,
} from "./repository.js";

export async function otentikasiPengguna(username, password) {
  const user = await cariPenggunaDenganUsername(username);
  if (!user) return null;
  if (user.aktif === false) return null;
  const valid = await bcrypt.compare(password, user.kataSandiHash);
  if (!valid) return null;
  return user;
}

export async function resetKataSandi(userId, newPassword) {
  const kataSandiHash = await bcrypt.hash(newPassword, 10);
  return ubahKataSandiPengguna(userId, kataSandiHash);
}

export async function buatPenggunaBaru(payload) {
  const {
    password,
    kataSandi,
    peran,
    username,
    email,
    nama_lengkap,
    guru_id,
    aktif,
  } = payload;

  const kataSandiRaw = password || kataSandi;
  const peranList = Array.isArray(peran) ? peran : peran ? [peran] : [];
  if (!kataSandiRaw || !username || !email || peranList.length === 0) {
    return null;
  }

  const kataSandiHash = await bcrypt.hash(kataSandiRaw, 10);
  return buatPenggunaDenganPeran(
    {
      username,
      email,
      kata_sandi_hash: kataSandiHash,
      nama_lengkap: nama_lengkap || null,
      guru_id: guru_id || null,
      aktif: aktif !== undefined ? aktif : true,
    },
    peranList
  );
}

export async function ubahPengguna(userId, payload) {
  const {
    password,
    kataSandi,
    peran,
    username,
    email,
    nama_lengkap,
    guru_id,
    aktif,
  } = payload;

  const updatePayload = {};
  if (username !== undefined) updatePayload.username = username;
  if (email !== undefined) updatePayload.email = email;
  if (nama_lengkap !== undefined) updatePayload.nama_lengkap = nama_lengkap;
  if (guru_id !== undefined) updatePayload.guru_id = guru_id;
  if (aktif !== undefined) updatePayload.aktif = aktif;

  const kataSandiRaw = password || kataSandi;
  if (kataSandiRaw) {
    updatePayload.kata_sandi_hash = await bcrypt.hash(kataSandiRaw, 10);
  }

  const peranList = Array.isArray(peran) ? (peran.length ? peran : null) : peran;
  return ubahPenggunaDenganPeran(userId, updatePayload, peranList);
}

export async function nonaktifkanPenggunaId(userId) {
  return nonaktifkanPengguna(userId);
}
