import { daftarSesiAbsensi } from "../absensi/repository.js";
import { ambilJadwal } from "../jadwal/repository.js";

function summarizeAttendanceRecords(sessions) {
  const summary = {
    totalSessions: sessions.length,
    totalRecords: 0,
    statusCounts: {},
    byClass: {},
  };

  sessions.forEach((session) => {
    const classId = session.classId || "unknown";
    if (!summary.byClass[classId]) {
      summary.byClass[classId] = { totalSessions: 0, totalRecords: 0 };
    }
    summary.byClass[classId].totalSessions += 1;

    (session.records || []).forEach((record) => {
      summary.totalRecords += 1;
      summary.byClass[classId].totalRecords += 1;
      const status = record.status || "unknown";
      summary.statusCounts[status] = (summary.statusCounts[status] || 0) + 1;
    });
  });

  return summary;
}

export function ambilStatistikAbsensi() {
  const sessions = daftarSesiAbsensi();
  return summarizeAttendanceRecords(sessions);
}

export function ambilBebanMengajar() {
  const schedule = ambilJadwal();
  const eventsById = new Map(
    (schedule.events || []).map((event) => [event.id, event])
  );
  const loadMap = new Map();

  (schedule.data || []).forEach((assignment) => {
    const event = eventsById.get(assignment.eventId);
    if (!event) return;
    const teacherId = event.teacherId || "unknown";
    if (!loadMap.has(teacherId)) {
      loadMap.set(teacherId, {
        teacherId,
        totalSessions: 0,
        classIds: new Set(),
        eventIds: new Set(),
      });
    }
    const entry = loadMap.get(teacherId);
    entry.totalSessions += 1;
    if (event.classId) entry.classIds.add(event.classId);
    entry.eventIds.add(event.id);
  });

  return Array.from(loadMap.values()).map((entry) => ({
    teacherId: entry.teacherId,
    totalSessions: entry.totalSessions,
    classIds: Array.from(entry.classIds),
    eventIds: Array.from(entry.eventIds),
  }));
}

export function eksporAbsensiCsv() {
  const sessions = daftarSesiAbsensi();
  const header = ["sessionId", "classId", "slotId", "date", "studentId", "status"];
  const rows = [header.join(",")];

  sessions.forEach((session) => {
    (session.records || []).forEach((record) => {
      rows.push(
        [
          session.id,
          session.classId,
          session.slotId,
          session.date,
          record.studentId,
          record.status || "",
        ]
          .map((value) => `${value ?? ""}`)
          .join(",")
      );
    });
  });

  return rows.join("\n");
}
