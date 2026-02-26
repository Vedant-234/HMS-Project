import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function UpdateAppointment() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

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
    } catch {
      Swal.fire("Error", "Failed to fetch appointments", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const isToday = (dateStr) => {
    const d = new Date(dateStr);
    const t = new Date();
    return (
      d.getFullYear() === t.getFullYear() &&
      d.getMonth() === t.getMonth() &&
      d.getDate() === t.getDate()
    );
  };

  const todayAppointments = appointments.filter(
    (a) =>
      isToday(a.scheduledAt) &&
      a.status === "IN_PROGRESS"
  );

  const completeAppointment = async (id) => {
    const confirm = await Swal.fire({
      title: "Complete appointment?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/appointments/complete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire(
        "Success",
        "Appointment marked as ATTENDED",
        "success"
      );

      fetchAppointments(); // refresh list
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message ||
          "Cannot complete appointment",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">🩺 Today’s Appointments</h4>

        <div className="d-flex gap-2">
          {/* Refresh Button */}
          <button
            className="btn btn-outline-success"
            onClick={fetchAppointments}
            disabled={loading}
          >
            🔄 Refresh
          </button>

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

      {!loading && todayAppointments.length === 0 && (
        <div className="alert alert-warning">
          No appointments to complete today
        </div>
      )}

      {!loading && todayAppointments.length > 0 && (
        <table className="table table-hover">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Patient</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {todayAppointments.map((a) => (
              <tr key={a.appointmentId}>
                <td>{a.appointmentId}</td>
                <td>{a.patientName}</td>
                <td>
                  {new Date(a.scheduledAt).toLocaleTimeString()}
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() =>
                      completeAppointment(a.appointmentId)
                    }
                  >
                    ✔ Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UpdateAppointment;
