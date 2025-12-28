import {
  listEntities,
  getEntity,
  createEntity,
  updateEntity,
  deleteEntity,
} from "../repositories/masterDataRepository.js";

export function listMasterData(entityType) {
  return listEntities(entityType);
}

export function getMasterData(entityType, id) {
  return getEntity(entityType, id);
}

export function createMasterData(entityType, payload) {
  return createEntity(entityType, payload);
}

export function updateMasterData(entityType, id, payload) {
  return updateEntity(entityType, id, payload);
}

export function deleteMasterData(entityType, id) {
  return deleteEntity(entityType, id);
}
