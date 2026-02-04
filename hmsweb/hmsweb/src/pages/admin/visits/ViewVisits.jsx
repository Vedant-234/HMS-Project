import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ViewVisits() {
  const navigate = useNavigate();

  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState("today_attended");
  const [search, setSearch] = useState("");
  const [updateLoadingId, setUpdateLoadingId] = useState(null);

  const statuses = ["ATTENDED", "CANCELLED", "IN_PROGRESS"];

  const onlyDate = (iso) => iso?.split("T")[0];
  const todayStr = new Date().toISOString().split("T")[0];

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:8080/visits/manager/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setVisits(res.data?.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Visits",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  // ✅ Update Visit Status API
  const updateVisitStatus = async (visitId, newStatus) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Update Visit Status?",
      html: `Change Visit ID <b>${visitId}</b> status to <b>${newStatus}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      setUpdateLoadingId(visitId);
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `http://localhost:8080/visits/${visitId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Visit status updated successfully!");

      // ✅ update UI instantly
      setVisits((prev) =>
        prev.map((v) =>
          v.visitId === visitId ? { ...v, status: res.data?.data?.status } : v
        )
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setUpdateLoadingId(null);
    }
  };

  // ✅ Counts
  const todayAttendedCount = useMemo(() => {
    return visits.filter(
      (v) => onlyDate(v.visitDate) === todayStr && v.status === "ATTENDED"
    ).length;
  }, [visits, todayStr]);

  const todayCancelledCount = useMemo(() => {
    return visits.filter(
      (v) => onlyDate(v.visitDate) === todayStr && v.status === "CANCELLED"
    ).length;
  }, [visits, todayStr]);

  const totalAttendedCount = useMemo(() => {
    return visits.filter((v) => v.status === "ATTENDED").length;
  }, [visits]);

  // ✅ Filtered Data
  const filteredVisits = useMemo(() => {
    let list = [...visits];

    if (tab === "today_attended") {
      list = list.filter(
        (v) => onlyDate(v.visitDate) === todayStr && v.status === "ATTENDED"
      );
    }

    if (tab === "today_cancelled") {
      list = list.filter(
        (v) => onlyDate(v.visitDate) === todayStr && v.status === "CANCELLED"
      );
    }

    if (tab === "total_attended") {
      list = list.filter((v) => v.status === "ATTENDED");
    }

    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.patientName?.toLowerCase().includes(t) ||
          v.doctorName?.toLowerCase().includes(t) ||
          v.visitType?.toLowerCase().includes(t) ||
          v.reason?.toLowerCase().includes(t) ||
          String(v.visitId).includes(t)
      );
    }

    // ✅ sort ascending
    list.sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate));

    return list;
  }, [visits, tab, search, todayStr]);

  const statusBadge = (st) => {
    if (st === "ATTENDED") return "bg-success";
    if (st === "CANCELLED") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">👁️ View Visits</h4>
              <p className="text-muted mb-0">
                Manager can view and update visit status.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back
              </button>

              <button className="btn btn-success" onClick={fetchVisits}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              className={`btn ${
                tab === "today_attended"
                  ? "btn-success"
                  : "btn-outline-success"
              }`}
              onClick={() => setTab("today_attended")}
            >
              ✅ Today ATTENDED ({todayAttendedCount})
            </button>

            <button
              className={`btn ${
                tab === "today_cancelled"
                  ? "btn-danger"
                  : "btn-outline-danger"
              }`}
              onClick={() => setTab("today_cancelled")}
            >
              ❌ Today CANCELLED ({todayCancelledCount})
            </button>

            <button
              className={`btn ${
                tab === "total_attended"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setTab("total_attended")}
            >
              📊 Total ATTENDED ({totalAttendedCount})
            </button>
          </div>

          {/* Search */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">🔎</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by patient/doctor/reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 d-flex justify-content-md-end">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                Showing: <b>{filteredVisits.length}</b>
              </span>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">Fetching visits...</p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              {filteredVisits.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No visits found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Visit ID</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Appointment</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Update</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredVisits.map((v) => (
                        <tr key={v.visitId}>
                          <td className="fw-semibold">{v.visitId}</td>
                          <td>{v.visitDate.replace("T", " ")}</td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {v.visitType}
                            </span>
                          </td>
                          <td>{v.patientName}</td>
                          <td>{v.doctorName}</td>
                          <td>{v.appointmentId}</td>
                          <td>{v.reason}</td>
                          <td>
                            <span className={`badge ${statusBadge(v.status)}`}>
                              {v.status}
                            </span>
                          </td>

                          {/* ✅ Update Status Dropdown */}
                          <td style={{ minWidth: "180px" }}>
                            <select
                              className="form-select form-select-sm"
                              value={v.status}
                              disabled={updateLoadingId === v.visitId}
                              onChange={(e) =>
                                updateVisitStatus(v.visitId, e.target.value)
                              }
                            >
                              {statuses.map((st) => (
                                <option value={st} key={st}>
                                  {st}
                                </option>
                              ))}
                            </select>

                            {updateLoadingId === v.visitId && (
                              <small className="text-muted">
                                Updating...
                              </small>
                            )}
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

export default ViewVisits;
