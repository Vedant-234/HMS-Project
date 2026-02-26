import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function PatientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ---------------- Fetch Invoices ---------------- */
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/invoice/patient",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setInvoices(res.data || []);
    } catch {
      Swal.fire("Error", "Unable to load invoices", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Download Invoice PDF ---------------- */
  const downloadInvoice = async (invoiceId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/invoice/${invoiceId}/pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice_${invoiceId}.pdf`;
      link.click();
    } catch {
      Swal.fire("Download Failed", "Unable to download invoice", "error");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card border-0 shadow-lg rounded-4">
        <div className="card-body p-4">

          {/* Header with Back Button */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3 className="fw-bold mb-1">🧾 My Invoices</h3>
              <p className="text-muted mb-0">
                View & download your hospital bills
              </p>
            </div>

            <div className="d-flex gap-2">
              <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill">
                HMS • Patient Portal
              </span>

              <button
                className="btn btn-outline-secondary rounded-pill px-3"
                onClick={() => navigate("/patient")}
              >
                ⬅ Back to Dashboard
              </button>
            </div>
          </div>

          <hr />

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" />
              <p className="mt-3 text-muted">Fetching invoices...</p>
            </div>
          )}

          {/* Invoice Cards */}
          {!loading && (
            <>
              {invoices.length === 0 ? (
                <div className="alert alert-warning rounded-4 text-center">
                  ⚠️ No invoices available
                </div>
              ) : (
                invoices.map((inv) => (
                  <div
                    key={inv.invoiceId}
                    className="card mb-4 border-0 shadow-sm rounded-4"
                  >
                    <div className="card-body p-4">

                      {/* Invoice Header */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">
                            Invoice #{inv.invoiceId}
                          </h5>
                          <small className="text-muted">
                            📅 {new Date(inv.createdAt).toLocaleString()}
                          </small>
                        </div>

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            inv.paymentStatus === "PAID"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {inv.paymentStatus}
                        </span>
                      </div>

                      {/* Doctor */}
                      <div className="mb-3">
                        <span className="badge bg-info-subtle text-info px-3 py-2 rounded-pill">
                          👨‍⚕️ {inv.doctorName}
                        </span>
                      </div>

                      {/* Fee Breakdown */}
                      <div className="table-responsive">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td>Doctor Consultation</td>
                              <td className="text-end fw-semibold">
                                ₹ {inv.doctorFees}
                              </td>
                            </tr>
                            <tr>
                              <td>Medicines</td>
                              <td className="text-end fw-semibold">
                                ₹ {inv.medicineFees}
                              </td>
                            </tr>
                            <tr>
                              <td>Lab Tests</td>
                              <td className="text-end fw-semibold">
                                ₹ {inv.labtestFees}
                              </td>
                            </tr>
                            <tr className="border-top">
                              <td className="fw-bold">Subtotal</td>
                              <td className="text-end fw-bold">
                                ₹ {inv.subtotal}
                              </td>
                            </tr>
                            <tr>
                              <td>GST</td>
                              <td className="text-end fw-semibold">
                                ₹ {inv.gstAmount}
                              </td>
                            </tr>
                            <tr className="table-success">
                              <td className="fw-bold fs-5">Total Amount</td>
                              <td className="text-end fw-bold fs-5">
                                ₹ {inv.nettotal}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Download */}
                      <div className="d-flex justify-content-end mt-3">
                        <button
                          className="btn btn-outline-primary rounded-pill px-4"
                          onClick={() => downloadInvoice(inv.invoiceId)}
                        >
                          ⬇ Download Invoice PDF
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>

      <p className="text-center text-muted small mt-4">
        © 2026 HealthCare HMS • Secure Billing
      </p>
    </div>
  );
}

export default PatientInvoices;
