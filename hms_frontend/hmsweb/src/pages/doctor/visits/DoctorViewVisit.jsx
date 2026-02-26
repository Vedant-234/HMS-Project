import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorViewVisit() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const STATUSES = ["ATTENDED", "CANCELLED", "NO_SHOW"];

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/visits/doctor/my-visits",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const visitList = res.data?.data || [];

      // ✅ SORT: Today first, then latest
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const sortedVisits = visitList.sort((a, b) => {
        const dateA = new Date(a.visitDate);
        const dateB = new Date(b.visitDate);

        const isTodayA = dateA >= today;
        const isTodayB = dateB >= today;

        if (isTodayA && !isTodayB) return -1;
        if (!isTodayA && isTodayB) return 1;

        return dateB - dateA;
      });

      setVisits(sortedVisits);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to fetch visits",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const filteredVisits = visits.filter((v) =>
    v.patientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateVisitStatus = async (visitId, newStatus) => {
    const confirm = await Swal.fire({
      icon: "question",
      title: "Update Visit Status?",
      html: `Change status to <b>${newStatus}</b>?`,
      showCancelButton: true,
      confirmButtonColor: "#198754",
      cancelButtonColor: "#dc3545",
      confirmButtonText: "Yes, Update",
    });

    if (!confirm.isConfirmed) return;

    try {
      setUpdatingId(visitId);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:8080/visits/${visitId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Visit status updated", "success");

      setVisits((prev) =>
        prev.map((v) =>
          v.visitId === visitId ? { ...v, status: res.data.data.status } : v
        )
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update status",
        "error"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusBadge = (status) => {
    if (status === "ATTENDED") return "bg-success";
    if (status === "CANCELLED") return "bg-danger";
    if (status === "NO_SHOW") return "bg-warning text-dark";
    return "bg-secondary";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">

          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="fw-bold mb-1">🩺 My Visits</h4>
              <p className="text-muted mb-0">Visits created by you</p>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-success" onClick={fetchVisits}>
                🔄 Refresh
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/doctor")}
              >
                ⬅ Back
              </button>
            </div>
          </div>

          {/* SEARCH */}
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="🔍 Search by patient name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <hr />

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
            </div>
          )}

          {!loading && filteredVisits.length === 0 && (
            <div className="alert alert-warning rounded-4">
              ⚠️ No visits found {searchTerm && `for "${searchTerm}"`}
            </div>
          )}

          {!loading && filteredVisits.length > 0 && (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Visit ID</th>
                    <th>Patient</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVisits.map((v) => (
                    <tr key={v.visitId}>
                      <td className="fw-semibold">{v.visitId}</td>
                      <td>{v.patientName}</td>
                      <td>
                        {new Date(v.visitDate).toDateString() ===
                          new Date().toDateString() && (
                          <span className="badge bg-danger me-2">TODAY</span>
                        )}
                        {new Date(v.visitDate).toLocaleString()}
                      </td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {v.visitType}
                        </span>
                      </td>
                      <td>{v.reason}</td>
                      <td>
                        <span className={`badge ${statusBadge(v.status)}`}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ minWidth: "160px" }}>
                        <select
                          className="form-select form-select-sm"
                          value={v.status}
                          disabled={updatingId === v.visitId}
                          onChange={(e) =>
                            updateVisitStatus(v.visitId, e.target.value)
                          }
                        >
                          {STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                        {updatingId === v.visitId && (
                          <small className="text-muted">Updating...</small>
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

export default DoctorViewVisit;
