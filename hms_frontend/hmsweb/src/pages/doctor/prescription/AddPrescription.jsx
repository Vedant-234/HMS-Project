import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function AddPrescription() {
  const navigate = useNavigate();

  const [recordId, setRecordId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medicines, setMedicines] = useState([
    { medicineid: "", dosage: "", duration: "", quantity: "" }
  ]);

  const addMedicineRow = () => {
    setMedicines([
      ...medicines,
      { medicineid: "", dosage: "", duration: "", quantity: "" }
    ]);
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const submitPrescription = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8080/prescription",
        {
          recordid: Number(recordId),
          patientid: Number(patientId),
          notes,
          medicines
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      Swal.fire("Success", "Prescription added", "success");
      navigate("/doctor/dashboard");

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to add prescription",
        "error"
      );
    }
  };

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">💊 Add Prescription</h4>

        {/* Back Button */}
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ⬅ Back
        </button>
      </div>

      <input
        className="form-control mb-2"
        placeholder="Record ID"
        value={recordId}
        onChange={e => setRecordId(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Patient ID"
        value={patientId}
        onChange={e => setPatientId(e.target.value)}
      />

      <textarea
        className="form-control mb-3"
        placeholder="Notes"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />

      <h6 className="fw-bold">Medicines</h6>

      {medicines.map((m, i) => (
        <div key={i} className="border rounded p-2 mb-2">
          <input
            placeholder="Medicine ID"
            className="form-control mb-1"
            onChange={e =>
              handleMedicineChange(i, "medicineid", e.target.value)
            }
          />
          <input
            placeholder="Dosage"
            className="form-control mb-1"
            onChange={e =>
              handleMedicineChange(i, "dosage", e.target.value)
            }
          />
          <input
            placeholder="Duration"
            className="form-control mb-1"
            onChange={e =>
              handleMedicineChange(i, "duration", e.target.value)
            }
          />
          <input
            placeholder="Quantity"
            className="form-control"
            onChange={e =>
              handleMedicineChange(i, "quantity", e.target.value)
            }
          />
        </div>
      ))}

      <button
        className="btn btn-secondary me-2"
        onClick={addMedicineRow}
      >
        + Add Medicine
      </button>

      <button
        className="btn btn-success"
        onClick={submitPrescription}
      >
        Save Prescription
      </button>
    </div>
  );
}

export default AddPrescription;
