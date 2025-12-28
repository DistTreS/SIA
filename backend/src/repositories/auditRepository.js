import { randomUUID } from "crypto";

const auditLogs = [];

export function createAuditLog(entry) {
  const log = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...entry,
  };
  auditLogs.push(log);
  return log;
}

export function listAuditLogs() {
  return [...auditLogs];
}
