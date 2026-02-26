import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import "./PatientRegister.css";

function PatientRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    address: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation rules
  const isFirstNameValid = form.firstname.trim().length >= 2;
  const isLastNameValid = form.lastname.trim().length >= 2;
  const isGenderValid = form.gender !== "";
  const isDOBValid = form.dateOfBirth !== "";
  const isMobileValid = /^[0-9]{10}$/.test(form.mobile);
  const isAddressValid = form.address.trim().length >= 5;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const isPasswordValid = form.password.trim().length >= 6;

  // ✅ Form valid only if all are valid
  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isGenderValid &&
    isDOBValid &&
    isMobileValid &&
    isAddressValid &&
    isEmailValid &&
    isPasswordValid;

  const passwordStrength = useMemo(() => {
    const p = form.password;
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;

    if (score <= 1) return { label: "Weak", bar: 25 };
    if (score === 2) return { label: "Medium", bar: 55 };
    if (score === 3) return { label: "Strong", bar: 80 };
    return { label: "Very Strong", bar: 100 };
  }, [form.password]);

  const handleRegister = async () => {
    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Details ⚠️",
        text: "Please fill all details correctly!",
        confirmButtonColor: "#2bb673",
      });
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8080/auth/register/patient", {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        mobile: form.mobile,
        address: form.address.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      toast.success("🧑‍🦽 Patient registered successfully!");

      setTimeout(() => {
        navigate("/patient-login");
      }, 1500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed ❌",
        text: err.response?.data?.message || "Unable to register patient!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-container">
      <div className="rp-card">
        {/* Header */}
        <div className="rp-header">
          <div>
            <h4>
              <span className="rp-plus">＋</span> Register Patient
            </h4>
            <p>Create a new patient account.</p>
          </div>

          <div className="rp-badge">🏥 HMS · Patient Portal</div>
        </div>

        <hr />

        {/* Form */}
        <div className="row g-4">
          {/* First Name */}
          <div className="col-md-6">
            <label>First Name</label>
            <input
              type="text"
              className={`form-control ${
                form.firstname ? (isFirstNameValid ? "is-valid" : "is-invalid") : ""
              }`}
              placeholder="Eg: Rahul"
              name="firstname"
              value={form.firstname}
              onChange={handleChange}
            />
            <small>Minimum 2 characters.</small>
          </div>

          {/* Last Name */}
          <div className="col-md-6">
            <label>Last Name</label>
            <input
              type="text"
              className={`form-control ${
                form.lastname ? (isLastNameValid ? "is-valid" : "is-invalid") : ""
              }`}
              placeholder="Eg: Sharma"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
            />
            <small>Minimum 2 characters.</small>
          </div>

          {/* Gender */}
          <div className="col-md-6">
            <label>Gender</label>
            <select
              className={`form-control ${
                form.gender ? "is-valid" : ""
              }`}
              name="gender"
              value={form.gender}
              onChange={handleChange}
            >
              <option value="">-- Select Gender --</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div className="col-md-6">
            <label>Date of Birth</label>
            <input
              type="date"
              className={`form-control ${
                form.dateOfBirth ? "is-valid" : ""
              }`}
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Mobile */}
          <div className="col-md-6">
            <label>Mobile Number</label>
            <input
              type="text"
              className={`form-control ${
                form.mobile ? (isMobileValid ? "is-valid" : "is-invalid") : ""
              }`}
              placeholder="Eg: 9876543210"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              maxLength={10}
            />
            <small>Enter a 10 digit mobile number.</small>
          </div>

          {/* Address */}
          <div className="col-md-6">
            <label>Address</label>
            <input
              type="text"
              className={`form-control ${
                form.address ? (isAddressValid ? "is-valid" : "is-invalid") : ""
              }`}
              placeholder="Enter address"
              name="address"
              value={form.address}
              onChange={handleChange}
            />
            <small>Minimum 5 characters.</small>
          </div>

          {/* Email */}
          <div className="col-md-6">
            <label>Email</label>
            <input
              type="email"
              className={`form-control ${
                form.email ? (isEmailValid ? "is-valid" : "is-invalid") : ""
              }`}
              placeholder="Eg: rahul@gmail.com"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            <small>Enter valid email address.</small>
          </div>

          {/* Password */}
          <div className="col-md-6">
            <label>Password</label>
            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control ${
                  form.password
                    ? isPasswordValid
                      ? "is-valid"
                      : "is-invalid"
                    : ""
                }`}
                placeholder="Eg: Patient@123"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <span
                className="show-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈 Hide" : "👁 Show"}
              </span>
            </div>

            {/* ✅ Strength Bar */}
            {form.password && (
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <small>Password Strength</small>
                  <small className="fw-semibold">{passwordStrength.label}</small>
                </div>
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${passwordStrength.bar}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          className="btn btn-success w-100 mt-4"
          onClick={handleRegister}
          disabled={loading || !isFormValid}
        >
          {loading ? "Registering..." : "✔ Register Patient"}
        </button>

        {/* Tip */}
        <div className="rp-tip mt-4">
          💡 Tip: Use a strong password like <b>Patient@123</b> and ensure your
          mobile number is correct.
        </div>

        {/* ✅ Already have account */}
        <p className="rp-login-text mt-4 text-center">
          Already have an account?{" "}
          <span
            className="rp-login-link"
            onClick={() => navigate("/patient-login")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default PatientRegister;

