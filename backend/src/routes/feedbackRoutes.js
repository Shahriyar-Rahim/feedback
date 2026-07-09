import express from "express";
import {
  submitFeedback,
  checkSubmissionStatus,
  getPublicSettings,
} from "../controllers/feedbackController.js";
import { preventDuplicateSubmission } from "../middleware/duplicateGuard.js";
import { strictLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/settings", getPublicSettings);
router.post("/check", checkSubmissionStatus);
router.post("/", strictLimiter, preventDuplicateSubmission, submitFeedback);

export default router;
