import {
  daftarDataMaster,
  ambilDataMaster,
  buatDataMaster,
  ubahDataMaster,
  hapusDataMaster,
} from "./layanan.js";
import { daftarEntitasValid } from "./repository.js";

const entitasValid = new Set(daftarEntitasValid());

function pastikanEntitas(entitas) {
  if (!entitasValid.has(entitas)) {
    const error = new Error("Entitas data master tidak valid");
    error.status = 400;
    throw error;
  }
}

export async function daftarHandler(req, res, next) {
  try {
    const { entitas } = req.params;
    pastikanEntitas(entitas);
    const filter = {
      periode_akademik_id: req.query.periode_akademik_id || null,
    };
    const data = await daftarDataMaster(entitas, filter);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function ambilHandler(req, res, next) {
  try {
    const { entitas, id } = req.params;
    pastikanEntitas(entitas);
    const entity = await ambilDataMaster(entitas, id);
    if (!entity) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json({ data: entity });
  } catch (error) {
    next(error);
  }
}

export async function buatHandler(req, res, next) {
  try {
    const { entitas } = req.params;
    pastikanEntitas(entitas);
    const entity = await buatDataMaster(entitas, req.body || {});
    res.status(201).json({ data: entity });
  } catch (error) {
    next(error);
  }
}

export async function ubahHandler(req, res, next) {
  try {
    const { entitas, id } = req.params;
    pastikanEntitas(entitas);
    const entity = await ubahDataMaster(entitas, id, req.body || {});
    if (!entity) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json({ data: entity });
  } catch (error) {
    next(error);
  }
}

export async function hapusHandler(req, res, next) {
  try {
    const { entitas, id } = req.params;
    pastikanEntitas(entitas);
    const entity = await hapusDataMaster(entitas, id);
    if (!entity) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json({ data: entity });
  } catch (error) {
    next(error);
  }
}
