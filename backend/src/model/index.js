import { DataTypes } from "sequelize";
import sequelize from "../konfigurasi/database.js";

export const Tendik = sequelize.define(
  "Tendik",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nip: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    nuptk: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    nama_lengkap: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true, unique: true },
    no_hp: { type: DataTypes.STRING(50), allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "tendik",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const Siswa = sequelize.define(
  "Siswa",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nis: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    nisn: { type: DataTypes.STRING(50), allowNull: true, unique: true },
    nama_lengkap: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true, unique: true },
    no_hp: { type: DataTypes.STRING(50), allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    rombongan_belajar_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "siswa",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const Pengguna = sequelize.define(
  "Pengguna",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    kata_sandi_hash: { type: DataTypes.STRING(255), allowNull: false },
    nama_lengkap: { type: DataTypes.STRING(255), allowNull: true },
    guru_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    terakhir_login: { type: DataTypes.DATE, allowNull: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "pengguna",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const Peran = sequelize.define(
  "Peran",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "peran",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: false,
  }
);

export const PenggunaPeran = sequelize.define(
  "PenggunaPeran",
  {
    pengguna_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    peran_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pengguna_peran",
    timestamps: false,
  }
);

export const PeriodeAkademik = sequelize.define(
  "PeriodeAkademik",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    tahun_ajaran: { type: DataTypes.STRING(20), allowNull: false },
    semester: { type: DataTypes.ENUM("GANJIL", "GENAP"), allowNull: false },
    tanggal_mulai: { type: DataTypes.DATEONLY, allowNull: false },
    tanggal_selesai: { type: DataTypes.DATEONLY, allowNull: false },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "periode_akademik",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const RombonganBelajar = sequelize.define(
  "RombonganBelajar",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    periode_akademik_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    kode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    nama: { type: DataTypes.STRING(255), allowNull: false },
    tingkat: { type: DataTypes.TINYINT.UNSIGNED, allowNull: true },
    jurusan: { type: DataTypes.STRING(50), allowNull: true },
    wali_kelas_guru_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "rombongan_belajar",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const MataPelajaran = sequelize.define(
  "MataPelajaran",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    kode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    nama: { type: DataTypes.STRING(255), allowNull: false },
    deskripsi: { type: DataTypes.TEXT, allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "mata_pelajaran",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const Ruang = sequelize.define(
  "Ruang",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    kode: { type: DataTypes.STRING(50), allowNull: false },
    nama: { type: DataTypes.STRING(255), allowNull: false },
    kapasitas: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    lokasi: { type: DataTypes.STRING(255), allowNull: true },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "ruang",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const JamPelajaran = sequelize.define(
  "JamPelajaran",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    kode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    urutan: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, unique: true },
    jam_mulai: { type: DataTypes.TIME, allowNull: false },
    jam_selesai: { type: DataTypes.TIME, allowNull: false },
    aktif: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    diperbarui_pada: { type: DataTypes.DATE, allowNull: false },
  },
  {
    tableName: "jam_pelajaran",
    timestamps: true,
    createdAt: "dibuat_pada",
    updatedAt: "diperbarui_pada",
  }
);

export const Hari = sequelize.define(
  "Hari",
  {
    id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true },
    nama: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  },
  {
    tableName: "hari",
    timestamps: false,
  }
);

export const PengampuMapel = sequelize.define(
  "PengampuMapel",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    periode_akademik_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    guru_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    mata_pelajaran_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    rombongan_belajar_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "pengampu_mapel",
    timestamps: false,
  }
);

export const KebutuhanJamMapel = sequelize.define(
  "KebutuhanJamMapel",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    periode_akademik_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    rombongan_belajar_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    mata_pelajaran_id: { type: DataTypes.BIGINT.UNSIGNED, allowNull: false },
    jam_per_minggu: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    dibuat_pada: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "kebutuhan_jam_mapel",
    timestamps: false,
  }
);

export const StatusKehadiran = sequelize.define(
  "StatusKehadiran",
  {
    id: { type: DataTypes.TINYINT.UNSIGNED, primaryKey: true },
    kode: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    nama: { type: DataTypes.STRING(50), allowNull: false },
    menghitung_hadir: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    tableName: "status_kehadiran",
    timestamps: false,
  }
);

Pengguna.belongsTo(Tendik, { foreignKey: "guru_id", as: "tendik" });
Tendik.hasMany(Pengguna, { foreignKey: "guru_id", as: "pengguna" });

Pengguna.belongsToMany(Peran, {
  through: PenggunaPeran,
  foreignKey: "pengguna_id",
  otherKey: "peran_id",
  as: "peran",
});
Peran.belongsToMany(Pengguna, {
  through: PenggunaPeran,
  foreignKey: "peran_id",
  otherKey: "pengguna_id",
  as: "pengguna",
});

PeriodeAkademik.hasMany(RombonganBelajar, {
  foreignKey: "periode_akademik_id",
  as: "rombongan_belajar",
});
RombonganBelajar.belongsTo(PeriodeAkademik, {
  foreignKey: "periode_akademik_id",
  as: "periode_akademik",
});

Tendik.hasMany(RombonganBelajar, {
  foreignKey: "wali_kelas_guru_id",
  as: "rombongan_wali",
});
RombonganBelajar.belongsTo(Tendik, {
  foreignKey: "wali_kelas_guru_id",
  as: "wali_kelas",
});

RombonganBelajar.hasMany(Siswa, {
  foreignKey: "rombongan_belajar_id",
  as: "siswa",
});
Siswa.belongsTo(RombonganBelajar, {
  foreignKey: "rombongan_belajar_id",
  as: "rombongan_belajar",
});

PengampuMapel.belongsTo(PeriodeAkademik, {
  foreignKey: "periode_akademik_id",
  as: "periode_akademik",
});
PengampuMapel.belongsTo(Tendik, {
  foreignKey: "guru_id",
  as: "tendik",
});
PengampuMapel.belongsTo(MataPelajaran, {
  foreignKey: "mata_pelajaran_id",
  as: "mata_pelajaran",
});
PengampuMapel.belongsTo(RombonganBelajar, {
  foreignKey: "rombongan_belajar_id",
  as: "rombongan_belajar",
});

KebutuhanJamMapel.belongsTo(PeriodeAkademik, {
  foreignKey: "periode_akademik_id",
  as: "periode_akademik",
});
KebutuhanJamMapel.belongsTo(RombonganBelajar, {
  foreignKey: "rombongan_belajar_id",
  as: "rombongan_belajar",
});
KebutuhanJamMapel.belongsTo(MataPelajaran, {
  foreignKey: "mata_pelajaran_id",
  as: "mata_pelajaran",
});

export async function inisialisasiDatabase() {
  await sequelize.authenticate();
  if (process.env.DB_SYNC === "true") {
    await sequelize.sync();
  }
}

export default sequelize;
