import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

function UpdatePatientMedicalRecord() {
  const navigate = useNavigate();
  const { recordId } = useParams();

  const [diagnosis, setDiagnosis] = useState("");
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!diagnosis || !treatmentPlan) {
      Swal.fire("Warning", "Please fill all required fields", "warning");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/patient-medical-record/${recordId}`,
        {
          diagnosis,
          treatmentPlan
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire(
        "Success",
        "Medical record updated successfully",
        "success"
      ).then(() => {
        navigate("/doctor/medical-records/view");
      });

    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to update medical record",
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
              <h4 className="fw-bold mb-1">✏️ Update Medical Record</h4>
              <p className="text-muted mb-0">
                Update diagnosis and treatment details
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

          {/* Record ID (Read-only) */}
          <label className="form-label fw-semibold">Record ID</label>
          <input
            type="text"
            className="form-control mb-3"
            value={recordId}
            disabled
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
              onClick={handleUpdate}
            >
              {loading ? "Updating..." : "💾 Update Record"}
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

export default UpdatePatientMedicalRecord;
