import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorViewProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/doctor/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(res.data?.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Profile",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* 🔹 Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">👨‍⚕️ My Profile</h4>
              <p className="text-muted mb-0">
                View your personal and professional details.
              </p>
            </div>

            {/* 🔹 Actions */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/doctor/profile/update")}
              >
                ✏️ Update Profile
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/doctor")}
              >
                ⬅ Back
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* 🔹 Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Loading profile...</p>
            </div>
          )}

          {/* 🔹 Profile Data */}
          {!loading && profile && (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor ID</label>
                <div className="form-control bg-light">
                  {profile.doctorId}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor Name</label>
                <div className="form-control bg-light">
                  {profile.name}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Speciality</label>
                <div className="form-control bg-light">
                  <span className="badge bg-info text-dark">
                    {profile.speciality}
                  </span>
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Mobile Number</label>
                <div className="form-control bg-light">
                  {profile.mobile}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Consultation Duration
                </label>
                <div className="form-control bg-light">
                  {profile.consultationDuration} minutes
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <div className="form-control bg-light">
                  <span
                    className={`badge ${
                      profile.status === "ACTIVE"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 🔹 Empty State */}
          {!loading && !profile && (
            <div className="alert alert-warning rounded-4">
              ⚠️ Doctor profile not available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorViewProfile;
