import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ Only allow MANAGER dashboard
  if (!token || role !== "MANAGER") {
    return <Navigate to="/admin-login" />;
  }

  return children;
}

export default ProtectedRoute;
