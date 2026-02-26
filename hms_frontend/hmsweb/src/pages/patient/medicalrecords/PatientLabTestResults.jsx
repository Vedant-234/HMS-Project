import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function PatientLabTestResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/labtest-result/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Lab Test Results",
        text:
          err.response?.data?.message ||
          "Unable to fetch lab test results",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">🧪 Lab Test Results</h4>
              <p className="text-muted mb-0">
                View your completed lab test results
              </p>
            </div>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/patient")}
            >
              ⬅ Back to Dashboard
            </button>
          </div>

          <hr />

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" />
              <p className="mt-2 text-muted">
                Loading lab test results...
              </p>
            </div>
          )}

          {/* Results */}
          {!loading && (
            <>
              {results.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No lab test results available
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Test Name</th>
                        <th>Result Date</th>
                        <th>Findings</th>
                        <th>Fees (₹)</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((r, index) => (
                        <tr key={index}>
                          <td className="fw-semibold">{r.testName}</td>
                          <td>
                            {new Date(r.resultDate).toLocaleDateString()}
                          </td>
                          <td>{r.findings}</td>
                          <td>₹ {r.labTestFees}</td>
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

export default PatientLabTestResults;
