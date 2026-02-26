import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginApi } from "../api/authApi";
import styles from "../styles/authStyles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= AUTO LOGIN CHECK ================= */

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        navigation.reset({
          index: 0,
          routes: [{ name: "PatientDashboard" }],
        });
      }
    };

    checkLogin();
  }, []);

  /* ================= LOGIN ================= */

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    const payload = {
      email: email.trim(),
      password,
    };

    try {
      setLoading(true);

      const res = await loginApi(payload);

      // ✅ SAVE TOKEN & EMAIL
      await AsyncStorage.setItem("token", res.token);
      await AsyncStorage.setItem("email", payload.email);

      // ✅ NAVIGATE TO DASHBOARD
      navigation.reset({
        index: 0,
        routes: [{ name: "PatientDashboard" }],
      });
    } catch (err) {
      console.log("LOGIN ERROR 👉", err);
      Alert.alert(
        "Login Failed",
        err?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingTop: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo */}
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 100,
            height: 100,
            alignSelf: "center",
            marginBottom: 10,
          }}
        />

        <View style={styles.container}>
          <Image
            source={require("../assets/login.png")}
            style={styles.logo}
          />

          <Text style={styles.heading}>Patient Login</Text>

          {/* Email */}
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          {/* Password with Eye */}
          <View style={styles.passwordBox}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eye}>
                {showPassword ? "🙈" : "👁"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && { opacity: 0.7 },
            ]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "LOGIN"}
            </Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <Text style={styles.link}>
              Forgot / Change Password?
            </Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.link}>
              New Patient? Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

