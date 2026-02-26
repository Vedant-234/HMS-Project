import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import API from "../api/api";

/* ================= DATE FORMAT (FIX TIMEZONE) ================= */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function BookAppointment({ navigation }) {
  /* ===================== DATA ===================== */

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState("");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);

  const today = new Date();
  const todayStr = formatDate(today);

  /* ===================== SLOT LOGIC ===================== */

  const formatTime = (hour, minute) => {
    const h = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    return `${h}:${minute.toString().padStart(2, "0")} ${ampm}`;
  };

  const generateSlots = (dur) => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 20) {
      slots.push({
        value: `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`,
        label: formatTime(hour, minute),
      });

      minute += dur;
      if (minute >= 60) {
        hour += Math.floor(minute / 60);
        minute %= 60;
      }
    }
    return slots;
  };

  const pastSlotsToday = useMemo(() => {
    if (selectedDate !== todayStr) return [];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return generateSlots(duration)
      .filter((slot) => {
        const [h, m] = slot.value.split(":").map(Number);
        return h * 60 + m < currentMinutes;
      })
      .map((slot) => slot.value);
  }, [selectedDate, duration]);

  const slotsWithDisable = useMemo(() => {
    return generateSlots(duration).map((slot) => ({
      ...slot,
      disabled:
        selectedDate === todayStr && pastSlotsToday.includes(slot.value),
    }));
  }, [duration, selectedDate, pastSlotsToday]);

  /* ===================== API ===================== */

  const fetchDoctors = async (sp) => {
    try {
      setLoadingDoctors(true);
      const res = await API.get(`/doctor?speciality=${sp}`);
      setDoctors(res.data?.data || []);

      setDoctorName("");
      setSelectedDate("");
      setSelectedSlot("");
      setNotes("");
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to load doctors"
      );
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    fetchDoctors(speciality);
  }, []);

  const activeDoctors = doctors.filter((d) => d.status === "ACTIVE");

  /* ===================== DATE PICKER ===================== */

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (!date) return;

    setSelectedDate(formatDate(date));
    setSelectedSlot("");
  };

  /* ===================== BOOK ===================== */

  const handleBookAppointment = async () => {
    if (!doctorName || !selectedDate || !selectedSlot) {
      Alert.alert("Missing Details", "Please select Doctor, Date and Slot");
      return;
    }

    // 🚫 Extra safety: prevent past date booking
    if (selectedDate < todayStr) {
      Alert.alert("Invalid Date", "You cannot book past appointments");
      return;
    }

    const scheduledAt = `${selectedDate}T${selectedSlot}:00`;

    try {
      setBooking(true);

      await API.post("/appointments/book", {
        doctorName,
        scheduledAt,
        notes: notes.trim(),
      });

      Alert.alert("Success", "Appointment booked successfully");
      navigation.goBack();
    } catch (err) {
      Alert.alert(
        "Booking Failed",
        err.response?.data?.message || "Slot already booked"
      );
    } finally {
      setBooking(false);
    }
  };

  /* ===================== UI ===================== */

  return (
    <View style={{ flex: 1 }}>
      {/* ===== NAVBAR ===== */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.navTitle}>Book Appointment</Text>
      </View>

      <ScrollView style={styles.container}>
        {/* Speciality */}
        <Text style={styles.label}>Speciality</Text>
        <Picker
          selectedValue={speciality}
          onValueChange={(v) => {
            setSpeciality(v);
            fetchDoctors(v);
          }}
          style={styles.picker}
        >
          {specialities.map((sp) => (
            <Picker.Item key={sp} label={sp} value={sp} />
          ))}
        </Picker>

        {/* Doctor */}
        <Text style={styles.label}>Doctor</Text>
        {loadingDoctors ? (
          <ActivityIndicator color="#0A7C7C" />
        ) : (
          <Picker
            selectedValue={doctorName}
            onValueChange={(v) => {
              setDoctorName(v);
              const doc = doctors.find((d) => d.name === v);
              setDuration(doc?.consultationDuration || 15);
              setSelectedDate("");
              setSelectedSlot("");
            }}
            style={styles.picker}
          >
            <Picker.Item label="-- Select Doctor --" value="" />
            {activeDoctors.map((doc) => (
              <Picker.Item
                key={doc.doctorId}
                label={`${doc.name} (${doc.consultationDuration} min)`}
                value={doc.name}
              />
            ))}
          </Picker>
        )}

        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{selectedDate || "Select Date"}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={today}
            mode="date"
            minimumDate={today}
            display={Platform.OS === "ios" ? "spinner" : "calendar"}
            onChange={onDateChange}
          />
        )}

        {/* Slot */}
        <Text style={styles.label}>Time Slot ({duration} mins)</Text>
        <Picker
          selectedValue={selectedSlot}
          enabled={!!selectedDate}
          onValueChange={setSelectedSlot}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Slot --" value="" />
          {slotsWithDisable.map((slot) => (
            <Picker.Item
              key={slot.value}
              label={`${slot.label}${slot.disabled ? " ❌" : ""}`}
              value={slot.value}
              enabled={!slot.disabled}
            />
          ))}
        </Picker>

        {/* Notes */}
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.notesBox}
          placeholder="Eg: Fever, general checkup..."
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {/* Submit */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleBookAppointment}
          disabled={booking}
        >
          <Text style={styles.buttonText}>
            {booking ? "Booking..." : "✅ Book Appointment"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  navbar: {
    height: 120,
    backgroundColor: "#0A7C7C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  backIcon: {
    fontSize: 26,
    color: "#fff",
    marginRight: 12,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    backgroundColor: "#f1fefe",
    padding: 16,
  },
  label: {
    marginTop: 12,
    fontWeight: "600",
  },
  picker: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 4,
  },
  dateBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginTop: 6,
  },
  notesBox: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginTop: 6,
    height: 100,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#0A7C7C",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
