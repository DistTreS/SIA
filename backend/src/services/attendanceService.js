import {
  createAttendanceSession,
  listByClassId,
  listByStudentId,
} from "../repositories/attendanceRepository.js";
import { getSchedule } from "../repositories/scheduleRepository.js";
import { recordAudit } from "./auditService.js";

export function inputAttendanceSession({ classId, slotId, date, records, user }) {
  const schedule = getSchedule();
  if (!schedule.published) {
    const error = new Error("Schedule not published");
    error.status = 400;
    throw error;
  }

  const session = createAttendanceSession({
    classId,
    slotId,
    date,
    records,
    createdBy: user.id,
  });

  recordAudit({
    action: "attendance.input",
    actorId: user.id,
    metadata: { attendanceId: session.id, classId },
  });

  return session;
}

export function recapByClass(classId) {
  return listByClassId(classId);
}

export function recapByStudent(studentId) {
  return listByStudentId(studentId);
}
