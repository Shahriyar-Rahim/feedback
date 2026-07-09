import crypto from "crypto";
import Feedback from "../models/Feedback.js";

// We never store the raw IP address. Instead we salt + hash it together with
// the client-supplied device fingerprint, so we can detect repeat submissions
// without keeping personally identifying data at rest.
const HASH_SALT = process.env.JWT_SECRET;

export const hashIdentifier = (ip) => {
  return crypto.createHash("sha256").update(`${ip}:${HASH_SALT}`).digest("hex");
};

// Middleware: blocks a second submission using three independent signals:
//   1. An httpOnly cookie set right after a successful submission. This is
//      the strongest signal for "same browser" — it isn't readable or
//      erasable by page JS, and survives a cleared localStorage. It's only
//      defeated by manually clearing cookies or using a different browser
//      profile.
//   2. A device fingerprint computed client-side from canvas/WebGL/audio/font
//      entropy (FingerprintJS). Stable across localStorage clears since it's
//      derived from hardware/browser characteristics, not stored state.
//   3. A salted hash of the requester's IP (raw IP never stored), which
//      catches a second attempt from the same network even with a fresh
//      browser profile — at the cost of false positives on shared/campus
//      wifi, which is why it's one signal among three rather than the only
//      gate.
// None of these amounts to real identity verification — someone motivated
// enough (different device, different network, cookies blocked) can still
// get through. The only way to close that gap completely is requiring some
// form of verified identity (e.g. a one-time code sent to a university
// email), which trades away the "no login" requirement.
const SUBMISSION_COOKIE = "fb_submitted";

export const preventDuplicateSubmission = async (req, res, next) => {
  try {
    if (req.cookies?.[SUBMISSION_COOKIE]) {
      return res.status(409).json({
        success: false,
        message: "You've already submitted feedback. Only one submission is allowed per person.",
      });
    }

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown";
    const deviceFingerprint = req.body.deviceFingerprint || "unknown-device";

    const identifierHash = hashIdentifier(ip);

    const existing = await Feedback.findOne({
      $or: [{ identifierHash }, { deviceFingerprint }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You've already submitted feedback. Only one submission is allowed per person.",
      });
    }

    req.identifierHash = identifierHash;
    req.deviceFingerprint = deviceFingerprint;
    next();
  } catch (err) {
    next(err);
  }
};

// Called after a successful submission to set the httpOnly marker cookie.
export const setSubmissionCookie = (res) => {
  res.cookie(SUBMISSION_COOKIE, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 5 * 365 * 24 * 60 * 60 * 1000, // effectively permanent
  });
};
