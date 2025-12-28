import {
  daftarTendik as daftarTendikRepo,
  ambilTendik as ambilTendikRepo,
  buatTendik,
  ubahTendik,
  nonaktifkanTendik,
} from "./repository.js";
import {
  buatPenggunaBaru,
  ubahPengguna,
  nonaktifkanPenggunaId,
} from "../otentikasi/layanan.js";
import { cariPenggunaDenganTendikId } from "../otentikasi/repository.js";
import { Peran } from "../../model/index.js";

const fieldIdentitasAkun = ["username", "email", "peran", "password", "kataSandi"];
const fieldUpdateAkun = [...fieldIdentitasAkun, "aktif", "nama_lengkap"];

function nilaiTerisi(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value !== undefined && value !== null && value !== "";
}

function punyaIdentitasAkun(akun) {
  return fieldIdentitasAkun.some((key) => nilaiTerisi(akun[key]));
}

function punyaUpdateAkun(akun) {
  return fieldUpdateAkun.some((key) => Object.prototype.hasOwnProperty.call(akun, key));
}

function formatTendikRow(row) {
  if (!row) return null;
  const data = row.toJSON();
  const akun = Array.isArray(data.pengguna) ? data.pengguna[0] : data.pengguna;
  const peran = (akun?.peran || []).map((item) => item.nama);
  return {
    id: data.id,
    nip: data.nip,
    nuptk: data.nuptk,
    nama_lengkap: data.nama_lengkap,
    email: data.email,
    no_hp: data.no_hp,
    aktif: data.aktif,
    akun_id: akun?.id ?? null,
    akun_username: akun?.username ?? null,
    akun_email: akun?.email ?? null,
    akun_peran: peran,
    akun_aktif: akun?.aktif ?? null,
  };
}

async function pastikanPeranValid(peran) {
  if (!peran) return;
  const daftarNama = Array.isArray(peran) ? peran : [peran];
  const peranList = await Peran.findAll({ where: { nama: daftarNama } });
  if (peranList.length !== daftarNama.length) {
    const error = new Error("Peran tidak ditemukan");
    error.status = 400;
    throw error;
  }
}

function siapkanPayloadAkun(akun, tendikPayload, gunakanFallback = false) {
  if (!akun) return null;
  const payload = { ...akun };
  if (gunakanFallback && !payload.email && tendikPayload?.email) {
    payload.email = tendikPayload.email;
  }
  if (gunakanFallback && !payload.nama_lengkap && tendikPayload?.nama_lengkap) {
    payload.nama_lengkap = tendikPayload.nama_lengkap;
  }
  return payload;
}

export async function daftarTendik() {
  const data = await daftarTendikRepo();
  return data.map(formatTendikRow);
}

export async function ambilTendik(id) {
  const row = await ambilTendikRepo(id);
  return formatTendikRow(row);
}

export async function buatTendikBaru(tendikPayload, akunPayload) {
  const butuhAkun = akunPayload && punyaIdentitasAkun(akunPayload);
  const payloadAkun = butuhAkun
    ? siapkanPayloadAkun(akunPayload, tendikPayload, true)
    : null;
  if (payloadAkun?.peran) {
    await pastikanPeranValid(payloadAkun.peran);
  }
  const tendik = await buatTendik(tendikPayload);

  if (butuhAkun) {
    const created = await buatPenggunaBaru({ ...payloadAkun, guru_id: tendik.id });
    if (!created) {
      const error = new Error("Data akun belum lengkap");
      error.status = 400;
      throw error;
    }
  }

  const row = await ambilTendikRepo(tendik.id);
  return formatTendikRow(row);
}

export async function ubahTendikId(id, tendikPayload, akunPayload) {
  const updatedTendik = await ubahTendik(id, tendikPayload);
  if (!updatedTendik) return null;

  if (akunPayload && punyaUpdateAkun(akunPayload)) {
    const existing = await cariPenggunaDenganTendikId(id);
    const payloadUpdate = siapkanPayloadAkun(akunPayload, tendikPayload, false);
    if (payloadUpdate.peran) {
      await pastikanPeranValid(payloadUpdate.peran);
    }
    if (existing) {
      const updated = await ubahPengguna(existing.id, payloadUpdate);
      if (!updated) {
        const error = new Error("Data akun tidak valid");
        error.status = 400;
        throw error;
      }
    } else if (punyaIdentitasAkun(akunPayload)) {
      const payloadBaru = siapkanPayloadAkun(akunPayload, tendikPayload, true);
      if (payloadBaru.peran) {
        await pastikanPeranValid(payloadBaru.peran);
      }
      const created = await buatPenggunaBaru({ ...payloadBaru, guru_id: id });
      if (!created) {
        const error = new Error("Data akun belum lengkap");
        error.status = 400;
        throw error;
      }
    }
  }

  const row = await ambilTendikRepo(id);
  return formatTendikRow(row);
}

export async function nonaktifkanTendikId(id) {
  const tendik = await nonaktifkanTendik(id);
  if (!tendik) return null;
  const akun = await cariPenggunaDenganTendikId(id);
  if (akun) {
    await nonaktifkanPenggunaId(akun.id);
  }
  const row = await ambilTendikRepo(id);
  return formatTendikRow(row);
}
