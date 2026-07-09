import mongoose from "mongoose";

// Singleton document holding CR names + thank-you messages.
const settingsSchema = new mongoose.Schema(
  {
    cr1Name: { type: String, default: "CR 1" },
    cr2Name: { type: String, default: "CR 2" },
    thankYouMessageCr1: {
      type: String,
      default: "Thank you so much for your valuable feedback! It truly helps us do better.",
    },
    thankYouMessageCr2: {
      type: String,
      default: "Thank you so much for your valuable feedback! It truly helps us do better.",
    },
    welcomeMessage: {
      type: String,
      default:
        "Hi there! We're your Class Representatives, and we'd love to hear your honest thoughts about the term so far.",
    },
    className: { type: String, default: "CSE 21st Batch, Section B" },
    termInfo: { type: String, default: "Level 1, Term 2" },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
