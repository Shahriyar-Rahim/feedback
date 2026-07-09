import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StarRating from "../components/StarRating.jsx";
import {
  fetchPublicSettings,
  checkSubmissionStatus,
  submitFeedback,
} from "../redux/slices/feedbackSlice.js";
import {
  markAsSubmitted,
  hasAlreadySubmitted,
} from "../utils/deviceFingerprint.js";

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { settings, hasSubmitted, status } = useSelector(
    (state) => state.feedback,
  );
  const [checking, setChecking] = useState(true);

  const [form, setForm] = useState({
    cr: "",
    rating: 0,
    feedback: "",
    suggestions: "",
    improvements: "",
    generalMessage: "",
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    dispatch(fetchPublicSettings());

    if (hasAlreadySubmitted()) {
      setChecking(false);
      return;
    }
    dispatch(checkSubmissionStatus()).finally(() => setChecking(false));
  }, [dispatch]);

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const isValid = form.cr && form.rating > 0 && form.feedback.trim().length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) {
      toast.error(
        "Please select who it's about, add a rating, and write your feedback.",
      );
      return;
    }

    const result = await dispatch(submitFeedback(form));
    if (submitFeedback.fulfilled.match(result)) {
      markAsSubmitted();
      toast.success("Feedback submitted — thank you!");
      navigate("/thank-you", {
        state: { message: result.payload.thankYouMessage },
      });
    } else {
      toast.error(result.payload || "Something went wrong. Please try again.");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6">
        <div className="w-full max-w-xl">
          <Skeleton height={40} className="mb-4" />
          <Skeleton height={120} className="mb-4" />
          <Skeleton height={200} />
        </div>
      </div>
    );
  }

  if (hasSubmitted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div>
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-display text-3xl text-plum-900 mb-3">
            You've already shared your feedback
          </h2>
          <p className="text-ink/60 mb-6">
            Only one submission is allowed per person — thanks for taking part!
          </p>
          <Link
            to="/"
            className="btn btn-outline border-plum-700 text-plum-700 hover:bg-plum-700 hover:text-paper rounded-full"
          >
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper py-12 px-6">
      <div className="max-w-xl mx-auto">
        <Link
          to="/"
          className="text-sm text-plum-600 hover:text-plum-900 mb-6 inline-flex items-center gap-1"
        >
          ← Back
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-base-100 rounded-3xl shadow-xl shadow-plum-900/5 border border-plum-100 p-8 sm:p-10 torn-edge"
        >
          <h1 className="font-display text-3xl text-plum-900 mb-2">
            Share your feedback
          </h1>
          <p className="text-ink/60 mb-8 text-sm">
            Honest, constructive, and anonymous. Only the required fields are *
            marked.
          </p>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="label-text font-medium mb-2 block">
                Who is this feedback about? *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "cr1", label: settings?.cr1Name || "CR 1" },
                  { value: "cr2", label: settings?.cr2Name || "CR 2" },
                  { value: "both", label: "Both" },
                ].map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm((f) => ({ ...f, cr: opt.value }))}
                    className={`rounded-xl border py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                      form.cr === opt.value
                        ? "text-paper border-amber-700 bg-amber-300"
                        : "bg-transparent text-plum-700 border-plum-200 hover:border-plum-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {touched && !form.cr && (
                <p className="text-error text-xs mt-1 text-red-500">
                  Please make a selection.
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="label-text font-medium text-plum-800">
                  Overall rating *
                </label>
                {form.rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, rating: 0 }))}
                    className="text-xs font-medium text-slate-500 hover:text-black transition-colors cursor-pointer underline underline-offset-2"
                  >
                    Reset
                  </button>
                )}
              </div>
              <StarRating
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
              {touched && !form.rating && (
                <p className="text-error text-xs mt-1 text-red-500">
                  Please choose a rating.
                </p>
              )}
            </div>

            <div>
              <label className="label-text font-medium text-plum-800 mb-2 block">
                Your feedback *
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-paper border-plum-200 focus:border-plum-500 rounded-xl min-h-27.5"
                placeholder="What's working well? What isn't?"
                value={form.feedback}
                onChange={handleChange("feedback")}
                maxLength={3000}
              />
              {touched && !form.feedback.trim() && (
                <p className="text-error text-xs mt-1 text-red-500">Feedback is required.</p>
              )}
            </div>

            <div>
              <label className="label-text font-medium text-plum-800 mb-2 block">
                Suggestions{" "}
                <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-paper border-plum-200 focus:border-plum-500 rounded-xl min-h-[80px]"
                placeholder="Anything you'd like to see done differently?"
                value={form.suggestions}
                onChange={handleChange("suggestions")}
                maxLength={3000}
              />
            </div>

            <div>
              <label className="label-text font-medium text-plum-800 mb-2 block">
                Improvements{" "}
                <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-paper border-plum-200 focus:border-plum-500 rounded-xl min-h-[80px]"
                placeholder="What could be improved going forward?"
                value={form.improvements}
                onChange={handleChange("improvements")}
                maxLength={3000}
              />
            </div>

            <div>
              <label className="label-text font-medium text-plum-800 mb-2 block">
                Anything else on your mind?{" "}
                <span className="text-ink/40 font-normal">(optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full bg-paper border-plum-200 focus:border-plum-500 rounded-xl min-h-[80px]"
                placeholder="Free space — say whatever you'd like."
                value={form.generalMessage}
                onChange={handleChange("generalMessage")}
                maxLength={3000}
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="btn btn-lg w-full bg-marigold-500 hover:bg-marigold-600 text-ink border-none rounded-full disabled:opacity-60"
            >
              {status === "loading" ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackForm;
