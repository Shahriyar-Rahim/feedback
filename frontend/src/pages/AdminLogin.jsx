import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { loginAdmin } from "../redux/slices/adminSlice.js";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, status } = useSelector((state) => state.admin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      toast.success("Welcome back!");
      navigate("/admin/dashboard");
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-plum-900 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-paper rounded-3xl shadow-2xl p-10 max-w-md w-full"
      >
        <h1 className="font-display text-2xl text-plum-900 mb-1">CR Admin Login</h1>
        <p className="text-ink/60 text-sm mb-8">Restricted access — CR use only.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full bg-base-100 border-plum-200 focus:border-plum-500 rounded-xl"
              placeholder="cr@example.com"
            />
          </div>
          <div>
            <label className="label-text text-sm font-medium text-plum-800 mb-1 block">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full bg-base-100 border-plum-200 focus:border-plum-500 rounded-xl"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn w-full bg-plum-700 hover:bg-plum-900 text-paper border-none rounded-full mt-2 disabled:opacity-60"
          >
            {status === "loading" ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
