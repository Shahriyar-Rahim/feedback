import { Navigate } from "react-router";
import { useSelector } from "react-redux";

// Guards /admin/dashboard — redirects to login if no token is present.
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.admin.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return children;
};

export default ProtectedRoute;
