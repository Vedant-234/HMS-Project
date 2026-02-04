import "./AuthLogin.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ✅ Toastify
import { toast } from "react-toastify";

// ✅ SweetAlert2
import Swal from "sweetalert2";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // or username
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please enter email and password!",
        confirmButtonColor: "#0d6efd",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("http://localhost:8080/auth/login", {
        email: email,
        password: password,
      });

      // ✅ Successful login (token received)
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        // ✅ Toast on success
        toast.success("✅ Login Successful! Welcome Manager");

        // ✅ navigate after small delay (toast shows first)
        setTimeout(() => {
          navigate("/admin");
        }, 1200);
      }
    } catch (err) {
      // ✅ SweetAlert Popup on invalid credentials
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

        <h4 className="text-center mt-3">Manager Portal</h4>
        <p className="text-center text-muted">
          Sign in to access your manager dashboard
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
      </div>
    </div>
  );
}

export default AdminLogin;



