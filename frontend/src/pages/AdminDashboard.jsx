import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  fetchFeedbackList,
  fetchStats,
  fetchRatingTrend,
  fetchAdminSettings,
  updateAdminSettings,
  logout,
} from "../redux/slices/adminSlice.js";
import api from "../api/axios.js";
import RatingTrendChart from "../components/RatingTrendChart.jsx";

const TABS = ["Overview", "Feedback", "Settings"];

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { feedbackList, total, pages, page, avgRating, stats, trend, settings } = useSelector(
    (state) => state.admin
  );
  const [tab, setTab] = useState("Overview");
  const [crFilter, setCrFilter] = useState("");
  const [trendCr, setTrendCr] = useState("");
  const [trendRange, setTrendRange] = useState(90);
  const [loading, setLoading] = useState(true);
  const [settingsForm, setSettingsForm] = useState(null);

  useEffect(() => {
    Promise.all([
      dispatch(fetchStats()),
      dispatch(fetchFeedbackList({})),
      dispatch(fetchAdminSettings()),
      dispatch(fetchRatingTrend({})),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchRatingTrend({ cr: trendCr, range: trendRange }));
  }, [dispatch, trendCr, trendRange]);

  useEffect(() => {
    if (settings) setSettingsForm(settings);
  }, [settings]);

  const handleFilterChange = (cr) => {
    setCrFilter(cr);
    dispatch(fetchFeedbackList({ cr, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchFeedbackList({ cr: crFilter, page: newPage }));
  };

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (_) {}
    dispatch(logout());
    navigate("/admin/login");
  };

  const handleExport = async (crScope) => {
    try {
      const res = await api.get(`/admin/export/pdf`, {
        params: { cr: crScope },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `feedback-${crScope}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF downloaded");
    } catch (err) {
      toast.error("Export failed");
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateAdminSettings(settingsForm));
    if (updateAdminSettings.fulfilled.match(result)) {
      toast.success("Settings saved");
    } else {
      toast.error(result.payload || "Failed to save");
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-plum-900 text-paper px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl">CR Admin Dashboard</h1>
          <p className="text-xs text-paper/60">CSE 21st Batch, Section B</p>
        </div>
        <button onClick={handleLogout} className="btn btn-sm btn-outline border-paper/30 text-paper hover:bg-paper hover:text-plum-900 rounded-full">
          Logout
        </button>
      </header>

      <nav className="border-b border-plum-100 bg-base-100 px-6">
        <div className="flex gap-6 max-w-5xl mx-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-marigold-500 text-plum-900" : "border-transparent text-ink/50 hover:text-plum-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <Skeleton height={200} />
        ) : (
          <>
            {tab === "Overview" && (
              <div>
                <div className="grid grid-cols-2  sm:grid-cols-4 gap-4 mb-8">
                  <StatCard label="Total responses" value={stats?.total ?? 0} />
                  <StatCard label="Overall avg rating" value={(stats?.overallAvgRating || 0).toFixed(1)} />
                  {stats?.byCR?.map((c) => (
                    <StatCard key={c._id} label={`${c._id} avg`} value={(c.avgRating || 0).toFixed(1)} sub={`${c.count} responses`} />
                  ))}
                </div>

                <div className="bg-base-100 border border-plum-100 rounded-2xl p-6 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="font-display text-lg text-plum-900">Rating trend</h3>
                    <div className="flex gap-2">
                      <div className="flex rounded-full border border-plum-200 overflow-hidden text-xs">
                        {[
                          { value: "", label: "All" },
                          { value: "cr1", label: settingsForm?.cr1Name || "CR 1" },
                          { value: "cr2", label: settingsForm?.cr2Name || "CR 2" },
                          { value: "both", label: "Both" },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setTrendCr(opt.value)}
                            className={`px-3 py-1.5 font-medium transition-colors ${
                              trendCr === opt.value ? "bg-amber-500 border-amber-500 text-paper" : "text-plum-700 hover:bg-plum-50"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <select
                        value={trendRange}
                        onChange={(e) => setTrendRange(Number(e.target.value))}
                        className="select select-sm select-bordered border-plum-200 rounded-full text-xs"
                      >
                        <option value={1}>1 day</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={365}>1 year</option>
                      </select>
                    </div>
                  </div>
                  <RatingTrendChart data={trend} />
                </div>

                <div className="bg-base-100 border border-plum-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
  {/* Subtle decorative top accent line */}
  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-plum-500 via-marigold-400 to-plum-600" />

  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
    <div>
      <h3 className="font-display text-lg font-bold text-plum-900 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-plum-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Reports
      </h3>
      <p className="text-xs sm:text-sm text-ink/60 mt-1 max-w-md">
        Download comprehensively compiled and formatted PDF document archives of incoming student reviews.
      </p>
    </div>
  </div>

  <div className="grid grid-cols sm:grid-cols-3 gap-3">
    {/* CR 1 Button */}
    <button 
      onClick={() => handleExport("cr1")} 
      className="btn btn-md bg-plum-50 hover:bg-plum-100 text-plum-900 border border-plum-200/60 rounded-xl flex items-center justify-center gap-2 normal-case transition-all cursor-pointer font-medium text-xs sm:text-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {settingsForm?.cr1Name || "CR 1"} File
    </button>

    {/* CR 2 Button */}
    <button 
      onClick={() => handleExport("cr2")} 
      className="btn btn-md bg-plum-50 hover:bg-plum-100 text-plum-900 border border-plum-200/60 rounded-xl flex items-center justify-center gap-2 normal-case transition-all cursor-pointer font-medium text-xs sm:text-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {settingsForm?.cr2Name || "CR 2"} File
    </button>

    {/* Combined Master Report Button */}
    <button 
      onClick={() => handleExport("combined")} 
      className="btn btn-md bg-pulm-50 hover:bg-zinc-800 text-paper border rounded-xl flex items-center justify-center gap-2 normal-case transition-all cursor-pointer font-semibold text-xs sm:text-sm shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8m-5 5h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l2.414-2.414a1 1 0 01.707-.293H20" />
      </svg>
      Both
    </button>
  </div>
</div>
              </div>
            )}

            {tab === "Feedback" && (
              <div>
                <div className="flex gap-2 mb-6">
                  {[
                    { value: "", label: "All" },
                    { value: "cr1", label: settingsForm?.cr1Name || "CR 1" },
                    { value: "cr2", label: settingsForm?.cr2Name || "CR 2" },
                    { value: "both", label: "Both" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleFilterChange(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                        crFilter === opt.value
                          ? "bg-amber-500 text-paper border-amber-500"
                          : "bg-transparent text-plum-700 border-plum-200 hover:border-plum-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <span className="ml-auto text-sm text-ink/50 self-center">{total} total · avg {avgRating.toFixed(1)}★</span>
                </div>

                <div className="space-y-4">
                  {feedbackList.length === 0 && (
                    <p className="text-center text-ink/50 py-12">No feedback entries yet.</p>
                  )}
                  {feedbackList.map((item) => (
                    <div key={item._id} className="bg-base-100 border border-plum-100 rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-marigold-600 font-medium">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</span>
                        <span className="text-xs text-ink/40">{new Date(item.createdAt).toLocaleString()} · {item.cr}</span>
                      </div>
                      <p className="text-sm text-ink mb-2"><strong>Feedback:</strong> {item.feedback}</p>
                      {item.suggestions && <p className="text-sm text-ink/70 mb-1"><strong>Suggestions:</strong> {item.suggestions}</p>}
                      {item.improvements && <p className="text-sm text-ink/70 mb-1"><strong>Improvements:</strong> {item.improvements}</p>}
                      {item.generalMessage && <p className="text-sm text-ink/70"><strong>Message:</strong> {item.generalMessage}</p>}
                    </div>
                  ))}
                </div>

                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`w-8 h-8 rounded-full text-sm ${
                          page === i + 1 ? "bg-plum-700 text-paper" : "bg-plum-100 text-plum-700"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "Settings" && settingsForm && (
              <form onSubmit={handleSaveSettings} className="bg-base-100 border border-plum-100 rounded-2xl p-6 space-y-5 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text text-sm font-medium text-plum-800 mb-1 block">CR 1 Name</label>
                    <input
                      className="input input-bordered w-full rounded-xl border-plum-200"
                      value={settingsForm.cr1Name}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, cr1Name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-text text-sm font-medium text-plum-800 mb-1 block">CR 2 Name</label>
                    <input
                      className="input input-bordered w-full rounded-xl border-plum-200"
                      value={settingsForm.cr2Name}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, cr2Name: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Welcome message (homepage)</label>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl border-plum-200 min-h-[80px]"
                    value={settingsForm.welcomeMessage}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, welcomeMessage: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Thank-you message — {settingsForm.cr1Name}</label>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl border-plum-200 min-h-[80px]"
                    value={settingsForm.thankYouMessageCr1}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, thankYouMessageCr1: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Thank-you message — {settingsForm.cr2Name}</label>
                  <textarea
                    className="textarea textarea-bordered w-full rounded-xl border-plum-200 min-h-[80px]"
                    value={settingsForm.thankYouMessageCr2}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, thankYouMessageCr2: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Class name</label>
                    <input
                      className="input input-bordered w-full rounded-xl border-plum-200"
                      value={settingsForm.className}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, className: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Term info</label>
                    <input
                      className="input input-bordered w-full rounded-xl border-plum-200"
                      value={settingsForm.termInfo}
                      onChange={(e) => setSettingsForm((s) => ({ ...s, termInfo: e.target.value }))}
                    />
                  </div>
                </div>

                <button type="submit" className="btn bg-plum-700 hover:bg-plum-900 text-paper border-none rounded-full px-8">
                  Save settings
                </button>
              </form>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, sub }) => (
  <div className="bg-base-100 border border-plum-100 rounded-2xl p-4 text-center">
    <div className="text-2xl font-display text-plum-900">{value}</div>
    <div className="text-xs text-ink/50 mt-1">{label}</div>
    {sub && <div className="text-[10px] text-ink/30 mt-0.5">{sub}</div>}
  </div>
);

export default AdminDashboard;
