import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

import styles from "../styles/authStyles";
import { registerApi } from "../api/authApi";

/* ================= DATE FORMAT FIX ================= */
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    dateOfBirth: "",
    mobile: "",
    address: "",
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= HELPERS ================= */

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const markTouched = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  };

  const errors = {
    firstname:
      touched.firstname && form.firstname.trim().length < 2
        ? "Minimum 2 characters required"
        : "",
    lastname:
      touched.lastname && form.lastname.trim().length < 2
        ? "Minimum 2 characters required"
        : "",
    gender:
      touched.gender && !form.gender ? "Please select gender" : "",
    dateOfBirth:
      touched.dateOfBirth && !form.dateOfBirth
        ? "Please select date of birth"
        : "",
    mobile:
      touched.mobile && !/^[0-9]{10}$/.test(form.mobile)
        ? "Enter valid 10 digit number"
        : "",
    address:
      touched.address && form.address.trim().length < 5
        ? "Address too short"
        : "",
    email:
      touched.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
        ? "Enter valid email"
        : "",
    password:
      touched.password && form.password.length < 6
        ? "Minimum 6 characters required"
        : "",
  };

  const isFormValid =
    Object.values(errors).every((e) => !e) &&
    Object.values(form).every((v) => v !== "");

  /* ================= REGISTER ================= */

  const handleRegister = async () => {
    if (!isFormValid) {
      Alert.alert("Invalid Details ⚠️", "Please fix errors");
      return;
    }

    try {
      setLoading(true);

      await registerApi({
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        mobile: form.mobile,
        address: form.address.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      Toast.show({
        type: "success",
        text1: "Registration Successful 🎉",
        text2: "Please login to continue",
      });

      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }, 1200);
    } catch (err) {
      Alert.alert(
        "Registration Failed ❌",
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.screen,
            { paddingTop: 50, paddingBottom: 30 },
          ]}
        >
          <View style={styles.card}>
            <Text style={styles.heading}>Patient Registration</Text>

            {/* First Name */}
            <TextInput
              placeholder="First Name"
              style={styles.input}
              value={form.firstname}
              onChangeText={(v) => handleChange("firstname", v)}
              onBlur={() => markTouched("firstname")}
            />
            {!!errors.firstname && (
              <Text style={styles.error}>{errors.firstname}</Text>
            )}

            {/* Last Name */}
            <TextInput
              placeholder="Last Name"
              style={styles.input}
              value={form.lastname}
              onChangeText={(v) => handleChange("lastname", v)}
              onBlur={() => markTouched("lastname")}
            />
            {!!errors.lastname && (
              <Text style={styles.error}>{errors.lastname}</Text>
            )}

            {/* Gender */}
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={form.gender}
                onValueChange={(v) => {
                  handleChange("gender", v);
                  markTouched("gender");
                }}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="MALE" />
                <Picker.Item label="Female" value="FEMALE" />
                <Picker.Item label="Other" value="OTHER" />
              </Picker>
            </View>
            {!!errors.gender && (
              <Text style={styles.error}>{errors.gender}</Text>
            )}

            {/* DOB */}
            <TouchableOpacity
              style={styles.input}
              onPress={() => {
                setShowDatePicker(true);
                markTouched("dateOfBirth");
              }}
            >
              <Text style={{ color: form.dateOfBirth ? "#000" : "#999" }}>
                {form.dateOfBirth || "Date of Birth"}
              </Text>
            </TouchableOpacity>
            {!!errors.dateOfBirth && (
              <Text style={styles.error}>{errors.dateOfBirth}</Text>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                maximumDate={new Date()}
                onChange={(e, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    handleChange("dateOfBirth", formatDate(date));
                  }
                }}
              />
            )}

            {/* Mobile */}
            <TextInput
              placeholder="Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
              value={form.mobile}
              onChangeText={(v) => handleChange("mobile", v)}
              onBlur={() => markTouched("mobile")}
            />
            {!!errors.mobile && (
              <Text style={styles.error}>{errors.mobile}</Text>
            )}

            {/* Address */}
            <TextInput
              placeholder="Address"
              style={styles.input}
              value={form.address}
              onChangeText={(v) => handleChange("address", v)}
              onBlur={() => markTouched("address")}
            />
            {!!errors.address && (
              <Text style={styles.error}>{errors.address}</Text>
            )}

            {/* Email */}
            <TextInput
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={form.email}
              onChangeText={(v) => handleChange("email", v)}
              onBlur={() => markTouched("email")}
            />
            {!!errors.email && (
              <Text style={styles.error}>{errors.email}</Text>
            )}

            {/* Password */}
            <View style={styles.passwordBox}>
              <TextInput
                placeholder="Password"
                secureTextEntry={!showPassword}
                style={[styles.input, { flex: 1 }]}
                value={form.password}
                onChangeText={(v) => handleChange("password", v)}
                onBlur={() => markTouched("password")}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eye}>
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </TouchableOpacity>
            </View>
            {!!errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            {/* Register */}
            <TouchableOpacity
              style={[
                styles.button,
                !isFormValid && { opacity: 0.6 },
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>

            {/* Login */}
            <Text
              style={styles.link}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: "Login" }],
                })
              }
            >
              Already have an account? Login
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Toast />
    </View>
  );
}
