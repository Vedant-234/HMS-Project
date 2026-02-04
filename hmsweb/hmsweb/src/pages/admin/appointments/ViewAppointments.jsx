import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function ViewAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ tabs: today | tomorrow | date
  const [tab, setTab] = useState("today");
  const [selectedDate, setSelectedDate] = useState("");
  const [search, setSearch] = useState("");

  // ✅ get yyyy-mm-dd from ISO datetime
  const onlyDate = (iso) => iso?.split("T")[0];

  // ✅ today's date string
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // ✅ tomorrow date string
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  // ✅ Fetch ALL appointments
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/appointments/manager/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Remove CANCELLED appointments here itself
      const list = (res.data?.data || []).filter(
        (a) => a.status !== "CANCELLED"
      );

      setAppointments(list);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Appointments",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Filter based on tab (Today/Tomorrow/Date)
  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    if (tab === "today") {
      list = list.filter((a) => onlyDate(a.scheduledAt) === todayStr);
    }

    if (tab === "tomorrow") {
      list = list.filter((a) => onlyDate(a.scheduledAt) === tomorrowStr);
    }

    if (tab === "date") {
      if (!selectedDate) return [];
      list = list.filter((a) => onlyDate(a.scheduledAt) === selectedDate);
    }

    // ✅ Search filter
    if (search.trim()) {
      const t = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.patientName?.toLowerCase().includes(t) ||
          a.doctorName?.toLowerCase().includes(t) ||
          a.status?.toLowerCase().includes(t) ||
          String(a.appointmentId).includes(t)
      );
    }

    return list.sort(
    (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
    );

  }, [appointments, tab, selectedDate, search, todayStr, tomorrowStr]);

  // ✅ status badge colors
  const statusBadge = (st) => {
    if (st === "ATTENDED") return "bg-success";
    if (st === "IN_PROGRESS") return "bg-warning text-dark";
    return "bg-secondary";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">👁️ View Appointments</h4>
              <p className="text-muted mb-0">
                View today, tomorrow and selected date appointments (Cancelled
                excluded).
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back to Dashboard
              </button>

              <button className="btn btn-success" onClick={fetchAppointments}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-3">
            <button
              className={`btn ${
                tab === "today" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setTab("today")}
            >
              📌 Today
            </button>

            <button
              className={`btn ${
                tab === "tomorrow" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setTab("tomorrow")}
            >
              ⏭️ Tomorrow
            </button>

            <button
              className={`btn ${
                tab === "date" ? "btn-success" : "btn-outline-success"
              }`}
              onClick={() => setTab("date")}
            >
              🗓️ Select Date
            </button>

            {/* ✅ Date Picker Only when tab = date */}
            {tab === "date" && (
              <input
                type="date"
                className="form-control ms-0 ms-md-3"
                style={{ maxWidth: "220px" }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            )}
          </div>

          {/* ✅ Search + Count */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">🔍</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by patient, doctor, status, id..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-6 d-flex justify-content-md-end">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                Showing: <b>{filteredAppointments.length}</b>
              </span>
            </div>
          </div>

          {/* ✅ Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">Fetching appointments...</p>
            </div>
          )}

          {/* ✅ Table */}
          {!loading && (
            <>
              {filteredAppointments.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No appointments found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>ID</th>
                        <th>Scheduled</th>
                        <th>Patient</th>
                        <th>Doctor</th>
                        <th>Notes</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredAppointments.map((a) => (
                        <tr key={a.appointmentId}>
                          <td className="fw-semibold">{a.appointmentId}</td>
                          <td>{a.scheduledAt.replace("T", " ")}</td>
                          <td>{a.patientName}</td>
                          <td>{a.doctorName}</td>
                          <td>{a.notes}</td>
                          <td>
                            <span className={`badge ${statusBadge(a.status)}`}>
                              {a.status}
                            </span>
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

export default ViewAppointments;
