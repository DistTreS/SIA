import { createAuditLog, listAuditLogs } from "../repositories/auditRepository.js";

export function recordAudit(entry) {
  return createAuditLog(entry);
}

export function getAuditLogs() {
  return listAuditLogs();
}
