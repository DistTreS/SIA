import "dotenv/config";
import sequelize, { Peran, inisialisasiDatabase } from "../model/index.js";

const daftarPeran = [
  { nama: "Admin", deskripsi: "Akses penuh sistem" },
  { nama: "Kepala Sekolah", deskripsi: "Pemantauan dan persetujuan kebijakan" },
  { nama: "Wakil Kepala", deskripsi: "Pendukung kebijakan dan operasional" },
  { nama: "Staff TU", deskripsi: "Administrasi akademik dan data master" },
  { nama: "Guru Mata Pelajaran", deskripsi: "Pengajar mata pelajaran" },
  { nama: "Wali Kelas", deskripsi: "Pendamping kelas dan laporan siswa" },
  { nama: "Guru BK", deskripsi: "Bimbingan konseling" },
  { nama: "Wali", deskripsi: "Pembinaan siswa secara personal" },
];

async function seedPeran() {
  await inisialisasiDatabase();

  for (const peran of daftarPeran) {
    await Peran.findOrCreate({
      where: { nama: peran.nama },
      defaults: peran,
    });
  }

  await sequelize.close();
  console.log("Seed peran selesai.");
}

seedPeran().catch((error) => {
  console.error("Gagal seed peran:", error);
  process.exit(1);
});
