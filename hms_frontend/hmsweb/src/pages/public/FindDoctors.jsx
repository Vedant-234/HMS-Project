import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FindDoctors.css";

function FindDoctors() {
  const navigate = useNavigate();

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

  const [speciality, setSpeciality] = useState("Cardiology");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctors = async (sp) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8080/doctor/public?speciality=${sp}`
      );
      setDoctors(res.data?.data || []);
    } catch (err) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(speciality);
  }, [speciality]);

  return (
    <div className="find-doctor-page">
      {/* HEADER */}
      <div className="find-header">
        <div>
          <h3 className="fw-bold mb-1">👨‍⚕️ Find a Doctor</h3>
          <p className="text-muted mb-0">
            Browse doctors by speciality
          </p>
        </div>

        {/* Back Button */}
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          ⬅ Back to Home
        </button>
      </div>

      {/* FILTER */}
      <div className="filter-box mt-4">
        <label className="fw-semibold">Select Speciality</label>
        <select
          className="form-select mt-2"
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
        >
          {specialities.map((sp, i) => (
            <option key={i} value={sp}>
              {sp}
            </option>
          ))}
        </select>
      </div>

      {/* CONTENT */}
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" />
            <p className="mt-2 text-muted">
              Loading doctors...
            </p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="alert alert-warning rounded-4">
            No doctors available for <b>{speciality}</b>
          </div>
        ) : (
          <div className="row g-4">
            {doctors.map((doc) => (
              <div className="col-md-4" key={doc.doctorId}>
                <div className="doctor-card">
                  <div className="doctor-avatar">👨‍⚕️</div>

                  <h6 className="fw-bold mb-1">{doc.name}</h6>

                  <span className="badge bg-info text-dark mb-2">
                    {doc.speciality}
                  </span>

                  <div className="doctor-info">
                    <p>📞 {doc.mobile}</p>
                    <p>⏱ {doc.consultationDuration} mins</p>
                  </div>

                  <button
                    className="btn btn-success w-100 mt-2"
                    onClick={() => navigate("/patient-login")}
                  >
                    📅 Book Appointment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FindDoctors;
