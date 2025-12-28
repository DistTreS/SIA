import { Pengguna, Peran, PenggunaPeran } from "../../model/index.js";

function normalisasiPengguna(pengguna) {
  if (!pengguna) return null;
  const data = pengguna.toJSON();
  const peran = (pengguna.peran || []).map((item) => item.nama);
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    kataSandiHash: data.kata_sandi_hash,
    namaLengkap: data.nama_lengkap,
    guruId: data.guru_id,
    aktif: data.aktif,
    terakhirLogin: data.terakhir_login,
    peran,
  };
}

function opsiRelasiPeran() {
  return {
    include: [
      {
        model: Peran,
        as: "peran",
        through: { attributes: [] },
      },
    ],
  };
}

export async function cariPenggunaDenganUsername(username) {
  const pengguna = await Pengguna.findOne({
    where: { username },
    ...opsiRelasiPeran(),
  });
  return normalisasiPengguna(pengguna);
}

export async function cariPenggunaDenganTendikId(tendikId) {
  const pengguna = await Pengguna.findOne({
    where: { guru_id: tendikId },
    ...opsiRelasiPeran(),
  });
  return normalisasiPengguna(pengguna);
}

export async function ambilPenggunaById(id) {
  const pengguna = await Pengguna.findByPk(id, opsiRelasiPeran());
  return normalisasiPengguna(pengguna);
}

export async function ubahKataSandiPengguna(id, kataSandiHash) {
  const pengguna = await Pengguna.findByPk(id, opsiRelasiPeran());
  if (!pengguna) return null;
  await pengguna.update({ kata_sandi_hash: kataSandiHash });
  return normalisasiPengguna(pengguna);
}

export async function daftarPengguna() {
  const pengguna = await Pengguna.findAll(opsiRelasiPeran());
  return pengguna.map(normalisasiPengguna);
}

export async function buatPengguna(payload) {
  const pengguna = await Pengguna.create(payload);
  return normalisasiPengguna(pengguna);
}

async function ambilPeranList(namaPeran) {
  if (!namaPeran) return [];
  const daftarNama = Array.isArray(namaPeran) ? namaPeran : [namaPeran];
  return Peran.findAll({ where: { nama: daftarNama } });
}

export async function buatPenggunaDenganPeran(payload, namaPeran) {
  const peranList = await ambilPeranList(namaPeran);
  if (!peranList.length) return null;
  const pengguna = await Pengguna.create(payload);
  await PenggunaPeran.bulkCreate(
    peranList.map((peran) => ({
      pengguna_id: pengguna.id,
      peran_id: peran.id,
    }))
  );
  return ambilPenggunaById(pengguna.id);
}

export async function ubahPenggunaDenganPeran(id, payload, namaPeran) {
  const pengguna = await Pengguna.findByPk(id);
  if (!pengguna) return null;
  await pengguna.update(payload);
  if (namaPeran) {
    const peranList = await ambilPeranList(namaPeran);
    if (!peranList.length) return null;
    await PenggunaPeran.destroy({ where: { pengguna_id: id } });
    await PenggunaPeran.bulkCreate(
      peranList.map((peran) => ({
        pengguna_id: id,
        peran_id: peran.id,
      }))
    );
  }
  return ambilPenggunaById(id);
}

export async function nonaktifkanPengguna(id) {
  const pengguna = await Pengguna.findByPk(id, opsiRelasiPeran());
  if (!pengguna) return null;
  await pengguna.update({ aktif: false });
  return normalisasiPengguna(pengguna);
}
