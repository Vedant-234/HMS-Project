import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function CreatePatientMedicalRecord() {
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!patientId || !diagnosis || !treatmentPlan) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/patient-medical-record",
        {
          patientId: Number(patientId),
          diagnosis,
          treatmentPlan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire(
        "Success",
        "Patient medical record created successfully",
        "success"
      ).then(() => {
        navigate("/doctor/medical-records/view");
      });
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to create patient medical record",
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

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">➕ Create Medical Record</h4>
              <p className="text-muted mb-0">
                Add diagnosis and treatment plan for the patient
              </p>
            </div>

            <button
              className="btn btn-outline-secondary"
              onClick={() => navigate(-1)}
            >
              ⬅ Back
            </button>
          </div>

          <hr />

          {/* Patient ID */}
          <label className="form-label fw-semibold">Patient ID *</label>
          <input
            type="number"
            className="form-control mb-3"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            placeholder="Enter patient ID"
          />

          {/* Diagnosis */}
          <label className="form-label fw-semibold">Diagnosis *</label>
          <textarea
            className="form-control mb-3"
            rows="2"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Enter diagnosis"
          />

          {/* Treatment Plan */}
          <label className="form-label fw-semibold">Treatment Plan *</label>
          <textarea
            className="form-control mb-4"
            rows="3"
            value={treatmentPlan}
            onChange={(e) => setTreatmentPlan(e.target.value)}
            placeholder="Enter treatment plan"
          />

          {/* ACTION BUTTONS */}
          <div className="d-flex gap-2">
            <button
              className="btn btn-success"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Saving..." : "💾 Save Record"}
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={() => navigate("/doctor/medical-records/view")}
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CreatePatientMedicalRecord;
