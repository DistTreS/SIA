import {
  daftarEntitas,
  ambilEntitas,
  buatEntitas,
  ubahEntitas,
  hapusEntitas,
} from "./repository.js";

export async function daftarDataMaster(entitas, filter = {}) {
  return daftarEntitas(entitas, filter);
}

export async function ambilDataMaster(entitas, id) {
  return ambilEntitas(entitas, id);
}

export async function buatDataMaster(entitas, payload) {
  return buatEntitas(entitas, payload);
}

export async function ubahDataMaster(entitas, id, payload) {
  return ubahEntitas(entitas, id, payload);
}

export async function hapusDataMaster(entitas, id) {
  return hapusEntitas(entitas, id);
}
