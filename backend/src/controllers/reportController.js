import {
  getAttendanceStatistics,
  getTeachingLoad,
  exportAttendanceCsv,
} from "../services/reportService.js";

export function attendanceStatsHandler(req, res) {
  if (req.query.format === "csv") {
    const csv = exportAttendanceCsv();
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=attendance.csv");
    return res.send(csv);
  }
  const data = getAttendanceStatistics();
  return res.json({ data });
}

export function teachingLoadHandler(_req, res) {
  const data = getTeachingLoad();
  return res.json({ data });
}
