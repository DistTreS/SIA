import { Router } from "express";
import {
  login,
  logout,
  resetPasswordHandler,
  listUsersHandler,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/rbacMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/logout", authenticate, logout);
router.post("/reset-password", authenticate, authorize("auth.reset"), resetPasswordHandler);
router.get("/users", authenticate, authorize("auth.read"), listUsersHandler);

export default router;
