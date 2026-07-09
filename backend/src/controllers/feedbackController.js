import Feedback from "../models/Feedback.js";
import Settings from "../models/Settings.js";
import { setSubmissionCookie } from "../middleware/duplicateGuard.js";

// @desc  Submit feedback (public, one-time per user)
// @route POST /api/feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const { cr, rating, feedback, suggestions, improvements, generalMessage } = req.body;

    if (!cr || !["cr1", "cr2", "both"].includes(cr)) {
      return res.status(400).json({ success: false, message: "A valid CR selection is required." });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }
    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ success: false, message: "Feedback text is required." });
    }

    const doc = await Feedback.create({
      cr,
      rating,
      feedback: feedback.trim(),
      suggestions: suggestions?.trim() || "",
      improvements: improvements?.trim() || "",
      generalMessage: generalMessage?.trim() || "",
      identifierHash: req.identifierHash,
      deviceFingerprint: req.deviceFingerprint,
      userAgent: req.headers["user-agent"] || "",
    });

    const settings = (await Settings.findOne()) || (await Settings.create({}));
    const thankYouMessage =
      cr === "cr2" ? settings.thankYouMessageCr2 : settings.thankYouMessageCr1;

    setSubmissionCookie(res);

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      thankYouMessage,
      id: doc._id,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Check whether this client has already submitted (used by frontend on load)
// @route POST /api/feedback/check
export const checkSubmissionStatus = async (req, res, next) => {
  try {
    if (req.cookies?.fb_submitted) {
      return res.json({ success: true, hasSubmitted: true });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const { hashIdentifier } = await import("../middleware/duplicateGuard.js");
    const identifierHash = hashIdentifier(ip);
    const deviceFingerprint = req.body.deviceFingerprint || "unknown-device";

    const existing = await Feedback.findOne({
      $or: [{ identifierHash }, { deviceFingerprint }],
    });

    res.json({ success: true, hasSubmitted: !!existing });
  } catch (err) {
    next(err);
  }
};

// @desc  Get public settings (CR names, welcome message) for homepage
// @route GET /api/feedback/settings
export const getPublicSettings = async (req, res, next) => {
  try {
    const settings = (await Settings.findOne()) || (await Settings.create({}));
    res.json({
      success: true,
      settings: {
        cr1Name: settings.cr1Name,
        cr2Name: settings.cr2Name,
        welcomeMessage: settings.welcomeMessage,
        className: settings.className,
        termInfo: settings.termInfo,
      },
    });
  } catch (err) {
    next(err);
  }
};
