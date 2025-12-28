import "dotenv/config";
import bcrypt from "bcryptjs";
import sequelize, {
  Pengguna,
  Peran,
  PenggunaPeran,
  inisialisasiDatabase,
} from "../model/index.js";

const DEFAULT_USERNAME = process.env.ADMIN_USERNAME || "admin";
const DEFAULT_EMAIL = process.env.ADMIN_EMAIL || "admin@sia.local";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const DEFAULT_NAMA = process.env.ADMIN_NAMA || "Administrator";

async function seedAdmin() {
  await inisialisasiDatabase();

  const peranAdmin = await Peran.findOne({ where: { nama: "Admin" } });
  if (!peranAdmin) {
    throw new Error("Peran Admin belum tersedia. Jalankan seed peran dulu.");
  }

  const kataSandiHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  const [pengguna] = await Pengguna.findOrCreate({
    where: { username: DEFAULT_USERNAME },
    defaults: {
      username: DEFAULT_USERNAME,
      email: DEFAULT_EMAIL,
      kata_sandi_hash: kataSandiHash,
      nama_lengkap: DEFAULT_NAMA,
      aktif: true,
    },
  });

  await PenggunaPeran.findOrCreate({
    where: { pengguna_id: pengguna.id, peran_id: peranAdmin.id },
    defaults: { pengguna_id: pengguna.id, peran_id: peranAdmin.id },
  });

  await sequelize.close();
  console.log("Seed admin selesai.");
}

seedAdmin().catch((error) => {
  console.error("Gagal seed admin:", error);
  process.exit(1);
});
