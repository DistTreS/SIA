-- =========================================================
-- DATABASE
-- =========================================================
CREATE DATABASE IF NOT EXISTS sia_sman
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sia_sman;

-- =========================================================
-- A. MASTER DATA SDM
-- =========================================================
CREATE TABLE tendik (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nip VARCHAR(50) NULL UNIQUE,
  nuptk VARCHAR(50) NULL UNIQUE,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL UNIQUE,
  no_hp VARCHAR(50) NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE siswa (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nis VARCHAR(50) NULL UNIQUE,
  nisn VARCHAR(50) NULL UNIQUE,
  nama_lengkap VARCHAR(255) NOT NULL,
  email VARCHAR(255) NULL UNIQUE,
  no_hp VARCHAR(50) NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- B. AUTENTIKASI + RBAC (ROLE-BASED ACCESS CONTROL)
-- =========================================================
CREATE TABLE pengguna (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  kata_sandi_hash VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(255) NULL,

  -- opsional: jika akun ini adalah tendik, bisa ditautkan
  guru_id BIGINT UNSIGNED NULL,

  aktif TINYINT(1) NOT NULL DEFAULT 1,
  terakhir_login DATETIME NULL,

  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_pengguna_username (username),
  UNIQUE KEY uq_pengguna_email (email),
  KEY idx_pengguna_tendik (guru_id),

  CONSTRAINT fk_pengguna_tendik
    FOREIGN KEY (guru_id) REFERENCES tendik(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE peran (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT NULL,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_peran_nama (nama)
) ENGINE=InnoDB;

CREATE TABLE pengguna_peran (
  pengguna_id BIGINT UNSIGNED NOT NULL,
  peran_id BIGINT UNSIGNED NOT NULL,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (pengguna_id, peran_id),
  CONSTRAINT fk_pengguna_peran_pengguna FOREIGN KEY (pengguna_id) REFERENCES pengguna(id) ON DELETE CASCADE,
  CONSTRAINT fk_pengguna_peran_peran FOREIGN KEY (peran_id) REFERENCES peran(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- C. STRUKTUR AKADEMIK (PER SEMESTER)
-- =========================================================
CREATE TABLE periode_akademik (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tahun_ajaran VARCHAR(20) NOT NULL,         -- contoh: 2025/2026
  semester ENUM('GANJIL', 'GENAP') NOT NULL,
  tanggal_mulai DATE NOT NULL,
  tanggal_selesai DATE NOT NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 0,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_periode (tahun_ajaran, semester),
  CHECK (tanggal_selesai >= tanggal_mulai)
) ENGINE=InnoDB;

CREATE TABLE rombongan_belajar (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  periode_akademik_id BIGINT UNSIGNED NOT NULL,
  kode VARCHAR(50) NOT NULL,                 -- contoh: X-IPA-1
  nama VARCHAR(255) NOT NULL,                -- contoh: X IPA 1
  tingkat TINYINT UNSIGNED NULL,             -- 10/11/12
  jurusan VARCHAR(50) NULL,                  -- IPA/IPS/Bahasa (opsional)
  wali_kelas_guru_id BIGINT UNSIGNED NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_rombel_periode_kode (periode_akademik_id, kode),
  KEY idx_rombel_periode (periode_akademik_id),
  KEY idx_rombel_wali (wali_kelas_guru_id),

  CONSTRAINT fk_rombel_periode
    FOREIGN KEY (periode_akademik_id) REFERENCES periode_akademik(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_rombel_wali
    FOREIGN KEY (wali_kelas_guru_id) REFERENCES tendik(id)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- Simple approach: siswa punya "rombongan_belajar saat ini".
-- (Kalau nanti mau histori perpindahan kelas, bisa tambah tabel riwayat.)
ALTER TABLE siswa
  ADD COLUMN rombongan_belajar_id BIGINT UNSIGNED NULL,
  ADD KEY idx_siswa_rombel (rombongan_belajar_id),
  ADD CONSTRAINT fk_siswa_rombel
    FOREIGN KEY (rombongan_belajar_id) REFERENCES rombongan_belajar(id)
    ON DELETE SET NULL;

-- =========================================================
-- D. MASTER AKADEMIK
-- =========================================================
CREATE TABLE mata_pelajaran (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(50) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  deskripsi TEXT NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_mapel_kode (kode)
) ENGINE=InnoDB;

CREATE TABLE ruang (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(50) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  kapasitas INT UNSIGNED NOT NULL DEFAULT 0,
  lokasi VARCHAR(255) NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ruang_kode (kode)
) ENGINE=InnoDB;

-- Jam pelajaran = jam ke-n (untuk semua hari)
CREATE TABLE jam_pelajaran (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  kode VARCHAR(50) NOT NULL,                 -- contoh: JP-1
  urutan TINYINT UNSIGNED NOT NULL,          -- 1,2,3,... (jam ke-)
  jam_mulai TIME NOT NULL,
  jam_selesai TIME NOT NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 1,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_jp_kode (kode),
  UNIQUE KEY uq_jp_urutan (urutan),
  CHECK (jam_selesai > jam_mulai)
) ENGINE=InnoDB;

-- Hari untuk referensi (lebih rapi daripada angka 1-7 tanpa arti)
CREATE TABLE hari (
  id TINYINT UNSIGNED PRIMARY KEY,           -- 1..7
  nama VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO hari (id, nama) VALUES
(1,'Senin'),(2,'Selasa'),(3,'Rabu'),(4,'Kamis'),(5,'Jumat'),(6,'Sabtu'),(7,'Minggu');

-- =========================================================
-- E. DATA PENGAJARAN (PENTING UNTUK SIA & NANTI SCHEDULING)
-- =========================================================
-- Pengampu = tendik mengajar mapel di rombel untuk periode tertentu
CREATE TABLE pengampu_mapel (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  periode_akademik_id BIGINT UNSIGNED NOT NULL,
  guru_id BIGINT UNSIGNED NOT NULL,
  mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
  rombongan_belajar_id BIGINT UNSIGNED NOT NULL,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_pengampu (periode_akademik_id, guru_id, mata_pelajaran_id, rombongan_belajar_id),
  KEY idx_pengampu_guru (guru_id),
  KEY idx_pengampu_rombel (rombongan_belajar_id),
  KEY idx_pengampu_mapel (mata_pelajaran_id),

  CONSTRAINT fk_pengampu_periode FOREIGN KEY (periode_akademik_id) REFERENCES periode_akademik(id) ON DELETE CASCADE,
  CONSTRAINT fk_pengampu_tendik FOREIGN KEY (guru_id) REFERENCES tendik(id) ON DELETE CASCADE,
  CONSTRAINT fk_pengampu_mapel FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  CONSTRAINT fk_pengampu_rombel FOREIGN KEY (rombongan_belajar_id) REFERENCES rombongan_belajar(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Kebutuhan jam = berapa jam/minggu mapel di rombel (untuk kurikulum & jadwal)
CREATE TABLE kebutuhan_jam_mapel (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  periode_akademik_id BIGINT UNSIGNED NOT NULL,
  rombongan_belajar_id BIGINT UNSIGNED NOT NULL,
  mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
  jam_per_minggu TINYINT UNSIGNED NOT NULL DEFAULT 0,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_kebutuhan (periode_akademik_id, rombongan_belajar_id, mata_pelajaran_id),
  KEY idx_kebutuhan_rombel (rombongan_belajar_id),
  KEY idx_kebutuhan_mapel (mata_pelajaran_id),

  CONSTRAINT fk_kebutuhan_periode FOREIGN KEY (periode_akademik_id) REFERENCES periode_akademik(id) ON DELETE CASCADE,
  CONSTRAINT fk_kebutuhan_rombel FOREIGN KEY (rombongan_belajar_id) REFERENCES rombongan_belajar(id) ON DELETE CASCADE,
  CONSTRAINT fk_kebutuhan_mapel FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =========================================================
-- F. ABSENSI DIGITAL
-- =========================================================
-- Status kehadiran fleksibel (bisa diubah tanpa ubah struktur tabel absensi)
CREATE TABLE status_kehadiran (
  id TINYINT UNSIGNED PRIMARY KEY,
  kode VARCHAR(20) NOT NULL UNIQUE,          -- HADIR/SAKIT/IZIN/ALPHA/TERLAMBAT
  nama VARCHAR(50) NOT NULL,                 -- tampilan UI
  menghitung_hadir TINYINT(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB;

INSERT INTO status_kehadiran (id, kode, nama, menghitung_hadir) VALUES
(1,'HADIR','Hadir',1),
(2,'SAKIT','Sakit',0),
(3,'IZIN','Izin',0),
(4,'ALPHA','Tanpa Keterangan',0),
(5,'TERLAMBAT','Terlambat',1);

-- Sesi absensi = satu pertemuan (rombongan + mapel + tendik + tanggal + jam)
-- Bisa jalan walau belum ada jadwal (entri_jadwal_id nanti opsional)
CREATE TABLE sesi_absensi (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  periode_akademik_id BIGINT UNSIGNED NOT NULL,
  rombongan_belajar_id BIGINT UNSIGNED NOT NULL,
  mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
  guru_id BIGINT UNSIGNED NOT NULL,

  tanggal DATE NOT NULL,
  hari_id TINYINT UNSIGNED NOT NULL,
  jam_pelajaran_id BIGINT UNSIGNED NOT NULL,

  status ENUM('TERBUKA','DITUTUP') NOT NULL DEFAULT 'TERBUKA',

  dibuat_oleh BIGINT UNSIGNED NULL,          -- user yang membuat sesi (guru/tendik)
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diperbarui_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- Cegah dobel sesi untuk rombel di jam yang sama pada tanggal yang sama
  UNIQUE KEY uq_sesi_unique (rombongan_belajar_id, tanggal, jam_pelajaran_id),

  KEY idx_sesi_tanggal (tanggal),
  KEY idx_sesi_guru (guru_id),
  KEY idx_sesi_rombel (rombongan_belajar_id),

  CONSTRAINT fk_sesi_periode FOREIGN KEY (periode_akademik_id) REFERENCES periode_akademik(id) ON DELETE CASCADE,
  CONSTRAINT fk_sesi_rombel FOREIGN KEY (rombongan_belajar_id) REFERENCES rombongan_belajar(id) ON DELETE CASCADE,
  CONSTRAINT fk_sesi_mapel FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  CONSTRAINT fk_sesi_tendik FOREIGN KEY (guru_id) REFERENCES tendik(id) ON DELETE CASCADE,
  CONSTRAINT fk_sesi_hari FOREIGN KEY (hari_id) REFERENCES hari(id) ON DELETE RESTRICT,
  CONSTRAINT fk_sesi_jp FOREIGN KEY (jam_pelajaran_id) REFERENCES jam_pelajaran(id) ON DELETE RESTRICT,
  CONSTRAINT fk_sesi_dibuat_oleh FOREIGN KEY (dibuat_oleh) REFERENCES pengguna(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Detail absensi per siswa
CREATE TABLE absensi_siswa (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  sesi_absensi_id BIGINT UNSIGNED NOT NULL,
  siswa_id BIGINT UNSIGNED NOT NULL,
  status_kehadiran_id TINYINT UNSIGNED NOT NULL,
  catatan TEXT NULL,
  dicatat_oleh BIGINT UNSIGNED NULL,
  dicatat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  UNIQUE KEY uq_absensi_sesi_siswa (sesi_absensi_id, siswa_id),
  KEY idx_absensi_siswa (siswa_id),
  KEY idx_absensi_status (status_kehadiran_id),

  CONSTRAINT fk_absensi_sesi FOREIGN KEY (sesi_absensi_id) REFERENCES sesi_absensi(id) ON DELETE CASCADE,
  CONSTRAINT fk_absensi_siswa FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
  CONSTRAINT fk_absensi_status FOREIGN KEY (status_kehadiran_id) REFERENCES status_kehadiran(id) ON DELETE RESTRICT,
  CONSTRAINT fk_absensi_dicatat_oleh FOREIGN KEY (dicatat_oleh) REFERENCES pengguna(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Audit log perubahan absensi (penting untuk akuntabilitas)
CREATE TABLE log_perubahan_absensi (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  absensi_siswa_id BIGINT UNSIGNED NOT NULL,
  diubah_oleh BIGINT UNSIGNED NULL,
  status_sebelumnya_id TINYINT UNSIGNED NULL,
  status_baru_id TINYINT UNSIGNED NOT NULL,
  alasan TEXT NULL,
  diubah_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_log_absensi (absensi_siswa_id),

  CONSTRAINT fk_log_absensi FOREIGN KEY (absensi_siswa_id) REFERENCES absensi_siswa(id) ON DELETE CASCADE,
  CONSTRAINT fk_log_diubah_oleh FOREIGN KEY (diubah_oleh) REFERENCES pengguna(id) ON DELETE SET NULL,
  CONSTRAINT fk_log_status_prev FOREIGN KEY (status_sebelumnya_id) REFERENCES status_kehadiran(id) ON DELETE SET NULL,
  CONSTRAINT fk_log_status_new FOREIGN KEY (status_baru_id) REFERENCES status_kehadiran(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =========================================================
-- G. PENJADWALAN 
-- =========================================================

CREATE TABLE versi_jadwal (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  periode_akademik_id BIGINT UNSIGNED NOT NULL,
  nama VARCHAR(150) NOT NULL,
  deskripsi TEXT NULL,
  dibuat_oleh BIGINT UNSIGNED NULL,
  aktif TINYINT(1) NOT NULL DEFAULT 0,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_versi_periode (periode_akademik_id),
  CONSTRAINT fk_versi_periode FOREIGN KEY (periode_akademik_id) REFERENCES periode_akademik(id) ON DELETE CASCADE,
  CONSTRAINT fk_versi_dibuat_oleh FOREIGN KEY (dibuat_oleh) REFERENCES pengguna(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE proses_generate_jadwal (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  versi_jadwal_id BIGINT UNSIGNED NOT NULL,
  status ENUM('ANTRI','JALAN','SELESAI','GAGAL') NOT NULL DEFAULT 'ANTRI',
  mulai_pada DATETIME NULL,
  selesai_pada DATETIME NULL,
  catatan TEXT NULL,
  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_run_versi (versi_jadwal_id),
  CONSTRAINT fk_run_versi FOREIGN KEY (versi_jadwal_id) REFERENCES versi_jadwal(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Entri jadwal = hasil final yang dipakai operasional
CREATE TABLE entri_jadwal (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  versi_jadwal_id BIGINT UNSIGNED NOT NULL,
  proses_generate_id BIGINT UNSIGNED NULL,

  rombongan_belajar_id BIGINT UNSIGNED NOT NULL,
  mata_pelajaran_id BIGINT UNSIGNED NOT NULL,
  guru_id BIGINT UNSIGNED NOT NULL,
  ruang_id BIGINT UNSIGNED NULL,

  hari_id TINYINT UNSIGNED NOT NULL,
  jam_pelajaran_id BIGINT UNSIGNED NOT NULL,

  dibuat_pada DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_jadwal_rombel (rombongan_belajar_id),
  KEY idx_jadwal_guru (guru_id),
  KEY idx_jadwal_ruang (ruang_id),
  KEY idx_jadwal_slot (hari_id, jam_pelajaran_id),

  -- constraint jadwal inti (mencegah bentrok di level DB)
  UNIQUE KEY uq_kelas_slot (versi_jadwal_id, rombongan_belajar_id, hari_id, jam_pelajaran_id),
  UNIQUE KEY uq_guru_slot (versi_jadwal_id, guru_id, hari_id, jam_pelajaran_id),
  UNIQUE KEY uq_ruang_slot (versi_jadwal_id, ruang_id, hari_id, jam_pelajaran_id),

  CONSTRAINT fk_jadwal_versi FOREIGN KEY (versi_jadwal_id) REFERENCES versi_jadwal(id) ON DELETE CASCADE,
  CONSTRAINT fk_jadwal_run FOREIGN KEY (proses_generate_id) REFERENCES proses_generate_jadwal(id) ON DELETE SET NULL,
  CONSTRAINT fk_jadwal_rombel FOREIGN KEY (rombongan_belajar_id) REFERENCES rombongan_belajar(id) ON DELETE CASCADE,
  CONSTRAINT fk_jadwal_mapel FOREIGN KEY (mata_pelajaran_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE,
  CONSTRAINT fk_jadwal_tendik FOREIGN KEY (guru_id) REFERENCES tendik(id) ON DELETE CASCADE,
  CONSTRAINT fk_jadwal_ruang FOREIGN KEY (ruang_id) REFERENCES ruang(id) ON DELETE SET NULL,
  CONSTRAINT fk_jadwal_hari FOREIGN KEY (hari_id) REFERENCES hari(id) ON DELETE RESTRICT,
  CONSTRAINT fk_jadwal_jp FOREIGN KEY (jam_pelajaran_id) REFERENCES jam_pelajaran(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- Mengaitkan sesi absensi dengan jadwal (opsional)
ALTER TABLE sesi_absensi
  ADD COLUMN entri_jadwal_id BIGINT UNSIGNED NULL,
  ADD KEY idx_sesi_entri_jadwal (entri_jadwal_id),
  ADD CONSTRAINT fk_sesi_entri_jadwal
    FOREIGN KEY (entri_jadwal_id) REFERENCES entri_jadwal(id)
    ON DELETE SET NULL;
