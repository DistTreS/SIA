import { randomUUID } from "crypto";

const logAudit = [];

export function buatLogAudit(entry) {
  const log = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  logAudit.push(log);
  return log;
}

export function daftarLogAudit() {
  return [...logAudit];
}
