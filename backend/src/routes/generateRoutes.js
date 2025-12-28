import { Router } from "express";
import { generateHandler } from "../controllers/scheduleController.js";

const router = Router();

router.post("/", generateHandler);

export default router;
