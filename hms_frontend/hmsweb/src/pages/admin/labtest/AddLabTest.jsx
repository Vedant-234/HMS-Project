import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddLabTest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    testName: "",
    description: "",
    labTestFees: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "labTestFees" ? value : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire("Invalid File ❌", "Only image files are allowed!", "error");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire("Too Large ❌", "Image must be less than 2MB!", "error");
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const isFormValid =
    formData.testName.trim().length >= 3 &&
    formData.description.trim().length >= 5 &&
    Number(formData.labTestFees) > 0 &&
    imageFile;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      Swal.fire({
        icon: "error",
        title: "Invalid Inputs ❌",
        text: "Please fill all details correctly and upload image.",
        confirmButtonColor: "#198754",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // ✅ multipart/form-data
      const data = new FormData();
      data.append("testName", formData.testName);
      data.append("description", formData.description);
      data.append("labTestFees", formData.labTestFees);
      data.append("image", imageFile);

      await axios.post("http://localhost:8080/labtest/addlabtest", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ Lab Test Added Successfully!");

      setFormData({
        testName: "",
        description: "",
        labTestFees: "",
      });
      setImageFile(null);
      setPreview(null);

      setTimeout(() => navigate("/admin"), 1200);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed 😓",
        text:
          error.response?.data?.message ||
          "Something went wrong while adding lab test",
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
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">🧪 Add Lab Test</h4>
              <p className="text-muted mb-0">
                Add a new lab test with description, fees and image.
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Left */}
              <div className="col-md-7">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Test Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Eg: Blood Test"
                    name="testName"
                    value={formData.testName}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write short description..."
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Lab Test Fees (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Eg: 250"
                    name="labTestFees"
                    value={formData.labTestFees}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Right */}
              <div className="col-md-5">
                <div className="card border-0 shadow-sm rounded-4 h-100">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">📷 Lab Test Image</h6>

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
                          Upload image (Max 2MB).
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
                  Adding Lab Test...
                </>
              ) : (
                "✅ Add Lab Test"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLabTest;
