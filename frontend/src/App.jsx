import { Routes, Route } from "react-router";
import Home from "./pages/Home.jsx";
import FeedbackForm from "./pages/FeedbackForm.jsx";
import ThankYou from "./pages/ThankYou.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/feedback" element={<FeedbackForm />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
