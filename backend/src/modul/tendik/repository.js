import { Tendik, Pengguna, Peran } from "../../model/index.js";

const opsiRelasiAkun = {
  include: [
    {
      model: Pengguna,
      as: "pengguna",
      include: [
        {
          model: Peran,
          as: "peran",
          through: { attributes: [] },
        },
      ],
    },
  ],
};

export async function daftarTendik() {
  return Tendik.findAll(opsiRelasiAkun);
}

export async function ambilTendik(id) {
  return Tendik.findByPk(id, opsiRelasiAkun);
}

export async function buatTendik(payload) {
  return Tendik.create(payload);
}

export async function ubahTendik(id, payload) {
  const tendik = await Tendik.findByPk(id);
  if (!tendik) return null;
  return tendik.update(payload);
}

export async function nonaktifkanTendik(id) {
  const tendik = await Tendik.findByPk(id);
  if (!tendik) return null;
  await tendik.update({ aktif: false });
  return tendik;
}
