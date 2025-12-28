import {
  inputAttendanceSession,
  recapByClass,
  recapByStudent,
} from "../services/attendanceService.js";

export function inputSession(req, res, next) {
  try {
    const { classId, slotId, date, records } = req.body;
    if (!classId || !slotId || !date || !Array.isArray(records)) {
      return res.status(400).json({ message: "Invalid payload" });
    }
    const session = inputAttendanceSession({
      classId,
      slotId,
      date,
      records,
      user: req.user,
    });
    return res.status(201).json({ data: session });
  } catch (error) {
    return next(error);
  }
}

export function recapClass(req, res) {
  const { classId } = req.params;
  const data = recapByClass(classId);
  res.json({ data });
}

export function recapStudent(req, res) {
  const { studentId } = req.params;
  const data = recapByStudent(studentId);
  res.json({ data });
}
