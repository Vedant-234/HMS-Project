import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function ChangeDoctorStatus() {
  const [doctorId, setDoctorId] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loading, setLoading] = useState(false);

  const statuses = ["ACTIVE", "RETIRED", "LEFT", "HOLIDAY"];

  const handleUpdateStatus = async (e) => {
    e.preventDefault();

    if (!doctorId) {
      Swal.fire({
        icon: "warning",
        title: "Doctor ID Required",
        text: "Please enter doctor ID first!",
        confirmButtonColor: "#198754",
      });
      return;
    }

    // ✅ Confirmation Popup
    const result = await Swal.fire({
      icon: "question",
      title: "Confirm Status Change?",
      html: `Change Doctor ID <b>${doctorId}</b> status to <b>${status}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/manager/doctors/${doctorId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

      toast.success(`✅ Doctor status updated to ${status}`);
      setDoctorId("");
      setStatus("ACTIVE");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text:
          error.response?.data?.message ||
          "Something went wrong while updating doctor status!",
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
          <h4 className="fw-bold mb-1">🔁 Change Doctor Status</h4>
          <p className="text-muted mb-4">
            Update doctor status to Active / Holiday / Left / Retired
          </p>

          <form onSubmit={handleUpdateStatus}>
            <div className="row g-3">
              {/* Doctor ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor ID</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter Doctor ID (Eg: 9)"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                />
              </div>

              {/* Status */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statuses.map((s, idx) => (
                    <option key={idx} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 mt-4 fw-semibold rounded-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                "✅ Update Status"
              )}
            </button>
          </form>

          <div className="alert alert-info mt-4 rounded-4">
            💡 Example: Doctor ID <b>9</b> → Status <b>HOLIDAY</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangeDoctorStatus;
