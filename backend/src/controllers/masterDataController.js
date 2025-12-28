import {
  listMasterData,
  getMasterData,
  createMasterData,
  updateMasterData,
  deleteMasterData,
} from "../services/masterDataService.js";

const validEntities = new Set([
  "siswa",
  "guru",
  "kelas",
  "mapel",
  "ruang",
  "slotWaktu",
  "pengampu",
]);

function ensureEntityType(entityType) {
  if (!validEntities.has(entityType)) {
    const error = new Error("Invalid master data type");
    error.status = 400;
    throw error;
  }
}

export function listHandler(req, res) {
  const { entityType } = req.params;
  ensureEntityType(entityType);
  const data = listMasterData(entityType);
  res.json({ data });
}

export function getHandler(req, res) {
  const { entityType, id } = req.params;
  ensureEntityType(entityType);
  const entity = getMasterData(entityType, id);
  if (!entity) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ data: entity });
}

export function createHandler(req, res) {
  const { entityType } = req.params;
  ensureEntityType(entityType);
  const entity = createMasterData(entityType, req.body || {});
  res.status(201).json({ data: entity });
}

export function updateHandler(req, res) {
  const { entityType, id } = req.params;
  ensureEntityType(entityType);
  const entity = updateMasterData(entityType, id, req.body || {});
  if (!entity) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ data: entity });
}

export function deleteHandler(req, res) {
  const { entityType, id } = req.params;
  ensureEntityType(entityType);
  const entity = deleteMasterData(entityType, id);
  if (!entity) {
    return res.status(404).json({ message: "Not found" });
  }
  res.json({ data: entity });
}
