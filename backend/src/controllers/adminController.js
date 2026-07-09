import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Feedback from "../models/Feedback.js";
import Settings from "../models/Settings.js";
import { generateFeedbackPDF } from "../utils/pdfGenerator.js";

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

// @desc  Admin login
// @route POST /api/admin/login
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required." });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = signToken(admin);

    res
      .cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({ success: true, token, admin: { email: admin.email } });
  } catch (err) {
    next(err);
  }
};

// @desc  Admin logout
// @route POST /api/admin/logout
export const logoutAdmin = (req, res) => {
  res.clearCookie("adminToken").json({ success: true, message: "Logged out." });
};

// @desc  Get all feedback, optional ?cr=cr1|cr2|both filter
// @route GET /api/admin/feedback
export const getAllFeedback = async (req, res, next) => {
  try {
    const { cr, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (cr && ["cr1", "cr2", "both"].includes(cr)) filter.cr = cr;

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Feedback.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Feedback.countDocuments(filter),
    ]);

    const avgRatingAgg = await Feedback.aggregate([
      { $match: filter },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      avgRating: avgRatingAgg[0]?.avgRating || 0,
      items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get / update settings (CR names, thank-you messages)
// @route GET /api/admin/settings
// @route PUT /api/admin/settings
export const getSettings = async (req, res, next) => {
  try {
    const settings = (await Settings.findOne()) || (await Settings.create({}));
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const allowedFields = [
      "cr1Name",
      "cr2Name",
      "thankYouMessageCr1",
      "thankYouMessageCr2",
      "welcomeMessage",
      "className",
      "termInfo",
    ];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(updates);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, updates, { new: true });
    }

    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
};

// @desc  Export feedback as PDF. ?cr=cr1|cr2|combined
// @route GET /api/admin/export/pdf
export const exportFeedbackPDF = async (req, res, next) => {
  try {
    const { cr = "combined" } = req.query;
    const filter = cr === "combined" ? {} : { cr };
    const items = await Feedback.find(filter).sort({ createdAt: -1 });
    const settings = (await Settings.findOne()) || (await Settings.create({}));

    const crLabel =
      cr === "cr1" ? settings.cr1Name : cr === "cr2" ? settings.cr2Name : "Combined (Both CRs)";

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="feedback-${cr}-${Date.now()}.pdf"`
    );

    generateFeedbackPDF({ items, crLabel, settings, res });
  } catch (err) {
    next(err);
  }
};

// @desc  Rating trend over time, bucketed by day, optionally split by CR
// @route GET /api/admin/stats/trend?cr=cr1|cr2|both&range=30
export const getRatingTrend = async (req, res, next) => {
  try {
    const { cr, range = 90 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(range));

    const match = { createdAt: { $gte: since } };
    if (cr && ["cr1", "cr2", "both"].includes(cr)) match.cr = cr;

    const trend = await Feedback.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      trend: trend.map((t) => ({ date: t._id, avgRating: Number(t.avgRating.toFixed(2)), count: t.count })),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Dashboard summary stats
// @route GET /api/admin/stats
export const getStats = async (req, res, next) => {
  try {
    const total = await Feedback.countDocuments();
    const byCR = await Feedback.aggregate([
      { $group: { _id: "$cr", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } },
    ]);
    const overallAvg = await Feedback.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    res.json({
      success: true,
      total,
      byCR,
      overallAvgRating: overallAvg[0]?.avg || 0,
    });
  } catch (err) {
    next(err);
  }
};
