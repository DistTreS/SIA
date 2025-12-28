import { Op } from "sequelize";
import xlsx from "xlsx";
import { Tendik, Siswa } from "../../model/index.js";
import { buatTendikBaru } from "../tendik/layanan.js";

const kolomTendik = {
  nip: ["nip"],
  nuptk: ["nuptk"],
  nama_lengkap: ["namalengkap", "nama", "nama_lengkap"],
  email: ["email"],
  no_hp: ["nohp", "no_hp", "telepon", "hp", "handphone"],
  aktif: ["aktif", "status"],
  akun_username: ["username", "akunusername", "user"],
  akun_email: ["emailakun", "akunemail", "email_user"],
  akun_peran: ["peran", "akunperan", "role"],
  akun_password: ["password", "kata_sandi", "katasandi", "pass"],
  akun_aktif: ["aktifakun", "akunaktif"],
};

const kolomSiswa = {
  nis: ["nis"],
  nisn: ["nisn"],
  nama_lengkap: ["namalengkap", "nama", "nama_lengkap"],
  email: ["email"],
  no_hp: ["nohp", "no_hp", "telepon", "hp", "handphone"],
  rombongan_belajar_id: ["rombonganbelajarid", "rombel_id", "rombongan_belajar_id"],
  aktif: ["aktif", "status"],
};

function normalisasiKolom(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function bacaSheet(buffer) {
  const workbook = xlsx.read(buffer, { type: "buffer" });
  const sheetName = workbook.SheetNames?.[0];
  if (!sheetName) return [];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];
  return xlsx.utils.sheet_to_json(sheet, { defval: "", raw: false });
}

function normalisasiRow(row) {
  const normalized = {};
  Object.entries(row || {}).forEach(([key, value]) => {
    normalized[normalisasiKolom(key)] = value;
  });
  return normalized;
}

function ambilNilai(row, daftarKolom) {
  const normalized = normalisasiRow(row);
  for (const key of daftarKolom) {
    if (Object.prototype.hasOwnProperty.call(normalized, key)) {
      return normalized[key];
    }
  }
  return undefined;
}

function parseBoolean(value, defaultValue = null) {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }
  if (typeof value === "boolean") return value;
  const lowered = String(value).trim().toLowerCase();
  if (["1", "true", "ya", "y", "aktif"].includes(lowered)) return true;
  if (["0", "false", "tidak", "t", "nonaktif"].includes(lowered)) return false;
  return defaultValue;
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parsePeran(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return String(value)
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseString(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text === "" ? null : text;
}

async function cariTendikDuplikat(payload) {
  const conditions = [];
  if (payload.nip) conditions.push({ nip: payload.nip });
  if (payload.nuptk) conditions.push({ nuptk: payload.nuptk });
  if (payload.email) conditions.push({ email: payload.email });
  if (!conditions.length) return null;
  return Tendik.findOne({ where: { [Op.or]: conditions } });
}

async function cariSiswaDuplikat(payload) {
  const conditions = [];
  if (payload.nis) conditions.push({ nis: payload.nis });
  if (payload.nisn) conditions.push({ nisn: payload.nisn });
  if (!conditions.length) return null;
  return Siswa.findOne({ where: { [Op.or]: conditions } });
}

function hasilAwal(total) {
  return {
    total,
    berhasil: 0,
    gagal: 0,
    duplikat: 0,
    detail_gagal: [],
    detail_duplikat: [],
  };
}

export async function imporTendik(buffer) {
  const rows = bacaSheet(buffer);
  const hasil = hasilAwal(rows.length);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const nomorBaris = index + 2;
    try {
      const data = {};
      Object.keys(kolomTendik).forEach((key) => {
        data[key] = ambilNilai(row, kolomTendik[key]);
      });

      const tendikPayload = {
        nip: parseString(data.nip),
        nuptk: parseString(data.nuptk),
        nama_lengkap: parseString(data.nama_lengkap),
        email: parseString(data.email),
        no_hp: parseString(data.no_hp),
        aktif: parseBoolean(data.aktif, true),
      };

      if (!tendikPayload.nama_lengkap) {
        hasil.gagal += 1;
        hasil.detail_gagal.push({
          baris: nomorBaris,
          alasan: "Nama lengkap wajib diisi.",
        });
        continue;
      }

      const duplikat = await cariTendikDuplikat(tendikPayload);
      if (duplikat) {
        hasil.duplikat += 1;
        hasil.detail_duplikat.push({
          baris: nomorBaris,
          alasan: "Tendik sudah terdaftar.",
        });
        continue;
      }

      const akunPayload = {
        username: parseString(data.akun_username),
        email: parseString(data.akun_email),
        peran: parsePeran(data.akun_peran),
        password: parseString(data.akun_password),
        aktif: parseBoolean(data.akun_aktif, true),
      };

      const punyaAkun =
        akunPayload.username ||
        akunPayload.email ||
        akunPayload.password ||
        (akunPayload.peran && akunPayload.peran.length);

      await buatTendikBaru(tendikPayload, punyaAkun ? akunPayload : null);
      hasil.berhasil += 1;
    } catch (error) {
      hasil.gagal += 1;
      hasil.detail_gagal.push({
        baris: nomorBaris,
        alasan: error.message || "Gagal impor data tendik.",
      });
    }
  }

  return hasil;
}

export async function imporSiswa(buffer) {
  const rows = bacaSheet(buffer);
  const hasil = hasilAwal(rows.length);

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const nomorBaris = index + 2;
    try {
      const data = {};
      Object.keys(kolomSiswa).forEach((key) => {
        data[key] = ambilNilai(row, kolomSiswa[key]);
      });

      const siswaPayload = {
        nis: parseString(data.nis),
        nisn: parseString(data.nisn),
        nama_lengkap: parseString(data.nama_lengkap),
        email: parseString(data.email),
        no_hp: parseString(data.no_hp),
        rombongan_belajar_id: parseNumber(data.rombongan_belajar_id),
        aktif: parseBoolean(data.aktif, true),
      };

      if (!siswaPayload.nama_lengkap) {
        hasil.gagal += 1;
        hasil.detail_gagal.push({
          baris: nomorBaris,
          alasan: "Nama lengkap wajib diisi.",
        });
        continue;
      }

      if (!siswaPayload.nis && !siswaPayload.nisn) {
        hasil.gagal += 1;
        hasil.detail_gagal.push({
          baris: nomorBaris,
          alasan: "NIS atau NISN wajib diisi.",
        });
        continue;
      }

      const duplikat = await cariSiswaDuplikat(siswaPayload);
      if (duplikat) {
        hasil.duplikat += 1;
        hasil.detail_duplikat.push({
          baris: nomorBaris,
          alasan: "Siswa sudah terdaftar.",
        });
        continue;
      }

      await Siswa.create(siswaPayload);
      hasil.berhasil += 1;
    } catch (error) {
      hasil.gagal += 1;
      hasil.detail_gagal.push({
        baris: nomorBaris,
        alasan: error.message || "Gagal impor data siswa.",
      });
    }
  }

  return hasil;
}
