import { useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function RegisterDoctor() {
  const [formData, setFormData] = useState({
    name: "Dr. ",
    gender: "",
    speciality: "",
    mobile: "",
    consultationDuration: 15,
    doctorConsultationFee: "", // ✅ NEW
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const specialities = [
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "General Physician",
    "ENT",
    "Gynecology",
  ];

  const navigate = useNavigate();

  // ✅ handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Force "Dr. " prefix
    if (name === "name") {
      let newValue = value;
      if (!newValue.startsWith("Dr. ")) {
        newValue = "Dr. " + newValue.replace(/^Dr\.\s*/i, "");
      }
      setFormData((prev) => ({ ...prev, name: newValue }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "consultationDuration" ||
        name === "doctorConsultationFee"
          ? Number(value)
          : value,
    }));
  };

  // ✅ Validations
  const isNameValid = formData.name.trim().length >= 6;
  const isGenderValid = formData.gender !== "";
  const isMobileValid = /^[0-9]{10}$/.test(formData.mobile);
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const isDurationValid =
    formData.consultationDuration >= 5 &&
    formData.consultationDuration <= 60;

  const isFeeValid =
    formData.doctorConsultationFee > 0; // ✅ NEW

  const passwordStrength = useMemo(() => {
    const p = formData.password;
    let score = 0;
    if (p.length >= 6) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[@$!%*?&]/.test(p)) score++;

    if (score <= 1) return { label: "Weak", bar: 25 };
    if (score === 2) return { label: "Medium", bar: 55 };
    if (score === 3) return { label: "Strong", bar: 80 };
    return { label: "Very Strong", bar: 100 };
  }, [formData.password]);

  const isFormValid =
    isNameValid &&
    isGenderValid &&
    formData.speciality &&
    isMobileValid &&
    isEmailValid &&
    isDurationValid &&
    isFeeValid && // ✅ NEW
    formData.password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Inputs ❌",
        text: "Please fill correct details in all fields.",
        confirmButtonColor: "#066c3c",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/manager/register/doctor",
        {
          name: formData.name,
          gender: formData.gender,
          speciality: formData.speciality,
          mobile: formData.mobile,
          consultationDuration: formData.consultationDuration,
          doctorConsultationFee: formData.doctorConsultationFee, // ✅ NEW
          email: formData.email,
          password: formData.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Doctor Registered Successfully!");

      setFormData({
        name: "Dr. ",
        gender: "",
        speciality: "",
        mobile: "",
        consultationDuration: 15,
        doctorConsultationFee: "",
        email: "",
        password: "",
      });

      setTimeout(() => navigate("/admin"), 1200);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed 😓",
        text:
          error?.response?.data?.message ||
          "Something went wrong while registering doctor",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-3">➕ Register Doctor</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Doctor Name */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor Name</label>
                <input
                  type="text"
                  className={`form-control ${
                    formData.name
                      ? isNameValid
                        ? "is-valid"
                        : "is-invalid"
                      : ""
                  }`}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Gender */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Gender</label>
                <select
                  className={`form-select ${formData.gender ? "is-valid" : ""}`}
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">-- Select Gender --</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Speciality */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Speciality</label>
                <select
                  className={`form-select ${
                    formData.speciality ? "is-valid" : ""
                  }`}
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                >
                  <option value="">-- Select Speciality --</option>
                  {specialities.map((sp, idx) => (
                    <option value={sp} key={idx}>{sp}</option>
                  ))}
                </select>
              </div>

              {/* Mobile */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Mobile</label>
                <input
                  type="text"
                  className={`form-control ${
                    formData.mobile
                      ? isMobileValid
                        ? "is-valid"
                        : "is-invalid"
                      : ""
                  }`}
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              {/* Consultation Duration */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Consultation Duration (min)
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    isDurationValid ? "is-valid" : "is-invalid"
                  }`}
                  name="consultationDuration"
                  value={formData.consultationDuration}
                  onChange={handleChange}
                />
              </div>

              {/* ✅ Consultation Fee */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Consultation Fee (₹)
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    formData.doctorConsultationFee
                      ? isFeeValid
                        ? "is-valid"
                        : "is-invalid"
                      : ""
                  }`}
                  name="doctorConsultationFee"
                  value={formData.doctorConsultationFee}
                  onChange={handleChange}
                  placeholder="Eg: 500"
                />
                <div className="form-text">
                  Enter fee greater than 0
                </div>
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className={`form-control ${
                    formData.email
                      ? isEmailValid
                        ? "is-valid"
                        : "is-invalid"
                      : ""
                  }`}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            

            <button
              type="submit"
              className="btn btn-success mt-4 w-100"
              disabled={!isFormValid || loading}
            >
              {loading ? "Registering..." : "✅ Register Doctor"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterDoctor;



