import { useLocation, Link, Navigate } from "react-router";
import { motion } from "framer-motion";

const ThankYou = () => {
  const location = useLocation();
  const message = location.state?.message;

  // Guard against directly visiting /thank-you without submitting.
  if (!message) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Confetti-like ambient dots */}
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: -40, x: Math.random() * 400 - 200 }}
          animate={{ opacity: [0, 1, 0], y: 400 }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 1.5,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
          className="absolute top-0 left-1/2 w-2 h-2 rounded-full"
          style={{ backgroundColor: i % 2 === 0 ? "#E7A33E" : "#4C8F6B" }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative bg-paper rounded-3xl shadow-2xl p-10 sm:p-14 max-w-lg w-full text-center torn-edge"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-sage-500/15 flex items-center justify-center mx-auto mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>

        <h1 className="font-display text-3xl text-plum-900 mb-4">Thank you!</h1>
        <p className="text-ink/70 leading-relaxed mb-8">{message}</p>

        <Link
          to="/"
          className="btn bg-plum-700 hover:bg-plum-900 text-paper border-none rounded-full px-8"
        >
          Back to home
        </Link>
      </motion.div>
    </div>
  );
};

export default ThankYou;
