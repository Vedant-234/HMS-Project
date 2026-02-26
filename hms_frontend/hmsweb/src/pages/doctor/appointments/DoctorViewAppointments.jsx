import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorViewAppointments() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortType, setSortType] = useState("TODAY");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:8080/appointments/doctor/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAppointments(res.data.data || []);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Failed to fetch appointments",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Sorting Logic
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(a.scheduledAt);
    const dateB = new Date(b.scheduledAt);

    if (sortType === "LATEST") return dateB - dateA;
    if (sortType === "OLDEST") return dateA - dateB;

    // TODAY first
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAToday =
      dateA >= today &&
      dateA < new Date(today.getTime() + 86400000);

    const isBToday =
      dateB >= today &&
      dateB < new Date(today.getTime() + 86400000);

    if (isAToday && !isBToday) return -1;
    if (!isAToday && isBToday) return 1;

    return dateB - dateA;
  });

  const badge = (status) => {
    if (status === "SCHEDULED") return "bg-primary";
    if (status === "IN_PROGRESS") return "bg-warning text-dark";
    if (status === "ATTENDED") return "bg-success";
    return "bg-secondary";
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">📅 Patient Appointments</h4>

        <div className="d-flex gap-2">
          {/* Sort Dropdown */}
          <select
            className="form-select"
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="TODAY">Today First</option>
            <option value="LATEST">Latest First</option>
            <option value="OLDEST">Oldest First</option>
          </select>

          {/* Back Button */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(-1)}
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-success"></div>
        </div>
      )}

      {!loading && sortedAppointments.length === 0 && (
        <div className="alert alert-warning">
          No appointments found
        </div>
      )}

      {!loading && sortedAppointments.length > 0 && (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Patient</th>
                <th>Date & Time</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map((a) => (
                <tr key={a.appointmentId}>
                  <td>{a.appointmentId}</td>
                  <td>
                    {a.patientName}
                    <br />
                    <small className="text-muted">
                      ID: {a.patientId}
                    </small>
                  </td>
                  <td>
                    {new Date(a.scheduledAt).toLocaleString()}
                  </td>
                  <td>{a.notes || "-"}</td>
                  <td>
                    <span className={`badge ${badge(a.status)}`}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DoctorViewAppointments;
