import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorBySpeciality() {
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

  const [speciality, setSpeciality] = useState("Gynecology");
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ counts per speciality
  const [counts, setCounts] = useState({});
  const [countLoading, setCountLoading] = useState(false);

  const fetchDoctors = async (selectedSpeciality) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/doctor?speciality=${selectedSpeciality}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setDoctors(res.data?.data || []);
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

  // ✅ Fetch counts for all specialities (one by one)
  const fetchCounts = async () => {
    try {
      setCountLoading(true);
      const token = localStorage.getItem("token");

      const results = {};
      for (const sp of specialities) {
        const res = await axios.get(
          `http://localhost:8080/doctor?speciality=${sp}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        results[sp] = (res.data?.data || []).length;
      }

      setCounts(results);
    } catch (error) {
      // If some speciality fails, still show counts we got
      Swal.fire({
        icon: "warning",
        title: "Counts Not Fully Loaded",
        text: "Some speciality counts could not be fetched.",
        confirmButtonColor: "#ffc107",
      });
    } finally {
      setCountLoading(false);
    }
  };

  // ✅ Load default data
  useEffect(() => {
    fetchDoctors(speciality);
    fetchCounts();
    // eslint-disable-next-line
  }, []);

  // ✅ Filter doctors in table
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const text = search.toLowerCase();
      return (
        doc.name?.toLowerCase().includes(text) ||
        doc.mobile?.includes(text) ||
        doc.status?.toLowerCase().includes(text)
      );
    });
  }, [doctors, search]);

  const handleSpecialityChange = (e) => {
    const value = e.target.value;
    setSpeciality(value);
    fetchDoctors(value);
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">🧠 View Doctors by Speciality</h4>
              <p className="text-muted mb-0">
                Select speciality to view doctor list and counts.
              </p>
            </div>

            {/* ✅ Back button */}
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back to Dashboard
              </button>

              <button
                className="btn btn-success"
                onClick={() => {
                  fetchDoctors(speciality);
                  fetchCounts();
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Speciality Counts */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">📌 Total Doctors per Speciality</h6>

            {countLoading ? (
              <div className="text-muted">
                <span
                  className="spinner-border spinner-border-sm text-success me-2"
                  role="status"
                ></span>
                Loading speciality counts...
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {specialities.map((sp, idx) => (
                  <button
                    key={idx}
                    className={`badge rounded-pill px-3 py-2 border ${
                      speciality === sp
                        ? "bg-success text-white border-success"
                        : "bg-light text-dark border"
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSpeciality(sp);
                      fetchDoctors(sp);
                    }}
                  >
                    {sp}: <b>{counts[sp] ?? 0}</b>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Filters */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Select Speciality</label>
              <select
                className="form-select"
                value={speciality}
                onChange={handleSpecialityChange}
              >
                {specialities.map((sp, idx) => (
                  <option value={sp} key={idx}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">Search</label>
              <div className="input-group">
                <span className="input-group-text">🔎</span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, mobile, status..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="col-md-3 d-flex justify-content-md-end">
              <div className="mt-4 mt-md-0">
                <span className="badge bg-primary-subtle text-primary border border-primary px-3 py-2 rounded-pill">
                  Showing: <b>{filteredDoctors.length}</b>
                </span>
              </div>
            </div>
          </div>

          {/* ✅ Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status"></div>
              <p className="mt-2 text-muted">
                Fetching doctors for <b>{speciality}</b>...
              </p>
            </div>
          )}

          {/* ✅ Table */}
          {!loading && (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No doctors found for <b>{speciality}</b>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-success">
                      <tr>
                        <th>Doctor ID</th>
                        <th>Name</th>
                        <th>Speciality</th>
                        <th>Mobile</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredDoctors.map((doc) => (
                        <tr key={doc.doctorId}>
                          <td className="fw-semibold">{doc.doctorId}</td>
                          <td>{doc.name}</td>
                          <td>
                            <span className="badge bg-info text-dark">
                              {doc.speciality}
                            </span>
                          </td>
                          <td>{doc.mobile}</td>
                          <td>{doc.consultationDuration} min</td>
                          <td>
                            <span
                              className={`badge ${
                                doc.status === "ACTIVE"
                                  ? "bg-success"
                                  : "bg-secondary"
                              }`}
                            >
                              {doc.status}
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

export default DoctorBySpeciality;
