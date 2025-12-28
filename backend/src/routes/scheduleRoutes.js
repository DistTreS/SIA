import { Router } from "express";
import {
  generateHandler,
  jobStatusHandler,
  scheduleInfoHandler,
  publishHandler,
} from "../controllers/scheduleController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(authenticate);

router.post("/generate", authorize("schedule.generate"), generateHandler);
router.get("/jobs/:jobId", authorize("schedule.read"), jobStatusHandler);
router.get("/", authorize("schedule.read"), scheduleInfoHandler);
router.post("/publish", authorize("schedule.publish"), publishHandler);

export default router;
