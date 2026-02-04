import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  // ✅ Fetch my appointments
  const fetchMyAppointments = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/appointments/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data?.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: err.response?.data?.message || "Failed to fetch appointments!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
    // eslint-disable-next-line
  }, []);

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    const confirm = await Swal.fire({
      title: "Cancel Appointment?",
      text: "You can cancel only scheduled future appointments (12 hours before).",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#198754",
      confirmButtonText: "Yes, Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setCancelLoadingId(appointmentId);

      await axios.put(
        `http://localhost:8080/appointments/cancel/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Appointment cancelled successfully!");
      fetchMyAppointments();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Cancel Failed ❌",
        text:
          err.response?.data?.message ||
          "Appointment cannot be cancelled!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setCancelLoadingId(null);
    }
  };

  // ✅ Helpers
  const now = new Date();

  const isPast = (dateStr) => {
    return new Date(dateStr) < now;
  };

  // ✅ Tabs Data
  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(
        (a) => a.status === "SCHEDULED" && !isPast(a.scheduledAt)
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)); // ascending
  }, [appointments]);

  const previousAppointments = useMemo(() => {
    return appointments
      .filter(
        (a) =>
          a.status !== "CANCELLED" &&
          (isPast(a.scheduledAt) ||
            a.status === "ATTENDED" ||
            a.status === "IN_PROGRESS")
      )
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt)); // descending
  }, [appointments]);

  const cancelledAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.status === "CANCELLED")
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  }, [appointments]);

  const getTabData = () => {
    if (activeTab === "upcoming") return upcomingAppointments;
    if (activeTab === "previous") return previousAppointments;
    return cancelledAppointments;
  };

  const currentList = getTabData();

  const getStatusBadge = (status) => {
    if (status === "SCHEDULED") return "badge bg-success";
    if (status === "CANCELLED") return "badge bg-danger";
    if (status === "ATTENDED") return "badge bg-primary";
    if (status === "IN_PROGRESS") return "badge bg-warning text-dark";
    return "badge bg-secondary";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">📅 My Appointments</h4>
              <p className="text-muted mb-0">
                View your upcoming, previous and cancelled appointments.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/patient")}
              >
                ⬅ Back
              </button>

              <button className="btn btn-success" onClick={fetchMyAppointments}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Tabs */}
          <div className="d-flex flex-wrap gap-2 mb-4">
            <button
              className={`btn ${
                activeTab === "upcoming"
                  ? "btn-success"
                  : "btn-outline-success"
              } rounded-pill`}
              onClick={() => setActiveTab("upcoming")}
            >
              ✅ Upcoming ({upcomingAppointments.length})
            </button>

            <button
              className={`btn ${
                activeTab === "previous"
                  ? "btn-primary"
                  : "btn-outline-primary"
              } rounded-pill`}
              onClick={() => setActiveTab("previous")}
            >
              🕒 Previous ({previousAppointments.length})
            </button>

            <button
              className={`btn ${
                activeTab === "cancelled"
                  ? "btn-danger"
                  : "btn-outline-danger"
              } rounded-pill`}
              onClick={() => setActiveTab("cancelled")}
            >
              ❌ Cancelled ({cancelledAppointments.length})
            </button>
          </div>

          {/* ✅ Loading */}
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="text-muted mt-2">Loading appointments...</p>
            </div>
          ) : currentList.length === 0 ? (
            <div className="alert alert-warning rounded-4">
              ⚠️ No appointments found in this section.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>ID</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentList.map((a) => (
                    <tr key={a.appointmentId}>
                      <td className="fw-semibold">{a.appointmentId}</td>
                      <td>{a.doctorName}</td>
                      <td>
                        {new Date(a.scheduledAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td>
                        <span className={getStatusBadge(a.status)}>
                          {a.status}
                        </span>
                      </td>

                      <td className="text-center">
                        {activeTab === "upcoming" ? (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            disabled={cancelLoadingId === a.appointmentId}
                            onClick={() => cancelAppointment(a.appointmentId)}
                          >
                            {cancelLoadingId === a.appointmentId
                              ? "Cancelling..."
                              : "Cancel"}
                          </button>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Patient Portal
          </p>
        </div>
      </div>
    </div>
  );
}

export default MyAppointments;
