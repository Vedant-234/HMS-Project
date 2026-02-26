import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewLabtestResult() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/labtest-result/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResults(res.data || []);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to fetch lab test results",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">🧪 Lab Test Results</h4>
              <p className="text-muted mb-0">
                View all laboratory test results
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={fetchResults}
              >
                🔄 Refresh
              </button>

              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate(-1)}
              >
                ⬅ Back
              </button>
            </div>
          </div>

          <hr />

          {/* LOADING */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
            </div>
          )}

          {/* EMPTY */}
          {!loading && results.length === 0 && (
            <div className="alert alert-warning rounded-4">
              ⚠️ No lab test results found.
            </div>
          )}

          {/* TABLE */}
          {!loading && results.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Lab ID</th>
                    <th>Test Name</th>
                    <th>Record ID</th>
                    <th>Findings</th>
                    <th>Fees (₹)</th>
                    <th>Result Date</th>
                  </tr>
                </thead>

                <tbody>
                  {results.map((r) => (
                    <tr key={r.labid}>
                      <td className="fw-semibold">{r.labid}</td>
                      <td>{r.testName}</td>
                      <td>{r.recordId}</td>
                      <td style={{ maxWidth: "350px" }}>
                        {r.findings}
                      </td>
                      <td>₹ {r.labTestFees}</td>
                      <td>{r.resultDate}</td>
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

export default ViewLabtestResult;
