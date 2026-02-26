import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function MedicineHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const [medicineId, setMedicineId] = useState("");
  const [search, setSearch] = useState("");
  const [filterReason, setFilterReason] = useState("ALL");

  // ✅ Fetch All History
  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/manager/medicine/history",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHistory(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load History",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch History By Medicine ID
  const fetchHistoryById = async () => {
    if (!medicineId.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Enter Medicine ID",
        text: "Please enter medicine ID to fetch history.",
        confirmButtonColor: "#ffc107",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/manager/medicine/${medicineId}/history`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setHistory(res.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "No History Found",
        text: error.response?.data?.message || "No history available for this ID",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load all history by default
  useEffect(() => {
    fetchAllHistory();
  }, []);

  // ✅ Counts
  const addedCount = useMemo(
    () => history.filter((h) => h.reason === "ADDED").length,
    [history]
  );

  const deletedCount = useMemo(
    () => history.filter((h) => h.reason === "DELETED").length,
    [history]
  );

  // ✅ Filtered List
  const filteredHistory = useMemo(() => {
    let list = [...history];

    // filter by reason
    if (filterReason !== "ALL") {
      list = list.filter((h) => h.reason === filterReason);
    }

    // search filter
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (h) =>
          String(h.id).includes(t) ||
          String(h.medicineId).includes(t) ||
          h.medicineName?.toLowerCase().includes(t) ||
          h.reason?.toLowerCase().includes(t)
      );
    }

    // sort newest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [history, filterReason, search]);

  const reasonBadge = (reason) => {
    if (reason === "ADDED") return "bg-success";
    if (reason === "DELETED") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">🕒 Medicine Stock History</h4>
              <p className="text-muted mb-0">
                Track medicine stock changes like ADDED / DELETED with full audit
                history.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back to Dashboard
              </button>

              <button className="btn btn-success" onClick={fetchAllHistory}>
                🔄 Refresh All
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Summary Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">Total Records</div>
                    <div className="fs-4 fw-bold">{history.length}</div>
                  </div>
                  <div className="fs-2">📌</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">ADDED</div>
                    <div className="fs-4 fw-bold text-success">
                      {addedCount}
                    </div>
                  </div>
                  <div className="fs-2">✅</div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">DELETED</div>
                    <div className="fs-4 fw-bold text-danger">
                      {deletedCount}
                    </div>
                  </div>
                  <div className="fs-2">❌</div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Filter + Search + View By ID */}
          <div className="row g-3 align-items-end">
            {/* Search */}
            <div className="col-md-4">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text">🔎</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, id, reason..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Reason */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Filter Reason</label>
              <select
                className="form-select"
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="ADDED">ADDED</option>
                <option value="DELETED">DELETED</option>
              </select>
            </div>

            {/* Medicine ID */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">Medicine ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Eg: 6"
                value={medicineId}
                onChange={(e) => setMedicineId(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="col-md-2 d-grid gap-2">
              <button
                className="btn btn-primary"
                onClick={fetchHistoryById}
                disabled={loading}
              >
                📌 View ID
              </button>

              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setMedicineId("");
                  setSearch("");
                  setFilterReason("ALL");
                  fetchAllHistory();
                }}
              >
                📋 View All
              </button>
            </div>
          </div>

          {/* ✅ Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">Loading history...</p>
            </div>
          )}

          {/* ✅ Table */}
          {!loading && (
            <div className="mt-4">
              {filteredHistory.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No history found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>ID</th>
                        <th>Medicine ID</th>
                        <th>Medicine Name</th>
                        <th>Change Qty</th>
                        <th>Final Stock</th>
                        <th>Reason</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredHistory.map((h) => (
                        <tr key={h.id}>
                          <td className="fw-semibold">{h.id}</td>
                          <td>{h.medicineId}</td>
                          <td>{h.medicineName}</td>
                          <td>
                            <span
                              className={`fw-semibold ${
                                h.reason === "ADDED"
                                  ? "text-success"
                                  : "text-danger"
                              }`}
                            >
                              {h.reason === "ADDED" ? "+" : "-"}
                              {h.changeQty}
                            </span>
                          </td>
                          <td>{h.finalStock}</td>
                          <td>
                            <span className={`badge ${reasonBadge(h.reason)}`}>
                              {h.reason}
                            </span>
                          </td>
                          <td>{h.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Medicine History
          </p>
        </div>
      </div>
    </div>
  );
}

export default MedicineHistory;
