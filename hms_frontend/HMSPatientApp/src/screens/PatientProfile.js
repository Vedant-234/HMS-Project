import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import API from "../api/api";

const PRIMARY = "#0A7C7C";

export default function PatientProfile({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    address: "",
    email: "",
  });

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const res = await API.get("/patient/profile");
      const data = res.data || {};

      setForm({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        gender: data.gender || "",
        dateOfBirth: data.dateOfBirth || "",
        mobile: data.mobile || "",
        address: data.address || "",
        email: data.email || "",
      });
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* ================= VALIDATIONS ================= */

  const isFirstNameValid = form.firstname.trim().length >= 2;
  const isLastNameValid = form.lastname.trim().length >= 2;
  const isGenderValid = form.gender !== "";
  const isDOBValid = form.dateOfBirth !== "";
  const isMobileValid = /^[0-9]{10}$/.test(form.mobile);
  const isAddressValid = form.address.trim().length >= 5;

  const isFormValid =
    isFirstNameValid &&
    isLastNameValid &&
    isGenderValid &&
    isDOBValid &&
    isMobileValid &&
    isAddressValid;

  const summaryText = useMemo(() => {
    return `${form.firstname} ${form.lastname} • ${form.gender}`;
  }, [form.firstname, form.lastname, form.gender]);

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid Details", "Please fill all details correctly");
      return;
    }

    try {
      setSaving(true);

      await API.put("/patient/profile", {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        mobile: form.mobile,
        address: form.address.trim(),
      });

      Alert.alert("Success", "Profile updated successfully");
      fetchProfile();
    } catch (err) {
      Alert.alert(
        "Update Failed",
        err.response?.data?.message || "Unable to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1 }}>
      {/* ===== NAVBAR ===== */}
      <View style={styles.navbar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PatientDashboard")}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.navTitle}>My Profile</Text>
      </View>

      <ScrollView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : (
          <>
            {/* SUMMARY */}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                ✅ Profile Loaded: <Text style={{ fontWeight: "bold" }}>{summaryText}</Text>
              </Text>
            </View>

            {/* First Name */}
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[
                styles.input,
                form.firstname && !isFirstNameValid && styles.invalid,
              ]}
              value={form.firstname}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, firstname: v }))
              }
              placeholder="Enter first name"
            />

            {/* Last Name */}
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={[
                styles.input,
                form.lastname && !isLastNameValid && styles.invalid,
              ]}
              value={form.lastname}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, lastname: v }))
              }
              placeholder="Enter last name"
            />

            {/* Gender */}
            <Text style={styles.label}>Gender</Text>
            <Picker
              selectedValue={form.gender}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, gender: v }))
              }
              style={styles.picker}
            >
              <Picker.Item label="-- Select Gender --" value="" />
              <Picker.Item label="Male" value="MALE" />
              <Picker.Item label="Female" value="FEMALE" />
              <Picker.Item label="Other" value="OTHER" />
            </Picker>

            {/* DOB */}
            <Text style={styles.label}>Date of Birth (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={form.dateOfBirth}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, dateOfBirth: v }))
              }
              placeholder="YYYY-MM-DD"
            />

            {/* Mobile */}
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={[
                styles.input,
                form.mobile && !isMobileValid && styles.invalid,
              ]}
              keyboardType="numeric"
              maxLength={10}
              value={form.mobile}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, mobile: v }))
              }
              placeholder="10 digit mobile"
            />

            {/* Email (Read Only) */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabled]}
              value={form.email}
              editable={false}
            />

            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[
                styles.textArea,
                form.address && !isAddressValid && styles.invalid,
              ]}
              multiline
              value={form.address}
              onChangeText={(v) =>
                setForm((p) => ({ ...p, address: v }))
              }
              placeholder="Enter full address"
            />

            {/* UPDATE BUTTON */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid || saving) && styles.disabledBtn,
              ]}
              onPress={handleUpdate}
              disabled={!isFormValid || saving}
            >
              <Text style={styles.buttonText}>
                {saving ? "Saving..." : "✅ Update Profile"}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footer}>
          © 2026 HealthCare HMS | Patient Portal
        </Text>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  navbar: {
    height: 120,
    backgroundColor: PRIMARY,
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
    padding: 16,
    backgroundColor: "#f1fefe",
  },

  summaryBox: {
    backgroundColor: "#d1e7dd",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },

  summaryText: {
    color: "#0f5132",
  },

  label: {
    marginTop: 12,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  textArea: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    marginTop: 4,
    height: 90,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },

  picker: {
    backgroundColor: "#fff",
    marginTop: 4,
    borderRadius: 8,
  },

  invalid: {
    borderColor: "#dc3545",
  },

  disabled: {
    backgroundColor: "#e9ecef",
  },

  button: {
    backgroundColor: PRIMARY,
    padding: 16,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  disabledBtn: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  footer: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 12,
  },
});
