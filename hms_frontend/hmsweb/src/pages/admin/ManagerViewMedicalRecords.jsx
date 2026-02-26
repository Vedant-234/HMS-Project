import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ManagerViewMedicalRecords() {
  const navigate = useNavigate();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/patient-medical-record/manager",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setRecords(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Medical Records",
        text:
          err.response?.data?.message ||
          "Something went wrong while fetching medical records",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 🔍 Search by diagnosis / treatment
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const text = search.toLowerCase();
      return (
        r.diagnosis?.toLowerCase().includes(text) ||
        r.treatmentPlan?.toLowerCase().includes(text) ||
        String(r.recordid).includes(text)
      );
    });
  }, [records, search]);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h4 className="fw-bold mb-1">📑 Patient Medical Records</h4>
              <p className="text-muted mb-0">
                View all patients medical history
              </p>
            </div>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/admin")}
            >
              ⬅ Back to Dashboard
            </button>
          </div>

          <hr />

          {/* Search + Count */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search diagnosis or treatment"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-8 text-end mt-2 mt-md-0">
              <span className="badge bg-primary-subtle text-primary border border-primary rounded-pill px-3 py-2">
                Total Records: <b>{filteredRecords.length}</b>
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">
                Loading medical records...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              {filteredRecords.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No medical records found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Record ID</th>
                        <th>Diagnosis</th>
                        <th>Treatment Plan</th>
                        <th>Last Visit</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map((r) => (
                        <tr key={r.recordid}>
                          <td className="fw-semibold">{r.recordid}</td>
                          <td>{r.diagnosis}</td>
                          <td>{r.treatmentPlan}</td>
                          <td>
                            {new Date(r.lastVisit).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManagerViewMedicalRecords;
