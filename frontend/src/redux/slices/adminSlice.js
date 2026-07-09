import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

export const loginAdmin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", data.token);
      return data.admin;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const fetchFeedbackList = createAsyncThunk(
  "admin/fetchFeedbackList",
  async ({ cr = "", page = 1 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/admin/feedback`, { params: { cr, page } });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load feedback");
    }
  }
);

export const fetchStats = createAsyncThunk("admin/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/admin/stats");
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to load stats");
  }
});

export const fetchRatingTrend = createAsyncThunk(
  "admin/fetchRatingTrend",
  async ({ cr = "", range = 90 } = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/stats/trend", { params: { cr, range } });
      return data.trend;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load trend");
    }
  }
);

export const fetchAdminSettings = createAsyncThunk(
  "admin/fetchAdminSettings",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/settings");
      return data.settings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load settings");
    }
  }
);

export const updateAdminSettings = createAsyncThunk(
  "admin/updateAdminSettings",
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/admin/settings", updates);
      return data.settings;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update settings");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    isAuthenticated: !!localStorage.getItem("adminToken"),
    email: null,
    feedbackList: [],
    total: 0,
    pages: 1,
    page: 1,
    avgRating: 0,
    stats: null,
    trend: [],
    settings: null,
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("adminToken");
      state.isAuthenticated = false;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.email = action.payload.email;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchFeedbackList.fulfilled, (state, action) => {
        state.feedbackList = action.payload.items;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.avgRating = action.payload.avgRating;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(fetchRatingTrend.fulfilled, (state, action) => {
        state.trend = action.payload;
      })
      .addCase(fetchAdminSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      })
      .addCase(updateAdminSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  },
});

export const { logout } = adminSlice.actions;
export default adminSlice.reducer;
