import "./AuthLogin.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Identify role (PATIENT / DOCTOR)
  const role = location.state?.role || "PATIENT";

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Go back to correct login page
  const goBackToLogin = () => {
    if (role === "DOCTOR") navigate("/doctor-login");
    else navigate("/patient-login");
  };

  const handleChangePassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "All fields are required!",
        confirmButtonColor: "#2bb673",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "New password and confirm password do not match!",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/auth/changepassword", {
        email,
        newPassword,
        confirmPassword,
      });

      toast.success("🔐 Password changed successfully!");

      // 🔹 Redirect to correct login after success
      setTimeout(() => {
        goBackToLogin();
      }, 1500);

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Change Failed",
        text: err.response?.data || "Unable to change password!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* 🔹 Dynamic Back Link */}
      <div className="back-link" onClick={goBackToLogin}>
        ← Back to Login
      </div>

      <div className="auth-card">
        <div className="auth-icon">🔐</div>

        <h4 className="text-center mt-3">Reset Password</h4>
        <p className="text-center text-muted">
          Enter your email and set a new password
        </p>

        {/* Email */}
        <label className="form-label mt-3">Email</label>
        <div className="input-group">
          <span className="input-group-text">📧</span>
          <input
            type="email"
            className="form-control"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* New Password */}
        <label className="form-label mt-3">New Password</label>
        <div className="input-group">
          <span className="input-group-text">🔒</span>
          <input
            type="password"
            className="form-control"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        {/* Confirm Password */}
        <label className="form-label mt-3">Confirm Password</label>
        <div className="input-group">
          <span className="input-group-text">🔒</span>
          <input
            type="password"
            className="form-control"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 mt-4"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
