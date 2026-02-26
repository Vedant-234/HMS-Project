import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";



function DoctorDashboard() {
  const navigate = useNavigate();
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [completedVisits, setCompletedVisits] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const isToday = (dateStr) => {
      const d = new Date(dateStr);
      const t = new Date();
      return (
        d.getFullYear() === t.getFullYear() &&
        d.getMonth() === t.getMonth() &&
        d.getDate() === t.getDate()
      );
    };

    // 1️⃣ Today’s appointments
    axios
      .get("http://localhost:8080/appointments/doctor/my", { headers })
      .then((res) => {
        const appointments = res.data.data || [];
        const todayCount = appointments.filter(
          (a) => isToday(a.scheduledAt)
        ).length;
        setTodayAppointments(todayCount);
      });

    // 2️⃣ Completed visits
    axios
      .get("http://localhost:8080/visits/doctor/my-visits", { headers })
      .then((res) => {
        const visits = res.data.data || [];
        const completed = visits.filter(
          (v) => v.status === "ATTENDED"
        ).length;
        setCompletedVisits(completed);
      });

    // 3️⃣ Pending lab reports
    axios
      .get("http://localhost:8080/labtests/doctor", { headers })
      .then((res) => {
        const reports = res.data.data || [];
        const pending = reports.filter(
          (r) => r.status === "PENDING"
        ).length;
        setPendingReports(pending);
      });

  }, []);


  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/doctor" },

    {
      name: "My Appointments",
      icon: "📅",
      children: [
        { name: "View Appointments", icon: "👁️", path: "/doctor/appointment/view" },
        { name: "Today’s Schedule", icon: "🗓️", path: "/doctor/appointment/update" },
      ],
    },

    {
      name: "Patient Visits",
      icon: "🩺",
      children: [  
        { name: "Add Visit Notes", icon: "➕", path: "/doctor/visits/add" },
        { name: "View Visits", icon: "👁️", path: "/doctor/visits/view" },
      ],
    },

    {
      name: "Prescriptions",
      icon: "💊",
      children: [
        { name: "Write Prescription", icon: "✍️", path: "/doctor/prescriptions/add" },
        { name: "View Prescriptions", icon: "📋", path: "/doctor/prescriptions/view" },
      ],
    },

    {
      name: "Reports",
      icon: "📄",
      children: [
        { name: "Lab Tests", icon: "🧪", path: "/doctor/labtests" },
        { name: "View Labtest Reports", icon: "📄", path: "/doctor/reports" },
      ],
    },

    {
    name: "Medical Records",
    icon: "📋",
    children: [
    
      { name: "View Records", icon: "👁️", path: "/doctor/medical-records/view" }

    ],
  },


    {
      name: "Profile",
      icon: "👤",
      children: [
        { name: "View Profile", icon: "📄", path: "/doctor/profile/view" },
      ],
    },
  ];

  return (
    <>
      <Navbar />

      <div className="doctor-dashboard">
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
                <h3 className="mb-1 fw-bold">👨‍⚕️ Doctor Dashboard</h3>
                <p className="mb-0 text-white-50">
                  Manage appointments, visits, and patient care
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="row mt-4 g-4">
              <div className="col-md-4">
                <div className="stat-card bg-primary">
                  <div>
                    <h6 className="mb-1">Today’s Appointments</h6>
                    <h3 className="fw-bold mb-0">{todayAppointments}</h3>
                  </div>
                  <div className="stat-icon">📅</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-success">
                  <div>
                    <h6 className="mb-1">Completed Visits</h6>
                    <h3 className="fw-bold mb-0">{completedVisits}</h3>
                  </div>
                  <div className="stat-icon">🩺</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-warning">
                  <div>
                    <h6 className="mb-1">Pending Reports</h6>
                    <h3 className="fw-bold mb-0">{pendingReports}</h3>
                  </div>
                  <div className="stat-icon">📄</div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="row mt-5 g-4">
              <div className="col-md-7">
                <div className="card shadow-sm rounded-4 border-0">
                  <div className="card-body">
                    <h5 className="fw-bold mb-3">📌 Recent Activity</h5>

                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        Appointment completed
                        <span className="badge bg-success">Today</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        Prescription issued
                        <span className="badge bg-primary">1 hr ago</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        Lab report reviewed
                        <span className="badge bg-warning text-dark">Yesterday</span>
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
                      <button
                        className="btn btn-outline-primary rounded-3"
                        onClick={() => navigate("/doctor/appointment/view")}
                      >
                        📅 View Appointments
                      </button>

                      <button
                        className="btn btn-outline-success rounded-3"
                        onClick={() => navigate("/doctor/visits/add")}
                      >
                        🩺 Add Visit Notes
                      </button>

                      <button
                        className="btn btn-outline-warning rounded-3"
                        onClick={() => navigate("/doctor/prescriptions/add")}
                      >
                        💊 Write Prescription
                      </button>

                      <button
                        className="btn btn-outline-dark rounded-3"
                        onClick={() => navigate("/doctor/profile/view")}
                      >
                        👤 My Profile
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-muted mt-5 small">
              © 2026 HealthCare HMS | Doctor Dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
