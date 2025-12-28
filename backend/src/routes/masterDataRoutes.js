import { Router } from "express";
import {
  listHandler,
  getHandler,
  createHandler,
  updateHandler,
  deleteHandler,
} from "../controllers/masterDataController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/:entityType", authorize("master.read"), listHandler);
router.get("/:entityType/:id", authorize("master.read"), getHandler);
router.post("/:entityType", authorize("master.write"), createHandler);
router.put("/:entityType/:id", authorize("master.write"), updateHandler);
router.delete("/:entityType/:id", authorize("master.write"), deleteHandler);

export default router;
