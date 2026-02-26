import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function MyMedicalRecords() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/patient-medical-record/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecords(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Records ❌",
        text: err.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">📄 My Medical Records</h4>
              <p className="text-muted mb-0">
                View your diagnosis, last visit details and treatment plan.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/patient")}
              >
                ⬅ Back
              </button>

              <button className="btn btn-success" onClick={fetchRecords}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Loading */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="text-muted mt-2">Loading medical records...</p>
            </div>
          ) : records.length === 0 ? (
            <div className="alert alert-warning rounded-4">
              ⚠️ No medical records found for your profile.
            </div>
          ) : (
            <div className="row g-4">
              {records.map((rec) => (
                <div className="col-md-6" key={rec.recordid}>
                  <div className="card border-0 shadow-sm rounded-4 h-100">
                    <div className="card-body p-4">
                      {/* ✅ Title Row */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="fw-bold mb-0">
                          🧾 Record #{rec.recordid}
                        </h5>

                        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-2">
                          ✅ Active
                        </span>
                      </div>

                      {/* ✅ Last Visit */}
                      <p className="mb-2">
                        <span className="fw-semibold">📅 Last Visit: </span>
                        <span className="text-muted">
                          {new Date(rec.lastVisit).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </p>

                      {/* ✅ Diagnosis */}
                      <p className="mb-2">
                        <span className="fw-semibold">🩺 Diagnosis: </span>
                        <span className="text-dark">{rec.diagnosis}</span>
                      </p>

                      {/* ✅ Treatment Plan */}
                      <p className="mb-0">
                        <span className="fw-semibold">💊 Treatment Plan: </span>
                        <span className="text-dark">
                          {rec.treatmentPlan}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Patient Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyMedicalRecords;
