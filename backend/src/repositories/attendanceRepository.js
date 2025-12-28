import { randomUUID } from "crypto";

const attendanceSessions = [];

export function createAttendanceSession(payload) {
  const session = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload,
  };
  attendanceSessions.push(session);
  return session;
}

export function listAttendanceSessions() {
  return [...attendanceSessions];
}

export function listByClassId(classId) {
  return attendanceSessions.filter((session) => session.classId === classId);
}

export function listByStudentId(studentId) {
  return attendanceSessions.filter((session) =>
    session.records.some((record) => record.studentId === studentId)
  );
}
