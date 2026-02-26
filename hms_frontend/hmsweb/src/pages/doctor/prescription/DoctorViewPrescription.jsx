import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Convert dosage to readable text
  const formatDosage = (dosage) => {
    const [m, a, n] = dosage.split("-");
    const parts = [];
    if (m === "1") parts.push("Morning");
    if (a === "1") parts.push("Afternoon");
    if (n === "1") parts.push("Night");
    return parts.join(", ");
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/prescription/doctor",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPrescriptions(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to load prescriptions",
        text: "Something went wrong while fetching prescriptions",
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
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">📄 My Prescriptions</h4>
          <p className="text-muted mb-0">
            View prescriptions issued by you
          </p>
        </div>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/doctor")}
        >
          ⬅ Back to Dashboard
        </button>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
          <p className="text-muted mt-2">Loading prescriptions...</p>
        </div>
      )}

      {/* EMPTY */}
      {!loading && prescriptions.length === 0 && (
        <div className="alert alert-warning rounded-4">
          No prescriptions found.
        </div>
      )}

      {/* PRESCRIPTIONS */}
      {!loading &&
        prescriptions.map((p) => (
          <div
            className="card shadow-sm border-0 rounded-4 mb-4"
            key={p.prescriptionid}
          >
            <div className="card-body">
              {/* HEADER */}
              <div className="d-flex justify-content-between flex-wrap mb-3">
                <div>
                  <h6 className="fw-bold mb-1">
                    👤 Patient ID: {p.patientId}
                  </h6>
                  <p className="mb-0 text-muted">
                    🩺 Record ID: {p.recordId}
                  </p>
                </div>

                <span className="badge bg-primary-subtle text-primary px-3 py-2">
                  Prescription #{p.prescriptionid}
                </span>
              </div>

              {/* MEDICINES */}
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.medicines.map((m, idx) => (
                      <tr key={idx}>
                        <td className="fw-semibold">{m.medicineName}</td>
                        <td>{formatDosage(m.dosage)}</td>
                        <td>{m.duration} days</td>
                        <td>{m.quantity}</td>
                        <td>₹{m.unitPrice}</td>
                        <td className="fw-semibold">
                          ₹{m.lineTotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* NOTES */}
              {p.notes && (
                <div className="alert alert-info mt-3 rounded-4">
                  📝 <b>Doctor Notes:</b> {p.notes}
                </div>
              )}

              {/* TOTAL */}
              <div className="text-end mt-2">
                <h6 className="fw-bold text-success">
                  💰 Total Medicine Fees: ₹{p.totalMedicineFees}
                </h6>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default DoctorPrescriptions;
