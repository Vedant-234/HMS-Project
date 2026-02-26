import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewPatientMedicalRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/patient-medical-record/doctor/my-records",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecords(res.data || []);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to fetch medical records",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">📋 My Patient Medical Records</h4>
              <p className="text-muted mb-0">
                View diagnosis and treatment details of your patients
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                ⬅ Back
              </button>

              <button
                className="btn btn-success"
                onClick={() => navigate("/doctor/medical-records/add")}
              >
                ➕ Add Record
              </button>
            </div>
          </div>

          <hr />

          {/* LOADING */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" />
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && records.length === 0 && (
            <div className="text-center text-muted py-4">
              No medical records found.
            </div>
          )}

          {/* TABLE */}
          {!loading && records.length > 0 && (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Record ID</th>
                    <th>Patient</th>
                    <th>Diagnosis</th>
                    <th>Treatment Plan</th>
                    <th>Current Visit</th>
                    <th>Last Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {records.map((r, index) => (
                    <tr key={r.recordId}>
                      {/* Serial Number */}
                      <td>{index + 1}</td>

                      {/* Record ID from backend */}
                      <td className="fw-semibold text-primary">
                        {r.recordId}
                      </td>

                      <td>
                        <div className="fw-semibold">
                          {r.patientName || "—"}
                        </div>
                        <small className="text-muted">
                          ID: {r.patientId}
                        </small>
                      </td>

                      <td>{r.diagnosis}</td>
                      <td>{r.treatmentPlan}</td>

                      <td>
                        {r.currentVisit
                          ? new Date(r.currentVisit).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        {r.lastVisit
                          ? new Date(r.lastVisit).toLocaleString()
                          : "—"}
                      </td>

                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            navigate(
                              `/doctor/medical-records/update/${r.recordId}`
                            )
                          }
                        >
                          ✏️ Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ViewPatientMedicalRecords;
