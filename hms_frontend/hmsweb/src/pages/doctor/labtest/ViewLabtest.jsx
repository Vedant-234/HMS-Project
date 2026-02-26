import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewLabtest() {
  const navigate = useNavigate();

  const [labtests, setLabtests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLabtests = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/labtest", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      setLabtests(res.data || []);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch lab tests",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabtests();
  }, []);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">🧪 Lab Tests</h4>
              <p className="text-muted mb-0">
                Available laboratory tests and charges
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={fetchLabtests}
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
          {!loading && labtests.length === 0 && (
            <div className="alert alert-warning rounded-4">
              ⚠️ No lab tests available.
            </div>
          )}

          {/* TABLE */}
          {!loading && labtests.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Test Name</th>
                    <th>Description</th>
                    <th>Fees (₹)</th>
                    <th>Image</th>
                  </tr>
                </thead>

                <tbody>
                  {labtests.map((test) => (
                    <tr key={test.testid}>
                      <td className="fw-semibold">{test.testid}</td>
                      <td>{test.testName}</td>
                      <td>{test.description}</td>
                      <td>₹ {test.labTestFees}</td>
                      <td>
                        {test.image ? (
                          <img
                            src={`http://localhost:8080/uploads/${test.image}`}
                            alt={test.testName}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
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

export default ViewLabtest;
