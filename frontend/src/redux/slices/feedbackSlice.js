import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";
import { getDeviceFingerprint } from "../../utils/deviceFingerprint.js";

export const fetchPublicSettings = createAsyncThunk(
  "feedback/fetchPublicSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/feedback/settings");
      return data.settings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load settings");
    }
  }
);

export const checkSubmissionStatus = createAsyncThunk(
  "feedback/checkSubmissionStatus",
  async (_, { rejectWithValue }) => {
    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const { data } = await api.post("/feedback/check", { deviceFingerprint });
      return data.hasSubmitted;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to check status");
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (formData, { rejectWithValue }) => {
    try {
      const deviceFingerprint = await getDeviceFingerprint();
      const { data } = await api.post("/feedback", { ...formData, deviceFingerprint });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Submission failed");
    }
  }
);

const feedbackSlice = createSlice({
  name: "feedback",
  initialState: {
    settings: null,
    hasSubmitted: false,
    thankYouMessage: "",
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(checkSubmissionStatus.fulfilled, (state, action) => {
        state.hasSubmitted = action.payload;
      })
      .addCase(submitFeedback.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hasSubmitted = true;
        state.thankYouMessage = action.payload.thankYouMessage;
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default feedbackSlice.reducer;
