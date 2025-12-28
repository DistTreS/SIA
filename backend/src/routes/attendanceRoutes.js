import { Router } from "express";
import {
  inputSession,
  recapClass,
  recapStudent,
  todayScheduleHandler,
} from "../controllers/attendanceController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/sessions", authorize("attendance.input"), inputSession);
router.get("/today", authorize("attendance.read"), todayScheduleHandler);
router.get("/recap/class/:classId", authorize("attendance.read"), recapClass);
router.get("/recap/student/:studentId", authorize("attendance.read"), recapStudent);

export default router;
