import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {

  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const specialities = [
    "Cardiology",
    "Orthopedics",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "General Physician",
    "ENT",
    "Gynecology",
  ];

  /* ================= MENU ================= */
  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/admin" },

    {
      name: "Manage Doctors",
      icon: "👨‍⚕️",
      children: [
        { name: "Register Doctor", icon: "➕", path: "/admin/doctors/register" },
        { name: "View Doctors", icon: "🔍", path: "/admin/doctors/speciality" },
        { name: "View Doctors by Status", icon: "📌", path: "/admin/doctors/status-list" },
        { name: "Change Status", icon: "🔁", path: "/admin/doctors/status" }
      ],
    },

    {
      name: "Manage Appointments",
      icon: "📅",
      children: [
        { name: "View Appointments", icon: "👁️", path: "/admin/appointments/view" },
        { name: "Reschedule Appointment", icon: "🔁", path: "/admin/appointments/assign-doctor" },
      ],
    },

    {
      name: "Manage Visits",
      icon: "🩺",
      children: [
        { name: "View Visits", icon: "👁️", path: "/admin/visits/view" },
      ],
    },

    {
      name: "Manage Medicines",
      icon: "💊",
      children: [
        { name: "Add Medicine", icon: "➕", path: "/admin/medicines/add" },
        { name: "View Medicines", icon: "📋", path: "/admin/medicines/manage" },
        { name: "Medicine History", icon: "🕒", path: "/admin/medicines/history" },
      ],
    },

    {
      name: "Manage LabTest",
      icon: "🧪",
      children: [
        { name: "Add LabTest", icon: "➕", path: "/admin/labtest/add" },
        { name: "View LabTests", icon: "📋", path: "/admin/labtest/manage" },
        { name: "Add Lab Test Result", icon: "🧾", path: "/admin/labtest/result/add" },
        { name: "View Lab Test Results", icon: "👁️", path: "/admin/labtest/results" },
      ],
    },

    {
        name: "View Medical Records",
        icon: "📑",
        path: "/admin/patient-medical-records",
    }
  ];

  /* ================= FETCH COUNTS ================= */
  useEffect(() => {
    fetchDashboardCounts();
    // eslint-disable-next-line
  }, []);

  const fetchDashboardCounts = async () => {
    try {
      setLoading(true);

      /* -------- TOTAL DOCTORS (ACTIVE) -------- */
      const doctorSet = new Set();

      for (const sp of specialities) {
        const res = await axios.get(
          `http://localhost:8080/doctor?speciality=${sp}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        (res.data?.data || []).forEach((doc) => {
          if (doc.status === "ACTIVE") {
            doctorSet.add(doc.doctorId);
          }
        });
      }

      setTotalDoctors(doctorSet.size);

      /* -------- TOTAL PATIENTS (ATTENDED VISITS ONLY) -------- */
      const patientRes = await axios.get(
      "http://localhost:8080/visits/manager/all",
      { headers: { Authorization: `Bearer ${token}` } }
);

const attendedPatientSet = new Set();

(patientRes.data?.data || []).forEach((visit) => {
  if (visit.status === "ATTENDED") {
    attendedPatientSet.add(visit.patientName); // unique patient
  }
});

setTotalPatients(attendedPatientSet.size);



/* -------- TOTAL APPOINTMENTS (ATTENDED ONLY) -------- */
const appointmentRes = await axios.get(
  "http://localhost:8080/appointments/manager/all",
  { headers: { Authorization: `Bearer ${token}` } }
);

const attendedAppointmentsCount =
  (appointmentRes.data?.data || []).filter(
    (appt) => appt.status === "ATTENDED"
  ).length;

setTotalAppointments(attendedAppointmentsCount);
} catch (err) { console.error("Dashboard count error", err); } finally { setLoading(false); } };


  /* ================= UI ================= */
  return (
    <>
      <Navbar />

      <div className="admin-dashboard">
        <div className="row m-0">

          {/* Sidebar */}
          <div className="col-12 col-md-2 p-0 sidebar-wrapper">
            <Sidebar menu={menu} />
          </div>

          {/* Main Content */}
          <div className="col-12 col-md-10 p-4 content-wrapper">

            {/* Header */}
            <div className="dashboard-header d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h3 className="mb-1 fw-bold">👨‍💼 Manager Dashboard</h3>
                <p className="mb-0 text-white-50">
                  Manage hospital staff, patients and appointments
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mt-4 g-4">

              <div className="col-md-4">
                <div className="stat-card bg-primary">
                  <div>
                    <h6 className="mb-1">Total Doctors</h6>
                    <h3 className="fw-bold mb-0">
                      {loading ? "…" : totalDoctors}
                    </h3>
                  </div>
                  <div className="stat-icon">👨‍⚕️</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-success">
                  <div>
                    <h6 className="mb-1">Total Patients</h6>
                    <h3 className="fw-bold mb-0">
                      {loading ? "…" : totalPatients}
                    </h3>
                  </div>
                  <div className="stat-icon">🧑‍🤝‍🧑</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-warning">
                  <div>
                    <h6 className="mb-1">Appointments</h6>
                    <h3 className="fw-bold mb-0">
                      {loading ? "…" : totalAppointments}
                    </h3>
                  </div>
                  <div className="stat-icon">📅</div>
                </div>
              </div>

            </div>
             {/* Activity + Quick Actions */}
            <div className="row mt-5 g-4">

              {/* Recent Activity */}
              <div className="col-md-7">
                <div className="card shadow-sm rounded-4 border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">📌 Recent Activity</h5>

                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        New Doctor Registered
                        <span className="badge bg-primary">Today</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        Doctor Status Updated
                        <span className="badge bg-success">Yesterday</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        Medicine stock refilled
                        <span className="badge bg-warning text-dark">2 days ago</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="col-md-5">
                <div className="card shadow-sm rounded-4 border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">⚡ Quick Actions</h5>

                    <div className="d-grid gap-3">
                      <button className="btn btn-outline-primary rounded-3"
                      onClick={() => navigate("/admin/doctors/register")}  >
                        ➕ Add Doctor
                      </button>
                      <button className="btn btn-outline-success rounded-3"
                      onClick={() => navigate("/admin/appointments/view")}>
                        📄 View Appointments
                      </button>
                      <button className="btn btn-outline-warning rounded-3"
                      onClick={() => navigate("/admin/medicines/add")}>
                        💊 Add Medicine
                      </button>
                      <button className="btn btn-outline-dark rounded-3"
                      onClick={() => navigate("/admin/doctors/speciality")}>
                        👤 View Doctor By Speciality
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Footer */}
            <p className="text-center text-muted mt-5 small">
              © 2026 HealthCare HMS | Manager Dashboard
            </p>

          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;


