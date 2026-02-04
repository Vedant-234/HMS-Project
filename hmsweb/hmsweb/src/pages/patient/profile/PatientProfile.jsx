import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function PatientProfile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    address: "",
    email: "", // ✅ read-only
  });

  // ✅ Fetch profile
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/patient/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data || {};

      setForm({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
        mobile: data.mobile || "",
        address: data.address || "",
        email: data.email || "", // ✅ read-only
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load profile ❌",
        text: err.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  // ✅ Change handler
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Validations
  const isFirstNameValid = form.firstname.trim().length >= 2;
  const isLastNameValid = form.lastname.trim().length >= 2;
  const isGenderValid = form.gender !== "";
  const isDOBValid = form.dateOfBirth !== "";
  const isMobileValid = /^[0-9]{10}$/.test(form.mobile);
  const isAddressValid = form.address.trim().length >= 5;

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isGenderValid &&
    isDOBValid &&
    isMobileValid &&
    isAddressValid;

  const summaryText = useMemo(() => {
    return `${form.firstname} ${form.lastname} • ${form.gender}`;
  }, [form.firstname, form.lastname, form.gender]);

  // ✅ Update profile (email excluded)
  const handleUpdate = async () => {
    if (!isFormValid) {
      Swal.fire({
        icon: "warning",
        title: "Invalid details ⚠️",
        text: "Please fill all details correctly!",
        confirmButtonColor: "#198754",
      });
      return;
    }

    try {
      setSaving(true);

      await axios.put(
        "http://localhost:8080/patient/profile",
        {
          firstname: form.firstname.trim(),
          lastname: form.lastname.trim(),
          gender: form.gender,
          dateOfBirth: form.dateOfBirth,
          mobile: form.mobile,
          address: form.address.trim(),
          // ✅ email not sent (cannot be updated)
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Profile updated successfully!");
      fetchProfile();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed ❌",
        text: err.response?.data?.message || "Unable to update profile!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">👤 My Profile</h4>
              <p className="text-muted mb-0">
                Update your personal details. Email cannot be changed.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/patient")}
              >
                ⬅ Back
              </button>

              <button className="btn btn-success" onClick={fetchProfile}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Loading */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="text-muted mt-2">Loading profile...</p>
            </div>
          ) : (
            <>
              {/* ✅ Summary */}
              <div className="alert alert-success rounded-4">
                ✅ Profile Loaded: <b>{summaryText}</b>
              </div>

              <div className="row g-3">
                {/* Firstname */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">First Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      form.firstname
                        ? isFirstNameValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                {/* Lastname */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      form.lastname
                        ? isLastNameValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Gender</label>
                  <select
                    className={`form-select ${
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

                {/* DOB */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date of Birth</label>
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
                  <label className="form-label fw-semibold">Mobile</label>
                  <input
                    type="text"
                    className={`form-control ${
                      form.mobile
                        ? isMobileValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="10 digit mobile"
                  />
                  <small className="text-muted">
                    Only 10 digit numbers allowed.
                  </small>
                </div>

                {/* Email (Read-only) */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    disabled
                  />
                  <small className="text-muted">
                    Email cannot be updated.
                  </small>
                </div>

                {/* Address */}
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Address</label>
                  <textarea
                    className={`form-control ${
                      form.address
                        ? isAddressValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Enter full address"
                  />
                </div>
              </div>

              {/* Update Button */}
              <button
                className="btn btn-success w-100 mt-4 fw-semibold rounded-3"
                onClick={handleUpdate}
                disabled={!isFormValid || saving}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  "✅ Update Profile"
                )}
              </button>
            </>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Patient Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default PatientProfile;
