import "dotenv/config";
import sequelize, {
  Tendik,
  Siswa,
  RombonganBelajar,
  MataPelajaran,
  Ruang,
  JamPelajaran,
  Hari,
  PeriodeAkademik,
  PengampuMapel,
  KebutuhanJamMapel,
  StatusKehadiran,
  inisialisasiDatabase,
} from "../model/index.js";

const daftarHari = [
  { id: 1, nama: "Senin" },
  { id: 2, nama: "Selasa" },
  { id: 3, nama: "Rabu" },
  { id: 4, nama: "Kamis" },
  { id: 5, nama: "Jumat" },
  { id: 6, nama: "Sabtu" },
];

const daftarStatusKehadiran = [
  { id: 1, kode: "HADIR", nama: "Hadir", menghitung_hadir: true },
  { id: 2, kode: "SAKIT", nama: "Sakit", menghitung_hadir: false },
  { id: 3, kode: "IZIN", nama: "Izin", menghitung_hadir: false },
  { id: 4, kode: "ALPHA", nama: "Tanpa Keterangan", menghitung_hadir: false },
  { id: 5, kode: "TERLAMBAT", nama: "Terlambat", menghitung_hadir: true },
];

const daftarJamPelajaran = [
  { kode: "JP-1", urutan: 1, jam_mulai: "07:30", jam_selesai: "08:10" },
  { kode: "JP-2", urutan: 2, jam_mulai: "08:10", jam_selesai: "08:50" },
  { kode: "JP-3", urutan: 3, jam_mulai: "09:00", jam_selesai: "09:40" },
  { kode: "JP-4", urutan: 4, jam_mulai: "09:40", jam_selesai: "10:20" },
  { kode: "JP-5", urutan: 5, jam_mulai: "10:30", jam_selesai: "11:10" },
  { kode: "JP-6", urutan: 6, jam_mulai: "11:10", jam_selesai: "11:50" },
];

const daftarMataPelajaran = [
  { kode: "MAT", nama: "Matematika" },
  { kode: "BIND", nama: "Bahasa Indonesia" },
  { kode: "BIG", nama: "Bahasa Inggris" },
  { kode: "BIO", nama: "Biologi" },
];

const daftarRuang = [
  { kode: "R-101", nama: "Ruang 101", kapasitas: 36 },
  { kode: "R-102", nama: "Ruang 102", kapasitas: 36 },
  { kode: "LAB-IPA", nama: "Laboratorium IPA", kapasitas: 30 },
];

const daftarGuru = [
  {
    nip: "197801012005011001",
    nuptk: "1234567890",
    nama_lengkap: "Ahmad Pratama",
    email: "ahmad.pratama@sia.local",
    no_hp: "081200000001",
  },
  {
    nip: "198202022006021002",
    nuptk: "1234567891",
    nama_lengkap: "Siti Nurhayati",
    email: "siti.nurhayati@sia.local",
    no_hp: "081200000002",
  },
  {
    nip: "198505052007031003",
    nuptk: "1234567892",
    nama_lengkap: "Rudi Hartono",
    email: "rudi.hartono@sia.local",
    no_hp: "081200000003",
  },
];

const daftarSiswa = [
  {
    nis: "20240101",
    nisn: "0040010001",
    nama_lengkap: "Rani Putri",
    email: "rani.putri@siswa.local",
    no_hp: "081300000001",
  },
  {
    nis: "20240102",
    nisn: "0040010002",
    nama_lengkap: "Dimas Saputra",
    email: "dimas.saputra@siswa.local",
    no_hp: "081300000002",
  },
  {
    nis: "20240103",
    nisn: "0040010003",
    nama_lengkap: "Nadia Kartika",
    email: "nadia.kartika@siswa.local",
    no_hp: "081300000003",
  },
  {
    nis: "20240104",
    nisn: "0040010004",
    nama_lengkap: "Fajar Nugraha",
    email: "fajar.nugraha@siswa.local",
    no_hp: "081300000004",
  },
];

async function seedMaster() {
  await inisialisasiDatabase();

  for (const hari of daftarHari) {
    await Hari.findOrCreate({ where: { id: hari.id }, defaults: hari });
  }

  for (const status of daftarStatusKehadiran) {
    await StatusKehadiran.findOrCreate({
      where: { id: status.id },
      defaults: status,
    });
  }

  for (const jam of daftarJamPelajaran) {
    await JamPelajaran.findOrCreate({
      where: { kode: jam.kode },
      defaults: jam,
    });
  }

  const periode = await PeriodeAkademik.findOrCreate({
    where: { tahun_ajaran: "2024/2025", semester: "GANJIL" },
    defaults: {
      tahun_ajaran: "2024/2025",
      semester: "GANJIL",
      tanggal_mulai: "2024-07-01",
      tanggal_selesai: "2024-12-31",
      aktif: true,
    },
  }).then(([row]) => row);

  for (const mapel of daftarMataPelajaran) {
    await MataPelajaran.findOrCreate({
      where: { kode: mapel.kode },
      defaults: mapel,
    });
  }

  for (const ruang of daftarRuang) {
    await Ruang.findOrCreate({
      where: { kode: ruang.kode },
      defaults: ruang,
    });
  }

  const tendikList = [];
  for (const guru of daftarGuru) {
    const [row] = await Tendik.findOrCreate({
      where: { nip: guru.nip },
      defaults: guru,
    });
    tendikList.push(row);
  }

  const rombelXipa1 = await RombonganBelajar.findOrCreate({
    where: { periode_akademik_id: periode.id, kode: "X-IPA-1" },
    defaults: {
      periode_akademik_id: periode.id,
      kode: "X-IPA-1",
      nama: "X IPA 1",
      tingkat: 10,
      jurusan: "IPA",
      wali_kelas_guru_id: tendikList[0]?.id || null,
    },
  }).then(([row]) => row);

  const rombelXipa2 = await RombonganBelajar.findOrCreate({
    where: { periode_akademik_id: periode.id, kode: "X-IPA-2" },
    defaults: {
      periode_akademik_id: periode.id,
      kode: "X-IPA-2",
      nama: "X IPA 2",
      tingkat: 10,
      jurusan: "IPA",
      wali_kelas_guru_id: tendikList[1]?.id || null,
    },
  }).then(([row]) => row);

  for (const siswa of daftarSiswa) {
    await Siswa.findOrCreate({
      where: { nisn: siswa.nisn },
      defaults: {
        ...siswa,
        rombongan_belajar_id: rombelXipa1.id,
      },
    });
  }

  const mapelList = await MataPelajaran.findAll();
  const mapelByKode = new Map(mapelList.map((item) => [item.kode, item]));

  const pengampuPairs = [
    { guru: tendikList[0], mapel: mapelByKode.get("MAT"), rombel: rombelXipa1 },
    { guru: tendikList[1], mapel: mapelByKode.get("BIND"), rombel: rombelXipa1 },
    { guru: tendikList[2], mapel: mapelByKode.get("BIG"), rombel: rombelXipa2 },
  ];

  for (const pair of pengampuPairs) {
    if (!pair.guru || !pair.mapel || !pair.rombel) continue;
    await PengampuMapel.findOrCreate({
      where: {
        periode_akademik_id: periode.id,
        guru_id: pair.guru.id,
        mata_pelajaran_id: pair.mapel.id,
        rombongan_belajar_id: pair.rombel.id,
      },
      defaults: {
        periode_akademik_id: periode.id,
        guru_id: pair.guru.id,
        mata_pelajaran_id: pair.mapel.id,
        rombongan_belajar_id: pair.rombel.id,
      },
    });
  }

  const kebutuhanPairs = [
    { mapel: mapelByKode.get("MAT"), rombel: rombelXipa1, jam: 4 },
    { mapel: mapelByKode.get("BIND"), rombel: rombelXipa1, jam: 4 },
    { mapel: mapelByKode.get("BIG"), rombel: rombelXipa2, jam: 3 },
  ];

  for (const pair of kebutuhanPairs) {
    if (!pair.mapel || !pair.rombel) continue;
    await KebutuhanJamMapel.findOrCreate({
      where: {
        periode_akademik_id: periode.id,
        rombongan_belajar_id: pair.rombel.id,
        mata_pelajaran_id: pair.mapel.id,
      },
      defaults: {
        periode_akademik_id: periode.id,
        rombongan_belajar_id: pair.rombel.id,
        mata_pelajaran_id: pair.mapel.id,
        jam_per_minggu: pair.jam,
      },
    });
  }

  await sequelize.close();
  console.log("Seed data master selesai.");
}

seedMaster().catch((error) => {
  console.error("Gagal seed data master:", error);
  process.exit(1);
});
