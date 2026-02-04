import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewLabTestResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/labtest-result/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Lab Results",
        text:
          err.response?.data?.message ||
          "Something went wrong while fetching lab test results",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  // 🔍 Search filter
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      const text = search.toLowerCase();
      return (
        r.testName?.toLowerCase().includes(text) ||
        r.findings?.toLowerCase().includes(text) ||
        String(r.recordId).includes(text)
      );
    });
  }, [results, search]);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
            <div>
              <h4 className="fw-bold mb-1">🧪 Lab Test Results</h4>
              <p className="text-muted mb-0">
                View all laboratory test results
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

          {/* Search */}
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by test name, findings or record id"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-8 text-end mt-2 mt-md-0">
              <span className="badge bg-success-subtle text-success border border-success rounded-pill px-3 py-2">
                Total Results: <b>{filteredResults.length}</b>
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">Loading lab test results...</p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              {filteredResults.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No lab test results found
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Lab ID</th>
                        <th>Test Name</th>
                        <th>Record ID</th>
                        <th>Result Date</th>
                        <th>Findings</th>
                        <th>Fees (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredResults.map((r) => (
                        <tr key={r.labid}>
                          <td className="fw-semibold">{r.labid}</td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {r.testName}
                            </span>
                          </td>
                          <td>{r.recordId}</td>
                          <td>
                            {new Date(r.resultDate).toLocaleDateString()}
                          </td>
                          <td>{r.findings}</td>
                          <td className="fw-semibold">₹ {r.labTestFees}</td>
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

export default ViewLabTestResults;
