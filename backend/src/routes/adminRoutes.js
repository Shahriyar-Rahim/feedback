import express from "express";
import {
  loginAdmin,
  logoutAdmin,
  getAllFeedback,
  getSettings,
  updateSettings,
  exportFeedbackPDF,
  getStats,
  getRatingTrend,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/auth.js";
import { strictLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/login", strictLimiter, loginAdmin);
router.post("/logout", protectAdmin, logoutAdmin);

router.get("/feedback", protectAdmin, getAllFeedback);
router.get("/stats", protectAdmin, getStats);
router.get("/stats/trend", protectAdmin, getRatingTrend);
router.get("/export/pdf", protectAdmin, exportFeedbackPDF);

router.get("/settings", protectAdmin, getSettings);
router.put("/settings", protectAdmin, updateSettings);

export default router;
