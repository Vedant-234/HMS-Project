import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AddVisitNotes() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [visitType, setVisitType] = useState("OPD");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!patientId || !visitType || !reason) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/visits/doctor/create",
        {
          patientId: Number(patientId),
          appointmentId: appointmentId ? Number(appointmentId) : null,
          visitType,
          reason,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Visit created successfully", "success");
      navigate("/doctor");
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to create visit",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          <h4 className="fw-bold mb-2">📝 Add Visit</h4>
          <p className="text-muted mb-4">
            Create a visit record for the patient
          </p>

          {/* Patient ID */}
          <label className="form-label fw-semibold">Patient ID *</label>
          <input
            type="number"
            className="form-control mb-3"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
          />

          {/* Appointment ID */}
          <label className="form-label fw-semibold">Appointment ID *</label>
          <input
            type="number"
            className="form-control mb-3"
            value={appointmentId}
            onChange={(e) => setAppointmentId(e.target.value)}
            placeholder="Enter appointment ID"
          />

          {/* Visit Type */}
          <label className="form-label fw-semibold">Visit Type *</label>
          <select
            className="form-select mb-3"
            value={visitType}
            onChange={(e) => setVisitType(e.target.value)}
          >
            <option value="OPD">OPD</option>
            <option value="FOLLOWUP">FOLLOW-UP</option>
            <option value="EMERGENCY">EMERGENCY</option>
          </select>

          {/* Reason */}
          <label className="form-label fw-semibold">Reason *</label>
          <textarea
            className="form-control mb-4"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe patient's complaint or reason for visit"
          />

          {/* Buttons */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "💾 Save Visit"}
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate("/doctor")}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddVisitNotes;
