import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Navbar({ role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Clear JWT + role
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // ✅ Toast message (optional)
    toast.info("👋 Logged out successfully");

    // ✅ Navigate to Home
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-success px-3">
      <span className="navbar-brand">Hospital Management System</span>

      {/* ✅ Clickable Logout */}
      <span
    className="text-white fw-semibold"
    style={{ cursor: "pointer" }}
    onClick={handleLogout}
    >
  Logout
</span>

    </nav>
  );
}

export default Navbar;

