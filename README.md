# SIA

Sistem Informasi Akademik berbasis web untuk SMAN 1 Hiliran Gumanti, dengan
backend Express + Sequelize (MySQL), frontend terpisah, dan modul penjadwalan
otomatis CP-SAT + GA di tahap berikutnya.

## Struktur
- `backend`: API Express, Sequelize, dan modul utama SIA.
- `frontend`: server EJS + Tailwind untuk antarmuka web.
- `scheduler`: migrasi skema MySQL.

## Konfigurasi Backend
1. Salin `backend/.env.example` menjadi `backend/.env`.
2. Isi variabel `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.
3. Opsional: set `DB_SYNC=true` untuk sinkronisasi model saat development.

## Menjalankan
```
npm install
npm run dev
```

## Frontend
Jalankan server frontend:
```
npm --workspace frontend run dev
```

Jalankan build Tailwind (watch):
```
npm --workspace frontend run dev:css
```

Halaman bisa diakses di `http://localhost:5173`.

## Seed Peran
```
npm --workspace backend run seed:peran
```

## Seed Admin
```
npm --workspace backend run seed:admin
```

## Seed Data Master (contoh)
```
npm --workspace backend run seed:master
```

Variabel opsional untuk seed admin:
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Impor Excel (Tendik & Siswa)
Endpoint backend:
- `POST /impor/tendik`
- `POST /impor/siswa`

Field upload: `file` (Excel `.xlsx`/`.xls`, sheet pertama akan dibaca).

Kolom yang dikenali untuk Tendik:
- `nip`, `nuptk`, `nama_lengkap`, `email`, `no_hp`, `aktif`
- `akun_username`, `akun_email`, `akun_peran`, `akun_password`, `akun_aktif`
  - `akun_peran` bisa lebih dari satu: pisahkan dengan koma/semicolon (contoh: `Guru Mata Pelajaran, Wali Kelas`)

Kolom yang dikenali untuk Siswa:
- `nis`, `nisn`, `nama_lengkap`, `email`, `no_hp`, `rombongan_belajar_id`, `aktif`

Template Excel tersedia di frontend:
- Tendik: `frontend/public/assets/templates/template-tendik.xlsx`
- Siswa: `frontend/public/assets/templates/template-siswa.xlsx`

## Rute Utama
- `/otentikasi`
- `/data-master`
- `/absensi`
- `/jadwal`
- `/laporan`
