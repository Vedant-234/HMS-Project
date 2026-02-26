import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function BookAppointment() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const [doctorName, setDoctorName] = useState("");
  const [duration, setDuration] = useState(15);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");

  const [booking, setBooking] = useState(false);

  // ✅ Today string for min date & slot disabling
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  // ✅ Format time for dropdown label
  const formatTime = (hour, minute) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    const mm = minute.toString().padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  };

  // ✅ Generate time slots based on duration (8AM to 8PM)
  const generateSlots = (dur) => {
    const slots = [];
    const startHour = 8;
    const endHour = 20; // 8PM

    let hour = startHour;
    let minute = 0;

    while (hour < endHour || (hour === endHour && minute === 0)) {
      const value = `${hour.toString().padStart(2, "0")}:${minute
        .toString()
        .padStart(2, "0")}`;

      slots.push({
        value,
        label: formatTime(hour, minute),
      });

      minute += dur;

      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute = minute % 60;
      }
    }

    return slots;
  };

  // ✅ Disable past slots only for today
  const pastSlotsToday = useMemo(() => {
    if (selectedDate !== todayStr) return [];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return generateSlots(duration)
      .filter((slot) => {
        const [h, m] = slot.value.split(":").map(Number);
        const slotMinutes = h * 60 + m;
        return slotMinutes < currentMinutes;
      })
      .map((slot) => slot.value);
  }, [selectedDate, todayStr, duration]);

  // ✅ Final slots with disabled info (only past slots)
  const slotsWithDisable = useMemo(() => {
    return generateSlots(duration).map((slot) => {
      const disabled = selectedDate === todayStr && pastSlotsToday.includes(slot.value);

      return {
        ...slot,
        disabled,
        reason: disabled ? "Past Slot" : "",
      };
    });
  }, [duration, selectedDate, todayStr, pastSlotsToday]);

  // ✅ Get doctors by speciality
  const fetchDoctors = async (sp) => {
    try {
      setLoadingDoctors(true);

      const res = await axios.get(
        `http://localhost:8080/doctor?speciality=${sp}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDoctors(res.data?.data || []);

      // reset fields
      setDoctorName("");
      setDuration(15);
      setSelectedDate("");
      setSelectedSlot("");
      setNotes("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Load Doctors ❌",
        text: error.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#dc3545",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors(speciality);
    // eslint-disable-next-line
  }, []);

  // ✅ Only ACTIVE doctors
  const doctorOptions = useMemo(() => {
    return doctors.filter((d) => d.status === "ACTIVE");
  }, [doctors]);

  // ✅ Book appointment API
  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!doctorName || !selectedDate || !selectedSlot) {
      Swal.fire({
        icon: "warning",
        title: "Missing Details ⚠️",
        text: "Please select Doctor, Date and Slot!",
        confirmButtonColor: "#198754",
      });
      return;
    }

    const finalDateTime = `${selectedDate}T${selectedSlot}:00`;

    try {
      setBooking(true);

      await axios.post(
        "http://localhost:8080/appointments/book",
        {
          doctorName: doctorName,
          scheduledAt: finalDateTime,
          notes: notes.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Appointment booked successfully!");

      setDoctorName("");
      setSelectedDate("");
      setSelectedSlot("");
      setNotes("");

      setTimeout(() => navigate("/patient"), 1200);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.response?.data ||
        "Could not book appointment!";

      // ✅ If already booked slot
      if (String(msg).toLowerCase().includes("already booked")) {
        Swal.fire({
          icon: "error",
          title: "Slot Already Booked ❌",
          text: "This slot is already booked. Please choose another slot.",
          confirmButtonColor: "#dc3545",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Booking Failed ❌",
          text: msg,
          confirmButtonColor: "#dc3545",
        });
      }
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="container">
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-1">📅 Book Appointment</h4>
              <p className="text-muted mb-0">
                Choose speciality, doctor, date and time slot.
              </p>
            </div>

            <button
              className="btn btn-outline-success"
              onClick={() => navigate("/patient")}
            >
              ⬅ Back to Dashboard
            </button>
          </div>

          <hr className="my-4" />

          <form onSubmit={handleBookAppointment}>
            <div className="row g-3">
              {/* Speciality */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Speciality</label>
                <select
                  className="form-select"
                  value={speciality}
                  onChange={(e) => {
                    const sp = e.target.value;
                    setSpeciality(sp);
                    fetchDoctors(sp);
                  }}
                >
                  {specialities.map((sp, idx) => (
                    <option value={sp} key={idx}>
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Doctor */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Doctor</label>

                {loadingDoctors ? (
                  <div className="form-control d-flex align-items-center">
                    <span className="spinner-border spinner-border-sm text-success me-2"></span>
                    Loading doctors...
                  </div>
                ) : (
                  <select
                    className="form-select"
                    value={doctorName}
                    onChange={(e) => {
                      const name = e.target.value;
                      setDoctorName(name);

                      const doc = doctors.find((d) => d.name === name);
                      setDuration(doc?.consultationDuration || 15);

                      // reset slot & date
                      setSelectedDate("");
                      setSelectedSlot("");
                    }}
                  >
                    <option value="">-- Select Doctor --</option>
                    {doctorOptions.map((doc) => (
                      <option key={doc.doctorId} value={doc.name}>
                        {doc.name} ({doc.consultationDuration} min)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Date */}
              <div className="col-md-4">
                <label className="form-label fw-semibold">Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  min={todayStr} // ✅ disable past dates
                  disabled={!doctorName}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                />
                <small className="text-muted">
                  Past dates disabled ✅
                </small>
              </div>

              {/* Slot */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Time Slot ({duration} mins)
                </label>

                <select
                  className="form-select"
                  value={selectedSlot}
                  disabled={!doctorName || !selectedDate}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                >
                  <option value="">
                    {doctorName
                      ? selectedDate
                        ? "-- Select Slot --"
                        : "Select Date First"
                      : "Select Doctor First"}
                  </option>

                  {slotsWithDisable.map((slot, idx) => (
                    <option
                      key={idx}
                      value={slot.value}
                      disabled={slot.disabled}
                    >
                      {slot.label} {slot.reason ? `❌ (${slot.reason})` : ""}
                    </option>
                  ))}
                </select>

                <small className="text-muted">
                  Slots from 8:00 AM to 8:00 PM ✅
                </small>
              </div>

              {/* Notes */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Eg: General checkup, fever, etc..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-success w-100 mt-4 fw-semibold rounded-3"
              disabled={booking}
            >
              {booking ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Booking...
                </>
              ) : (
                "✅ Book Appointment"
              )}
            </button>
          </form>

          <div className="alert alert-info rounded-4 mt-4 mb-0">
            💡 Note: Already booked slots will be rejected by backend and you
            will get an alert automatically ✅
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookAppointment;

