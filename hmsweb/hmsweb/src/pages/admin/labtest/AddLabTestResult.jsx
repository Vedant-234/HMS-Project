import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function AddLabTestResult() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    testid: "",
    recordid: "",
    resultDate: "",
    findings: "",
    labTestFees: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { testid, recordid, resultDate, findings, labTestFees } = form;

    if (!testid || !recordid || !resultDate || !findings || !labTestFees) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details",
        text: "Please fill all fields",
        confirmButtonColor: "#198754",
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/labtest-result",
        {
          testid: Number(testid),
          recordid: Number(recordid),
          resultDate,
          findings,
          labTestFees: Number(labTestFees),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Lab Test Result Added Successfully!");

      setForm({
        testid: "",
        recordid: "",
        resultDate: "",
        findings: "",
        labTestFees: "",
      });

      setTimeout(() => navigate("/admin"), 1200);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong while adding lab result",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* ✅ Header with Back Button */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="fw-bold mb-0">🧾 Add Lab Test Result</h4>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/admin")}
            >
              ⬅ Back to Dashboard
            </button>
          </div>

          <p className="text-muted mb-4">
            Add laboratory test result for a patient medical record.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Test ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Test ID</label>
                <input
                  type="number"
                  className="form-control"
                  name="testid"
                  value={form.testid}
                  onChange={handleChange}
                />
              </div>

              {/* Record ID */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Record ID</label>
                <input
                  type="number"
                  className="form-control"
                  name="recordid"
                  value={form.recordid}
                  onChange={handleChange}
                />
              </div>

              {/* Result Date */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Result Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="resultDate"
                  value={form.resultDate}
                  onChange={handleChange}
                />
              </div>

              {/* Fees */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Lab Test Fees</label>
                <input
                  type="number"
                  className="form-control"
                  name="labTestFees"
                  value={form.labTestFees}
                  onChange={handleChange}
                />
              </div>

              {/* Findings */}
              <div className="col-12">
                <label className="form-label fw-semibold">Findings</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="findings"
                  value={form.findings}
                  onChange={handleChange}
                  placeholder="Eg: Hemoglobin High"
                ></textarea>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 mt-4 fw-semibold"
              disabled={loading}
            >
              {loading ? "Saving..." : "✅ Add Lab Test Result"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLabTestResult;

