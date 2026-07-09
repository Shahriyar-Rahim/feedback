import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    cr: {
      type: String,
      enum: ["cr1", "cr2", "both"],
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
      required: [true, "Feedback text is required"],
      trim: true,
      maxlength: 3000,
    },
    suggestions: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    improvements: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    generalMessage: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    // Anti-duplicate-submission fields (hashed, never store raw IP)
    identifierHash: {
      type: String,
      required: true,
      index: true,
    },
    deviceFingerprint: {
      type: String,
      required: true,
      index: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Compound index to speed up duplicate checks
feedbackSchema.index({ identifierHash: 1, deviceFingerprint: 1 });

export default mongoose.model("Feedback", feedbackSchema);
