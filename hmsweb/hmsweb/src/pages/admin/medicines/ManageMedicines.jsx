import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import {
  deleteMedicineById,
  fetchAllMedicines,
  fetchMedicineById,
  searchMedicineByName,
  updateMedicineById,
} from "../../../services/MedicineService";

function ManageMedicines() {
  const navigate = useNavigate();

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchId, setSearchId] = useState("");

  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editMedicine, setEditMedicine] = useState(null);

  const [searchLoading, setSearchLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // ✅ Image URL builder (adjust if your backend image is served from another path)
  const getMedicineImageUrl = (imageName) =>
  `http://localhost:8080/medicine-images/${imageName}`;



  // ✅ Fetch all medicines
  const loadAll = async () => {
    try {
      setLoading(true);
      const res = await fetchAllMedicines();
      setMedicines(res.data || []);
    } catch (error) {
      Swal.fire("Error", "Unable to fetch medicines", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // ✅ Search by name
  const handleSearchByName = async () => {
    if (!searchName.trim()) {
      toast.warning("Enter medicine name to search!");
      return;
    }

    try {
      setSearchLoading(true);
      const res = await searchMedicineByName(searchName);
      setMedicines(res.data || []);
      toast.success("✅ Search results loaded!");
    } catch (error) {
      Swal.fire("Not Found", "No medicine found with this name!", "warning");
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ View medicine by ID
  const handleViewById = async () => {
    if (!searchId) {
      toast.warning("Enter medicine ID!");
      return;
    }

    try {
      setSearchLoading(true);
      const res = await fetchMedicineById(searchId);
      setSelectedMedicine(res.data);
    } catch (error) {
      Swal.fire("Not Found", "Medicine not found with this ID!", "error");
    } finally {
      setSearchLoading(false);
    }
  };

  // ✅ Delete medicine
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete Medicine?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#198754",
      confirmButtonText: "Yes, Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      setActionLoadingId(id);
      await deleteMedicineById(id);
      toast.success("✅ Medicine Deleted!");
      loadAll();
    } catch (error) {
      Swal.fire("Error", "Unable to delete medicine", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ Open edit modal
  const openEdit = (m) => {
    setEditMedicine({
      medicineid: m.medicineid,
      name: m.name,
      type: m.type,
      quantity: m.quantity,
      price: m.price,
      expiryDate: m.expiryDate, // show but disable
      image: m.image,
    });
  };

  // ✅ Update medicine (expiryDate should NOT change)
  const handleUpdate = async () => {
    try {
      setActionLoadingId(editMedicine.medicineid);

      // ✅ Send only allowed fields (not expiryDate)
      const payload = {
        name: editMedicine.name,
        type: editMedicine.type,
        quantity: Number(editMedicine.quantity),
        price: Number(editMedicine.price),
      };

      await updateMedicineById(editMedicine.medicineid, payload);

      toast.success("✅ Medicine Updated Successfully!");
      setEditMedicine(null);
      loadAll();
    } catch (error) {
      Swal.fire("Error", "Unable to update medicine!", "error");
    } finally {
      setActionLoadingId(null);
    }
  };

  // ✅ Filtered list (optional)
  const filteredMedicines = useMemo(() => medicines, [medicines]);

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">💊 Manage Medicines</h4>
              <p className="text-muted mb-0">
                View, Search, Update, Delete medicines with image support.
              </p>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-success"
                onClick={() => navigate("/admin")}
              >
                ⬅ Back
              </button>
              <button className="btn btn-success" onClick={loadAll}>
                🔄 Refresh
              </button>
            </div>
          </div>

          <hr className="my-4" />

          {/* Search Section */}
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label fw-semibold">Search by Name</label>
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Eg: Paracetamol"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={handleSearchByName}
                  disabled={searchLoading}
                >
                  {searchLoading ? "..." : "Search"}
                </button>
              </div>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">View by ID</label>
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Eg: 1"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleViewById}
                  disabled={searchLoading}
                >
                  View
                </button>
              </div>
            </div>

            <div className="col-md-3">
              <button
                className="btn btn-outline-dark w-100"
                onClick={() => {
                  setSearchName("");
                  setSearchId("");
                  setSelectedMedicine(null);
                  loadAll();
                }}
              >
                📋 View All
              </button>
            </div>
          </div>

          {/* Selected Medicine Details */}
          {selectedMedicine && (
            <div className="alert alert-info mt-4 rounded-4">
              <h6 className="fw-bold mb-2">🔍 Medicine Details</h6>
              <p className="mb-1">
                <b>ID:</b> {selectedMedicine.medicineid}
              </p>
              <p className="mb-1">
                <b>Name:</b> {selectedMedicine.name}
              </p>
              <p className="mb-1">
                <b>Type:</b> {selectedMedicine.type}
              </p>
              <p className="mb-1">
                <b>Quantity:</b> {selectedMedicine.quantity}
              </p>
              <p className="mb-1">
                <b>Price:</b> ₹{selectedMedicine.price}
              </p>
              <p className="mb-0">
                <b>Expiry:</b> {selectedMedicine.expiryDate}
              </p>
            </div>
          )}

          {/* Medicines Table */}
          <div className="mt-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success"></div>
              </div>
            ) : filteredMedicines.length === 0 ? (
              <div className="alert alert-warning rounded-4">
                ⚠️ No medicines found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-success">
                    <tr>
                      <th>Image</th>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Expiry</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMedicines.map((m) => (
                      <tr key={m.medicineid}>
                        <td>
                          {m.image ? (
                            <img
                              src={getMedicineImageUrl(m.image)}
                              alt={m.name}
                              style={{
                                width: "55px",
                                height: "55px",
                                borderRadius: "10px",
                                objectFit: "cover",
                              }}
                               onError={(e) => {
                              e.target.src = "C:\Users\tanma\Downloads\Medicine.jpg";
                             }}
                            />
                          ) : (
                            <span className="text-muted">No Image</span>
                          )}
                        </td>
                        <td className="fw-semibold">{m.medicineid}</td>
                        <td>{m.name}</td>
                        <td>
                          <span className="badge bg-info text-dark">
                            {m.type}
                          </span>
                        </td>
                        <td>{m.quantity}</td>
                        <td>₹{m.price}</td>
                        <td>{m.expiryDate}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => openEdit(m)}
                            >
                              ✏️ Edit
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(m.medicineid)}
                              disabled={actionLoadingId === m.medicineid}
                            >
                              {actionLoadingId === m.medicineid
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

          {/* ✅ Edit Modal */}
          {editMedicine && (
            <div
              className="modal show fade d-block"
              tabIndex="-1"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content rounded-4 border-0">
                  <div className="modal-header">
                    <h5 className="modal-title fw-bold">✏️ Update Medicine</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setEditMedicine(null)}
                    ></button>
                  </div>

                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                          className="form-control"
                          value={editMedicine.name}
                          onChange={(e) =>
                            setEditMedicine((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Type</label>
                        <input
                          className="form-control"
                          value={editMedicine.type}
                          onChange={(e) =>
                            setEditMedicine((p) => ({
                              ...p,
                              type: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">
                          Quantity
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          value={editMedicine.quantity}
                          onChange={(e) =>
                            setEditMedicine((p) => ({
                              ...p,
                              quantity: e.target.value,
                            }))
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold">Price</label>
                        <input
                          type="number"
                          className="form-control"
                          value={editMedicine.price}
                          onChange={(e) =>
                            setEditMedicine((p) => ({
                              ...p,
                              price: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* ✅ expiry date disabled */}
                      <div className="col-md-12">
                        <label className="form-label fw-semibold">
                          Expiry Date (Cannot change)
                        </label>
                        <input
                          className="form-control"
                          value={editMedicine.expiryDate}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setEditMedicine(null)}
                    >
                      Cancel
                    </button>

                    <button
                      className="btn btn-success"
                      onClick={handleUpdate}
                      disabled={actionLoadingId === editMedicine.medicineid}
                    >
                      {actionLoadingId === editMedicine.medicineid
                        ? "Updating..."
                        : "✅ Update"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-muted small mt-4 mb-0">
            © 2026 HealthCare HMS | Medicines Module
          </p>
        </div>
      </div>
    </div>
  );
}

export default ManageMedicines;
