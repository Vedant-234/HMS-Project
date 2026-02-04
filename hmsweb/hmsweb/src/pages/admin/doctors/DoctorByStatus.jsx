import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function DoctorByStatus() {
  const navigate = useNavigate();

  const statuses = ["ACTIVE", "HOLIDAY", "LEFT", "RETIRED"];

  const [status, setStatus] = useState("ACTIVE");
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  // ✅ counts for each status
  const [counts, setCounts] = useState({});
  const [countLoading, setCountLoading] = useState(false);

  // ✅ Fetch doctors by status
  const fetchDoctors = async (selectedStatus) => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const res = await axios.get(
        `http://localhost:8080/doctor/status/${selectedStatus}`,
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

  // ✅ Fetch counts of each status (one by one)
  const fetchCounts = async () => {
    try {
      setCountLoading(true);

      const token = localStorage.getItem("token");
      const result = {};

      for (const st of statuses) {
        const res = await axios.get(
          `http://localhost:8080/doctor/status/${st}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        result[st] = (res.data?.data || []).length;
      }

      setCounts(result);
    } catch (error) {
      Swal.fire({
        icon: "warning",
        title: "Counts Not Fully Loaded",
        text: "Some status counts could not be fetched.",
        confirmButtonColor: "#ffc107",
      });
    } finally {
      setCountLoading(false);
    }
  };

  // ✅ Load initial data
  useEffect(() => {
    fetchDoctors(status);
    fetchCounts();
    // eslint-disable-next-line
  }, []);

  // ✅ Search filter
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const t = search.toLowerCase();
      return (
        doc.name?.toLowerCase().includes(t) ||
        doc.mobile?.includes(t) ||
        doc.speciality?.toLowerCase().includes(t)
      );
    });
  }, [doctors, search]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    fetchDoctors(value);
  };

  // ✅ Status colors
  const getStatusClass = (st) => {
    if (st === "ACTIVE") return "bg-success text-white";
    if (st === "HOLIDAY") return "bg-warning text-dark";
    if (st === "LEFT") return "bg-danger text-white";
    if (st === "RETIRED") return "bg-secondary text-white";
    return "bg-dark text-white";
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <h4 className="fw-bold mb-1">📌 View Doctors by Status</h4>
              <p className="text-muted mb-0">
                Filter doctors based on their current status and view counts.
              </p>
            </div>

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
                  fetchDoctors(status);
                  fetchCounts();
                }}
              >
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Status Counts */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">📊 Total Doctors per Status</h6>

            {countLoading ? (
              <div className="text-muted">
                <span className="spinner-border spinner-border-sm text-success me-2"></span>
                Loading status counts...
              </div>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {statuses.map((st, idx) => (
                  <button
                    key={idx}
                    className={`badge rounded-pill px-3 py-2 border ${getStatusClass(
                      st
                    )} ${status === st ? "border-dark" : "border-0"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setStatus(st);
                      fetchDoctors(st);
                    }}
                  >
                    {st}: <b>{counts[st] ?? 0}</b>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filters Row */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Select Status</label>
              <select
                className="form-select"
                value={status}
                onChange={handleStatusChange}
              >
                {statuses.map((st, idx) => (
                  <option value={st} key={idx}>
                    {st}
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
                  placeholder="Search by name, mobile, speciality..."
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

          {/* Loading */}
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-success"></div>
              <p className="mt-2 text-muted">
                Fetching doctors for <b>{status}</b>...
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && (
            <>
              {filteredDoctors.length === 0 ? (
                <div className="alert alert-warning rounded-4">
                  ⚠️ No doctors found for <b>{status}</b>
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
                            <span className={`badge ${getStatusClass(doc.status)}`}>
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

export default DoctorByStatus;
