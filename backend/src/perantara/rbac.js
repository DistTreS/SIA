const izinAdmin = new Set(["*"]);
const izinStaf = new Set([
  "otentikasi.reset",
  "otentikasi.kelola",
  "data-master.baca",
  "data-master.tulis",
  "jadwal.buat",
  "jadwal.baca",
  "jadwal.publikasi",
  "absensi.baca",
  "laporan.baca",
]);
const izinGuru = new Set([
  "otentikasi.reset",
  "absensi.input",
  "absensi.baca",
  "jadwal.baca",
]);

const izinPeran = {
  admin: izinAdmin,
  Admin: izinAdmin,
  staf: izinStaf,
  "Kepala Sekolah": izinStaf,
  "Wakil Kepala": izinStaf,
  "Staff TU": izinStaf,
  guru: izinGuru,
  "Guru Mata Pelajaran": izinGuru,
  "Wali Kelas": izinGuru,
  "Guru BK": izinGuru,
  Wali: izinGuru,
};

export function otorisasi(izinDiperlukan) {
  return (req, res, next) => {
    const peran = req.user?.peran;
    const daftarPeran = Array.isArray(peran) ? peran : peran ? [peran] : [];
    if (!daftarPeran.length) {
      return res.status(403).json({ message: "Peran pengguna tidak ditemukan" });
    }
    const izinGabungan = new Set();
    for (const namaPeran of daftarPeran) {
      const izin = izinPeran[namaPeran];
      if (!izin) continue;
      if (izin.has("*")) {
        return next();
      }
      izin.forEach((item) => izinGabungan.add(item));
    }
    if (!izinGabungan.size) {
      return res.status(403).json({ message: "Peran tidak diizinkan" });
    }
    if (!izinDiperlukan || izinGabungan.has(izinDiperlukan)) {
      return next();
    }
    return res.status(403).json({ message: "Akses ditolak" });
  };
}

export function ambilIzinPeran() {
  return izinPeran;
}
