import {
  buatSesiAbsensi,
  daftarByKelas,
  daftarBySiswa,
} from "./repository.js";
import { ambilJadwal } from "../jadwal/repository.js";
import { catatAudit } from "../audit/layanan.js";

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

export function inputSesiAbsensi({ classId, slotId, date, records, user }) {
  const schedule = ambilJadwal();
  if (!schedule.published) {
    const error = new Error("Jadwal belum dipublikasikan");
    error.status = 400;
    throw error;
  }

  const session = buatSesiAbsensi({
    classId,
    slotId,
    date,
    records,
    createdBy: user.id,
  });

  catatAudit({
    action: "absensi.input",
    actorId: user.id,
    metadata: { attendanceId: session.id, classId },
  });

  return session;
}

export function rekapByKelas(classId) {
  return daftarByKelas(classId);
}

export function rekapBySiswa(studentId) {
  return daftarBySiswa(studentId);
}

export function ambilJadwalHariIni(dateString) {
  const schedule = ambilJadwal();
  if (!schedule.published) {
    const error = new Error("Jadwal belum dipublikasikan");
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
