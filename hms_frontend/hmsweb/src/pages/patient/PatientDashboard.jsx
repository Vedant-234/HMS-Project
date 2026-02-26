import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "./PatientDashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PatientDashboard() {
  const navigate = useNavigate();

  /* ---------------- State ---------------- */
  const [userName, setUserName] = useState("");
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [medicalCount, setMedicalCount] = useState(0);
  const [labResultCount, setLabResultCount] = useState(0);

  /* ---------------- Menu ---------------- */
  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/patient" },
    {
      name: "Appointments",
      icon: "📅",
      children: [
        { name: "Book Appointment", icon: "➕", path: "/patient/appointments/book" },
        { name: "My Appointments", icon: "👁️", path: "/patient/appointments/my" },
      ],
    },
    {
      name: "Medical Records",
      icon: "💊",
      children: [
        { name: "View Records", icon: "📌", path: "/patient/medical-records/view" },
        { name: "View Lab Test Result", icon: "🧪", path: "/patient/medical-records/lab-results" },
      ],
    },
    { name: "View Prescriptions", icon: "📄", path: "/patient/prescriptions" },
    { name: "Invoices", icon: "💳", path: "/patient/invoices" },
    {
      name: "Profile",
      icon: "👤",
      children: [{ name: "View Profile", icon: "📄", path: "/patient/profile/view" }],
    },
  ];

  /* ---------------- Fetch Dashboard Data ---------------- */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email"); // saved at login

        // 👤 Extract name from email
        if (email) {
          const name = email.split("@")[0];
          setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        }

        /* -------- Appointments -------- */
        const apptRes = await axios.get(
          "http://localhost:8080/appointments/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const upcoming = apptRes.data?.data?.filter(
          (a) => a.status === "SCHEDULED"
        ).length || 0;
        setUpcomingCount(upcoming);

        /* -------- Medical Records -------- */
        const recordRes = await axios.get(
          "http://localhost:8080/patient-medical-record/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMedicalCount(recordRes.data?.length || 0);

        /* -------- Lab Test Results -------- */
        const labRes = await axios.get(
          "http://localhost:8080/labtest-result/my",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLabResultCount(labRes.data?.length || 0);

      } catch (err) {
        console.error("Patient dashboard error", err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="patient-dashboard">
        <div className="row m-0">

          {/* Sidebar */}
          <div className="col-12 col-md-2 p-0 sidebar-wrapper">
            <Sidebar menu={menu} />
          </div>

          {/* Content */}
          <div className="col-12 col-md-10 p-4 content-wrapper">

            {/* Header */}
            <div className="dashboard-header mb-4">
              <h3 className="fw-bold mb-1">🧑‍⚕️ Patient Dashboard</h3>
              <p className="fw-bold mb-1">
                Welcome, <b>{userName}</b> 👋
              </p>
            </div>

            {/* Stats */}
            <div className="row g-4">
              <div className="col-md-4">
                <div className="stat-card bg-primary">
                  <div>
                    <h6>Upcoming Appointments</h6>
                    <h3 className="fw-bold">{upcomingCount}</h3>
                  </div>
                  <div className="stat-icon">📅</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-success">
                  <div>
                    <h6>Medical Reports</h6>
                    <h3 className="fw-bold">{medicalCount}</h3>
                  </div>
                  <div className="stat-icon">🩺</div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card bg-warning">
                  <div>
                    <h6>Lab Test Results</h6>
                    <h3 className="fw-bold">{labResultCount}</h3>
                  </div>
                  <div className="stat-icon">🧪</div>
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
                        Appointment booked <span className="badge bg-primary">Today</span> </li> 
                        <li className="list-group-item d-flex justify-content-between"> Prescription updated <span className="badge bg-success">Yesterday</span> </li> 
                        <li className="list-group-item d-flex justify-content-between"> Lab report available <span className="badge bg-warning text-dark">2 days ago</span> </li> 
                        </ul> 
                        </div> 
                        </div> </div>
                         {/* Quick Actions */} 
                         <div className="col-md-5"> 
                          <div className="card shadow-sm rounded-4 border-0"> <div className="card-body"> 
                            <h5 className="fw-bold mb-3">⚡ Quick Actions</h5> 
                            <div className="d-grid gap-3"> <button className="btn btn-outline-primary rounded-3" onClick={() => navigate("/patient/appointments/book")} > 📅 Book Appointment </button> <button className="btn btn-outline-success rounded-3" onClick={() => navigate("/patient/appointments/my")}> 📄 View Appointments </button> 
                            <button className="btn btn-outline-warning rounded-3" onClick={() => navigate("/patient/prescriptions")}> 💊 View Prescriptions </button> <button className="btn btn-outline-dark rounded-3" onClick={() => navigate("/patient/profile/view")}> 👤 My Profile </button> </div> </div> </div> </div> </div>
            <p className="text-center text-muted small mt-5">
              © 2026 HealthCare HMS | Patient Dashboard
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientDashboard;
