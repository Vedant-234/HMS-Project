import "./AuthLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import Swal from "sweetalert2";

function DoctorLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please enter email and password!",
        confirmButtonColor: "#2bb673",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        toast.success("✅ Login Successful! Welcome Doctor");

        setTimeout(() => {
          navigate("/doctor");
        }, 1200);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed 😓",
        text: "Invalid Email or Password!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="back-link" onClick={() => navigate("/")}>
        ← Back to Home
      </div>

      <div className="auth-card">
        <div className="auth-icon">🏥</div>

        <h4 className="text-center mt-3">Doctor Portal</h4>
        <p className="text-center text-muted">
          Sign in to access your doctor dashboard
        </p>

        <label className="form-label mt-3">Email</label>
        <div className="input-group">
          <span className="input-group-text">👤</span>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="form-label mt-3">Password</label>
        <div className="input-group">
          <span className="input-group-text">🔒</span>
          <input
            type="password"
            className="form-control"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="btn btn-primary w-100 mt-4"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {/* Forgot Password */}
        <div className="text-end mt-2">
          <span
            className="auth-link"
            onClick={() => navigate("/forgot-password", { state: { role: "DOCTOR" } })}
          >
            Forgot Password?
          </span>
        </div>
      </div>
    </div>
  );
}

export default DoctorLogin;
