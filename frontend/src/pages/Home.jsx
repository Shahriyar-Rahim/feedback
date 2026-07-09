import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router";
import { fetchPublicSettings } from "../redux/slices/feedbackSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.feedback.settings);

  useEffect(() => {
    dispatch(fetchPublicSettings());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-paper text-ink relative overflow-hidden flex flex-col justify-between">
      {/* Ambient margin doodles — subtle, referencing a notebook page */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
        <svg width="100%" height="100%">
          <pattern id="lines" width="100%" height="40" patternUnits="userSpaceOnUse">
            <line x1="0" y1="40" x2="100%" y2="40" stroke="#372B66" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#lines)" />
        </svg>
      </div>

      {/* Main Hero Container */}
      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16 sm:pt-16 my-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-sm font-medium text-plum-600 mb-6"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-black animate-pulse" />
          {settings?.className || "CSE 21st Batch, Section B"} · {settings?.termInfo || "Level 1, Term 2"}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-3xl sm:text-6xl leading-[1.05] font-semibold text-plum-900 mb-6 tracking-tight"
        >
          Tell us how the
          <br />
          <p className="text-5xl sm:text-7xl">CRs were <em className="text-amber-500 decoration-black decoration-wavy decoration-1 underline-offset-8 not-italic">performed</em>.</p>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-ink/70 max-w-xl mb-10 leading-relaxed"
        >
          {settings?.welcomeMessage ||
            "Hi there! We're your Class Representatives, and we'd love to hear your honest thoughts about us so far."}
        </motion.p>

        {/* Action Button & Quick Meta */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 sm:items-center bg-base-100 border border-plum-100 p-4 rounded-3xl shadow-sm max-w-2xl"
        >
          <Link
            to="/feedback"
            className="btn btn-lg  hover:bg-amber-500 text-paper border-none rounded-2xl px-8 shadow-md transition-all hover:-translate-y-0.5 cursor-pointer text-center flex items-center justify-center gap-2"
          >
            Give Feedback
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <div className="flex flex-col text-xs text-ink/60 px-2">
            <span className="font-semibold text-plum-900">Takes under 2 minutes</span>
            <span>Fully anonymous · One response per person</span>
          </div>
        </motion.div>

        {/* What you can review cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink/40 mb-4">What you can evaluate:</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: settings?.cr1Name || "CR 1", context: "Management" },
              { label: settings?.cr2Name || "CR 2", context: "Coordination" },
              { label: "Course delivery", context: "Sessional & Theory" },
              { label: "Class experience", context: "Environment" },
            ].map((item, index) => (
              <div
                key={item.label}
                className="bg-base-100 border border-plum-100/70 rounded-2xl p-4 transition-all hover:border-black hover:shadow-sm"
              >
                <div className="text-xs font-semibold text-ink/40 mb-1">0{index + 1}</div>
                <div className="text-sm font-bold text-plum-900 mb-0.5">{item.label}</div>
                <div className="text-xs text-ink/60">{item.context}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      {/* Footer Branding Guarantee */}
      <footer className="relative w-full max-w-3xl mx-auto px-6 pb-8 text-center text-xs text-ink/40 border-t border-plum-100/40 pt-6">
        <div className="flex items-center justify-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>End-to-end encrypted submission validation profile. No identities are tracked.</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;