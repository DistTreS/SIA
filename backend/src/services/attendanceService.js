import {
  createAttendanceSession,
  listByClassId,
  listByStudentId,
} from "../repositories/attendanceRepository.js";
import { getSchedule } from "../repositories/scheduleRepository.js";
import { recordAudit } from "./auditService.js";

function getDayLabel(date) {
  return date.toLocaleString("en-US", { weekday: "short" });
}

function resolveDate(dateString) {
  if (!dateString) return new Date();
  const parsed = new Date(dateString);
  if (Number.isNaN(parsed.getTime())) {
    return new Date();
  }
  return parsed;
}

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

export function getTodaySchedule(dateString) {
  const schedule = getSchedule();
  if (!schedule.published) {
    const error = new Error("Schedule not published");
    error.status = 400;
    throw error;
  }

  const date = resolveDate(dateString);
  const day = getDayLabel(date);
  const slotsById = new Map(
    (schedule.slots || []).map((slot) => [slot.id, slot])
  );
  const eventsById = new Map(
    (schedule.events || []).map((event) => [event.id, event])
  );

  const todaysSlotIds = new Set(
    (schedule.slots || [])
      .filter((slot) => slot.day === day)
      .map((slot) => slot.id)
  );

  const sessions = (schedule.data || [])
    .filter((assignment) => todaysSlotIds.has(assignment.slotId))
    .map((assignment) => ({
      event: eventsById.get(assignment.eventId) || null,
      slot: slotsById.get(assignment.slotId) || null,
      eventId: assignment.eventId,
      slotId: assignment.slotId,
    }));

  return {
    date: date.toISOString().slice(0, 10),
    day,
    sessions,
  };
}
