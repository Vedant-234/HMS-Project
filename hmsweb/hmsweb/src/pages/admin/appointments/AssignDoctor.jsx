import { useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AssignDoctor() {
  const navigate = useNavigate();

  const [appointmentId, setAppointmentId] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignLoadingId, setAssignLoadingId] = useState(null);
  const [search, setSearch] = useState("");

  // ✅ Fetch Available Doctors (same speciality + free at scheduled time)
  const fetchAvailableDoctors = async () => {
    if (!appointmentId) {
      Swal.fire({
        icon: "warning",
        title: "Appointment ID Required",
        text: "Please enter appointment ID first!",
        confirmButtonColor: "#198754",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/appointments/manager/available-doctors/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctors(res.data?.data || []);

      if ((res.data?.data || []).length === 0) {
        toast.info("No available doctors found for this appointment.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Fetch Doctors",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Assign Selected Doctor to Appointment
  const assignDoctor = async (newDoctorId, newDoctorName) => {
    const result = await Swal.fire({
      icon: "question",
      title: "Assign Doctor?",
      html: `Assign <b>${newDoctorName}</b> to Appointment <b>${appointmentId}</b>?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Assign",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#dc3545",
    });

    if (!result.isConfirmed) return;

    try {
      setAssignLoadingId(newDoctorId);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:8080/appointments/manager/assign-doctor",
        {
          appointmentId: Number(appointmentId),
          newDoctorId: Number(newDoctorId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(res.data?.message || "✅ Doctor assigned successfully");

      Swal.fire({
        icon: "success",
        title: "Doctor Assigned ✅",
        html: `
          <p><b>Appointment ID:</b> ${res.data?.data?.appointmentId}</p>
          <p><b>Old Doctor:</b> ${res.data?.data?.oldDoctorName}</p>
          <p><b>New Doctor:</b> ${res.data?.data?.newDoctorName}</p>
        `,
        confirmButtonColor: "#198754",
      });

      // ✅ refresh available doctors list again
      fetchAvailableDoctors();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Assign Failed 😓",
        text: error.response?.data?.message || "Unable to assign doctor.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setAssignLoadingId(null);
    }
  };

  // ✅ Search filter
  const filteredDoctors = useMemo(() => {
    if (!search.trim()) return doctors;
    const t = search.toLowerCase();

    return doctors.filter(
      (d) =>
        d.doctorName?.toLowerCase().includes(t) ||
        d.speciality?.toLowerCase().includes(t) ||
        d.mobile?.includes(t) ||
        String(d.doctorId).includes(t)
    );
  }, [doctors, search]);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">🔁 Assign / Reschedule Doctor</h4>
              <p className="text-muted mb-0">
                View available doctors and assign new doctor for the appointment.
              </p>
            </div>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/admin")}
            >
              ⬅ Back to Dashboard
            </button>
          </div>

          <hr className="my-4" />

          {/* ✅ Appointment Input */}
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Appointment ID</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter Appointment ID (Eg: 7)"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <button
                className="btn btn-success w-100"
                onClick={fetchAvailableDoctors}
                disabled={loading}
              >
                {loading ? "Fetching..." : "✅ View Available Doctors"}
              </button>
            </div>

            <div className="col-md-4 d-flex justify-content-md-end">
              <span className="badge bg-success-subtle text-success border border-success px-3 py-2 rounded-pill">
                Available: <b>{filteredDoctors.length}</b>
              </span>
            </div>
          </div>

          {/* ✅ Search */}
          <div className="row g-3 mt-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">🔎</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by doctor name / mobile / speciality..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ✅ Table */}
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success"></div>
                <p className="mt-2 text-muted">Loading doctors...</p>
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="alert alert-warning rounded-4">
                ⚠️ No available doctors found. Enter correct appointment ID.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>ID</th>
                      <th>Doctor Name</th>
                      <th>Speciality</th>
                      <th>Mobile</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredDoctors.map((d) => (
                      <tr key={d.doctorId}>
                        <td className="fw-semibold">{d.doctorId}</td>
                        <td>{d.doctorName}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {d.speciality}
                          </span>
                        </td>
                        <td>{d.mobile}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => assignDoctor(d.doctorId, d.doctorName)}
                            disabled={assignLoadingId === d.doctorId}
                          >
                            {assignLoadingId === d.doctorId
                              ? "Assigning..."
                              : "✅ Assign"}
                          </button>
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
    </div>
  );
}

export default AssignDoctor;
