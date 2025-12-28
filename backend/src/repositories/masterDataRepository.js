import { randomUUID } from "crypto";

const store = {
  siswa: [],
  guru: [],
  kelas: [],
  mapel: [],
  ruang: [],
  slotWaktu: [],
  pengampu: [],
};

export function listEntities(entityType) {
  return [...(store[entityType] || [])];
}

export function getEntity(entityType, id) {
  return (store[entityType] || []).find((item) => item.id === id) || null;
}

export function createEntity(entityType, payload) {
  const entity = { id: randomUUID(), ...payload };
  store[entityType].push(entity);
  return entity;
}

export function updateEntity(entityType, id, payload) {
  const items = store[entityType] || [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...payload };
  return items[index];
}

export function deleteEntity(entityType, id) {
  const items = store[entityType] || [];
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return items.splice(index, 1)[0];
}

export function getStore() {
  return store;
}
