import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // ❌ Logged in but wrong role
  if (allowedRoles && !allowedRoles.includes(role)) {
    // redirect user to their own dashboard
    if (role === "MANAGER" || role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "DOCTOR") {
      return <Navigate to="/doctor" replace />;
    }
    if (role === "PATIENT") {
      return <Navigate to="/patient" replace />;
    }

    return <Navigate to="/" replace />;
  }

  // ✅ Authorized
  return children;
}

export default ProtectedRoute;
