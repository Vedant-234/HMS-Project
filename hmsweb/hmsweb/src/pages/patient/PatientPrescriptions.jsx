import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

/* ------------------ Dosage Formatter ------------------ */
const parseDosage = (dosage) => {
  if (!dosage) return null;

  // Example: "1-0-1 after food"
  const parts = dosage.split(" ");
  const timing = parts[0]; // 1-0-1
  const food = parts.slice(1).join(" "); // after food

  const [morning, afternoon, night] = timing.split("-");

  return {
    morning,
    afternoon,
    night,
    food,
  };
};

function PatientPrescriptions() {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/prescription/my",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPrescriptions(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Prescriptions",
        text:
          err.response?.data?.message ||
          "Unable to fetch prescriptions",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">💊 My Prescriptions</h4>
              <p className="text-muted mb-0">
                View your prescribed medicines in an easy format
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
                Loading prescriptions...
              </p>
            </div>
          )}

          {/* Prescriptions */}
          {!loading && (
            <>
              {prescriptions.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No prescriptions found
                </div>
              ) : (
                prescriptions.map((p) => (
                  <div
                    key={p.prescriptionid}
                    className="card mb-4 border-0 shadow-sm rounded-4"
                  >
                    <div className="card-body">
                      {/* Prescription Header */}
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="fw-bold mb-0">
                          👨‍⚕️ {p.doctorName}
                        </h5>

                        <span className="badge bg-success-subtle text-success border border-success">
                          💰 Total ₹ {p.totalMedicineFees}
                        </span>
                      </div>

                      <p className="text-muted mb-3">
                        📝 {p.notes}
                      </p>

                      {/* Medicines Table */}
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead className="table-success">
                            <tr>
                              <th>Medicine</th>
                              <th>How to Take</th>
                              <th>Duration</th>
                              <th>Qty</th>
                              <th>Unit ₹</th>
                              <th>Total ₹</th>
                            </tr>
                          </thead>

                          <tbody>
                            {p.medicines.map((m, idx) => {
                              const d = parseDosage(m.dosage);

                              return (
                                <tr key={idx}>
                                  <td className="fw-semibold">
                                    {m.medicineName}
                                  </td>

                                  {/* ✅ Beautiful Dosage */}
                                  <td>
                                    {d ? (
                                      <div className="small">
                                        <span className="badge bg-success me-1">
                                          🌅 {d.morning}
                                        </span>
                                        <span className="badge bg-warning text-dark me-1">
                                          🌞 {d.afternoon}
                                        </span>
                                        <span className="badge bg-primary">
                                          🌙 {d.night}
                                        </span>
                                        <div className="text-muted mt-1">
                                          🍽️ {d.food}
                                        </div>
                                      </div>
                                    ) : (
                                      m.dosage
                                    )}
                                  </td>

                                  <td>{m.duration}</td>
                                  <td>{m.quantity}</td>
                                  <td>₹ {m.unitPrice}</td>
                                  <td className="fw-bold">
                                    ₹ {m.lineTotal}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientPrescriptions;

