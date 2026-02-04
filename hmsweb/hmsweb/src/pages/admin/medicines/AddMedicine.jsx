import { useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddMedicine() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    quantity: 1,
    price: "",
    expiryDate: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const medicineTypes = [
    "Tablet",
    "Capsule",
    "Syrup",
    "Injection",
    "Ointment",
    "Drops",
    "Inhaler",
    "Powder",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Number(value)
          : name === "price"
          ? value
          : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // ✅ allow only images
    if (!file.type.startsWith("image/")) {
      Swal.fire({
        icon: "error",
        title: "Invalid File ❌",
        text: "Please upload only image files (jpg, png, jpeg, webp).",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    // ✅ Max size 2MB
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "File Too Large ❌",
        text: "Image must be less than 2MB.",
        confirmButtonColor: "#dc3545",
      });
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // ✅ Validation
  const isNameValid = formData.name.trim().length >= 2;
  const isTypeValid = formData.type.trim().length >= 2;
  const isQtyValid = Number(formData.quantity) > 0;
  const isPriceValid = Number(formData.price) > 0;
  const isExpiryValid = Boolean(formData.expiryDate);
  const isImageValid = Boolean(imageFile);

  const isFormValid =
    isNameValid &&
    isTypeValid &&
    isQtyValid &&
    isPriceValid &&
    isExpiryValid &&
    isImageValid;

  const expiryInfo = useMemo(() => {
    if (!formData.expiryDate) return null;
    const exp = new Date(formData.expiryDate);
    const today = new Date();
    if (exp < today) return "⚠️ Expiry date is in the past!";
    return "✅ Expiry date looks valid.";
  }, [formData.expiryDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Inputs ❌",
        text: "Please fill all fields correctly and upload image.",
        confirmButtonColor: "#198754",
      });
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      // ✅ multipart/form-data
      const data = new FormData();
      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("quantity", formData.quantity);
      data.append("price", formData.price);
      data.append("expiryDate", formData.expiryDate);
      data.append("image", imageFile);

      await axios.post("http://localhost:8080/manager/addmedicine", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          // ✅ do not set Content-Type manually, axios sets it automatically for FormData
        },
      });

      toast.success("✅ Medicine Added Successfully!");

      setFormData({
        name: "",
        type: "",
        quantity: 1,
        price: "",
        expiryDate: "",
      });
      setImageFile(null);
      setPreview(null);

      setTimeout(() => navigate("/admin"), 1200);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Medicine 😓",
        text:
          error.response?.data?.message ||
          "Something went wrong while adding medicine.",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">💊 Add Medicine</h4>
              <p className="text-muted mb-0">
                Add new medicine details including image, quantity and expiry
                date.
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

          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* LEFT: FORM */}
              <div className="col-md-7">
                {/* Medicine Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Medicine Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      formData.name
                        ? isNameValid
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                    }`}
                    placeholder="Eg: Paracetamol 500mg"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                {/* Type */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Type</label>
                  <select
                    className={`form-select ${
                      formData.type ? "is-valid" : ""
                    }`}
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Type --</option>
                    {medicineTypes.map((t, idx) => (
                      <option value={t} key={idx}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    className={`form-control ${
                      formData.quantity ? (isQtyValid ? "is-valid" : "is-invalid") : ""
                    }`}
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />
                </div>

                {/* Price */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Price (₹)</label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    className={`form-control ${
                      formData.price ? (isPriceValid ? "is-valid" : "is-invalid") : ""
                    }`}
                    placeholder="Eg: 25.50"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>

                {/* Expiry Date */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Expiry Date</label>
                  <input
                    type="date"
                    className={`form-control ${
                      formData.expiryDate ? "is-valid" : ""
                    }`}
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                  {expiryInfo && (
                    <div
                      className={`form-text ${
                        expiryInfo.includes("⚠️") ? "text-danger" : "text-success"
                      }`}
                    >
                      {expiryInfo}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: IMAGE UPLOAD */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">📷 Medicine Image</h6>

                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />

                    <div className="mt-3">
                      {preview ? (
                        <div className="text-center">
                          <img
                            src={preview}
                            alt="preview"
                            className="img-fluid rounded-4 shadow-sm"
                            style={{
                              maxHeight: "220px",
                              objectFit: "cover",
                              width: "100%",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-3"
                            onClick={() => {
                              setImageFile(null);
                              setPreview(null);
                            }}
                          >
                            ❌ Remove Image
                          </button>
                        </div>
                      ) : (
                        <div className="alert alert-secondary rounded-4 mt-3 mb-0">
                          Upload medicine image (Max 2MB).
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 mt-4 fw-semibold rounded-3"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding Medicine...
                </>
              ) : (
                "✅ Add Medicine"
              )}
            </button>

            {/* Info */}
            <div className="alert alert-info mt-4 mb-0 rounded-4">
              💡 Tip: Upload a clear image and keep correct expiry date to manage
              medicine stock efficiently.
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMedicine;
