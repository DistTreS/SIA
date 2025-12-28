import { Router } from "express";
import { buatJadwalHandler } from "./pengendali.js";

const router = Router();

router.post("/", buatJadwalHandler);

export default router;
