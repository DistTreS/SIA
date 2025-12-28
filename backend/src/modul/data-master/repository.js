import {
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
} from "../../model/index.js";

const petaModel = {
  guru: Tendik,
  tendik: Tendik,
  siswa: Siswa,
  "rombongan-belajar": RombonganBelajar,
  kelas: RombonganBelajar,
  "mata-pelajaran": MataPelajaran,
  mapel: MataPelajaran,
  ruang: Ruang,
  "jam-pelajaran": JamPelajaran,
  hari: Hari,
  "periode-akademik": PeriodeAkademik,
  "pengampu-mapel": PengampuMapel,
  pengampu: PengampuMapel,
  "kebutuhan-jam-mapel": KebutuhanJamMapel,
  "status-kehadiran": StatusKehadiran,
};

export function daftarEntitasValid() {
  return Object.keys(petaModel);
}

export function ambilModel(entitas) {
  return petaModel[entitas] || null;
}

function buildFilter(Model, filter) {
  if (!filter || !Model) return {};
  const where = {};
  const raw = Model.rawAttributes || {};
  Object.entries(filter).forEach(([key, value]) => {
    if (raw[key] !== undefined && value !== undefined && value !== null && value !== "") {
      where[key] = value;
    }
  });
  return where;
}

export async function daftarEntitas(entitas, filter = {}) {
  const Model = ambilModel(entitas);
  if (!Model) return null;
  const where = buildFilter(Model, filter);
  return Model.findAll(Object.keys(where).length ? { where } : undefined);
}

export async function ambilEntitas(entitas, id) {
  const Model = ambilModel(entitas);
  if (!Model) return null;
  return Model.findByPk(id);
}

export async function buatEntitas(entitas, payload) {
  const Model = ambilModel(entitas);
  if (!Model) return null;
  return Model.create(payload);
}

export async function ubahEntitas(entitas, id, payload) {
  const Model = ambilModel(entitas);
  if (!Model) return null;
  const entity = await Model.findByPk(id);
  if (!entity) return null;
  return entity.update(payload);
}

export async function hapusEntitas(entitas, id) {
  const Model = ambilModel(entitas);
  if (!Model) return null;
  const entity = await Model.findByPk(id);
  if (!entity) return null;
  await entity.destroy();
  return entity;
}
