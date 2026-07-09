import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import sanitizeMiddleware from "./src/middleware/sanitize.js";

import { connectDB } from "./src/config/db.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import { notFound, errorHandler } from "./src/middleware/errorHandler.js";
import { apiLimiter } from "./src/middleware/rateLimiter.js";

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(morgan("tiny"));
app.use(sanitizeMiddleware);
app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

app.get("/api", (req, res) => {
  res.json({
    status: "healthy",
    message: "CR Feedback System API is running successfully",
    timestamp: new Date()
  });
});

app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));