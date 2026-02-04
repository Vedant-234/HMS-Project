import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ManageLabTests() {
  const navigate = useNavigate();

  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedId, setSelectedId] = useState("");
  const [editLab, setEditLab] = useState(null);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Change this URL if backend serves images from another path
  const getImageUrl = (imageName) => {
    if (!imageName) return "";
    return `http://localhost:8080/labtest-images/${imageName.trim()}`;
  };

  // ✅ VIEW ALL LAB TESTS
  const fetchAllLabTests = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8080/labtest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLabTests(res.data || []);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error ❌",
        text: "Failed to fetch lab tests!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load All on Start
  useEffect(() => {
    fetchAllLabTests();
    // eslint-disable-next-line
  }, []);

  // ✅ SEARCH BY NAME
  const handleSearch = async () => {
    if (!searchName.trim()) {
      toast.warning("Please enter test name to search!");
      return;
    }

    try {
      setSearchLoading(true);

      const res = await axios.get(
        `http://localhost:8080/labtest/search?name=${searchName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLabTests(res.data || []);
      toast.success("✅ Search results loaded!");
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "Not Found ⚠️",
        text: "No lab test found with this name!",
        confirmButtonColor: "#ffc107",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ DELETE BY ID
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Lab Test?",
      text: `Are you sure you want to delete test ID ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#198754",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoadingId(id);

      await axios.delete(`http://localhost:8080/labtest/deletelab/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Lab Test Deleted!");
      fetchAllLabTests();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed ❌",
        text: "Failed to delete lab test!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ OPEN UPDATE MODAL
  const openEdit = (lab) => {
    setEditLab({
      testid: lab.testid,
      testName: lab.testName,
      description: lab.description,
      labTestFees: lab.labTestFees,
      image: lab.image,
    });
  };

  // ✅ UPDATE LAB TEST
  const handleUpdate = async () => {
  try {
    setActionLoadingId(editLab.testid);
    const token = localStorage.getItem("token");

    const data = new FormData();
    data.append("testName", editLab.testName);
    data.append("description", editLab.description);
    data.append("labTestFees", editLab.labTestFees);

    // ✅ if you want update image also later:
    // data.append("image", selectedFile);

    await axios.put(
      `http://localhost:8080/labtest/updatelab/${editLab.testid}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    toast.success("✅ Lab Test Updated Successfully!");
    setEditLab(null);
    fetchAllLabTests();
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Update Failed ❌",
      text: err.response?.data?.message || "Error while updating lab test!",
      confirmButtonColor: "#dc3545",
    });
  } finally {
    setActionLoadingId(null);
  }
};


  // ✅ FILTER BY ID
  const filteredLabTests = useMemo(() => {
    if (!selectedId.trim()) return labTests;
    return labTests.filter((t) => String(t.testid) === String(selectedId));
  }, [labTests, selectedId]);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">🧪 Manage Lab Tests</h4>
              <p className="text-muted mb-0">
                View, search, update and delete lab tests easily.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back
              </button>

              <button className="btn btn-success" onClick={fetchAllLabTests}>
                🔄 Refresh All
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* ✅ Search Row */}
          <div className="row g-3 align-items-end">
            {/* Search by name */}
            <div className="col-md-5">
              <label className="form-label fw-semibold">Search by Name</label>
              <div className="input-group">
                <span className="input-group-text">🔎</span>
                <input
                  className="form-control"
                  placeholder="Eg: Blood Test"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleSearch}
                  disabled={searchLoading}
                >
                  {searchLoading ? "..." : "Search"}
                </button>
              </div>
            </div>

            {/* View by ID */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">View by ID</label>
              <input
                className="form-control"
                placeholder="Eg: 1"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              />
            </div>

            {/* Reset */}
            <div className="col-md-4 d-grid">
              <button
                className="btn btn-outline-dark"
                onClick={() => {
                  setSelectedId("");
                  setSearchName("");
                  fetchAllLabTests();
                }}
              >
                📋 View All Lab Tests
              </button>
            </div>
          </div>

          {/* ✅ Table */}
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success"></div>
                <p className="text-muted mt-2">Loading lab tests...</p>
              </div>
            ) : filteredLabTests.length === 0 ? (
              <div className="alert alert-warning rounded-4">
                ⚠️ No lab test found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Image</th>
                      <th>ID</th>
                      <th>Test Name</th>
                      <th>Description</th>
                      <th>Fees</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredLabTests.map((t) => (
                      <tr key={t.testid}>
                        <td>
                          {t.image ? (
                            <img
                              src={getImageUrl(t.image)}
                              alt={t.testName}
                              style={{
                                width: "60px",
                                height: "60px",
                                borderRadius: "12px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/60?text=No+Img";
                              }}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>

                        <td className="fw-semibold">{t.testid}</td>
                        <td>{t.testName}</td>
                        <td style={{ maxWidth: "250px" }}>{t.description}</td>
                        <td className="fw-semibold text-success">
                          ₹ {t.labTestFees}
                        </td>

                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEdit(t)}
                            >
                              ✏️ Update
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              disabled={actionLoadingId === t.testid}
                              onClick={() => handleDelete(t.testid)}
                            >
                              {actionLoadingId === t.testid
                                ? "Deleting..."
                                : "🗑 Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ✅ Update Modal */}
          {editLab && (
            <div
              className="modal show fade d-block"
              tabIndex="-1"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 border-0">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">
                      ✏️ Update Lab Test (ID: {editLab.testid})
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditLab(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Test Name
                        </label>
                        <input
                          className="form-control"
                          value={editLab.testName}
                          onChange={(e) =>
                            setEditLab((p) => ({
                              ...p,
                              testName: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Fees (₹)
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={editLab.labTestFees}
                          onChange={(e) =>
                            setEditLab((p) => ({
                              ...p,
                              labTestFees: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          Description
                        </label>
                        <textarea
                          rows="3"
                          className="form-control"
                          value={editLab.description}
                          onChange={(e) =>
                            setEditLab((p) => ({
                              ...p,
                              description: e.target.value,
                            }))
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setEditLab(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={handleUpdate}
                      disabled={actionLoadingId === editLab.testid}
                    >
                      {actionLoadingId === editLab.testid
                        ? "Updating..."
                        : "✅ Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Lab Tests Module
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManageLabTests;

