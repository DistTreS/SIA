import { buatLogAudit, daftarLogAudit } from "./repository.js";

export function catatAudit(entry) {
  return buatLogAudit(entry);
}

export function ambilLogAudit() {
  return daftarLogAudit();
}
