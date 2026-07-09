import { configureStore } from "@reduxjs/toolkit";
import feedbackReducer from "./slices/feedbackSlice.js";
import adminReducer from "./slices/adminSlice.js";

export const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    admin: adminReducer,
  },
});
