import { Router } from "express";
import {
  attendanceStatsHandler,
  teachingLoadHandler,
} from "../controllers/reportController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/attendance", authorize("reports.read"), attendanceStatsHandler);
router.get("/teaching-load", authorize("reports.read"), teachingLoadHandler);

export default router;
