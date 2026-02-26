import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function DoctorUpdateProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    speciality: "",
    mobile: "",
    consultationDuration: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // 🔹 Load profile for prefill
  const loadProfile = async () => {
    try {
      setPageLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/doctor/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm(res.data?.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to Load Profile",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!form.name || !form.speciality || !form.mobile) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "All fields are required!",
        confirmButtonColor: "#2bb673",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:8080/doctor/profile",
        {
          name: form.name,
          speciality: form.speciality,
          mobile: form.mobile,
          consultationDuration: form.consultationDuration,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Profile updated successfully");

      setTimeout(() => {
        navigate("/doctor/profile/view");
      }, 1200);

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Unable to update profile!",
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

          {/* 🔹 Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">✏️ Update Profile</h4>
              <p className="text-muted mb-0">
                Update your professional information carefully.
              </p>
            </div>

            {/* 🔹 Actions */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/doctor/profile/view")}
              >
                ⬅ Back
              </button>

              <button
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "💾 Save Changes"}
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* 🔹 Page Loading */}
          {pageLoading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">Loading profile...</p>
            </div>
          )}

          {/* 🔹 Form */}
          {!pageLoading && (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Speciality</label>
                <input
                  type="text"
                  className="form-control"
                  name="speciality"
                  value={form.speciality}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">Mobile Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Consultation Duration (mins)
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="consultationDuration"
                  value={form.consultationDuration}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default DoctorUpdateProfile;
