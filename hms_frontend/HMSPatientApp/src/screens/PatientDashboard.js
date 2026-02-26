import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PatientDashboard({ navigation }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [username, setUsername] = useState("Patient");

  /* ===== LOAD USERNAME FROM ASYNC STORAGE ===== */
  useEffect(() => {
    const loadUser = async () => {
      const email = await AsyncStorage.getItem("email");
      if (email) {
        setUsername(email.split("@")[0]); // remove @gmail.com
      }
    };
    loadUser();
  }, []);

  const goTo = (screen, menu) => {
    setActiveMenu(menu);
    setSidebarOpen(false);
    navigation.navigate(screen);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      {/* ===== NAVBAR (INCREASED HEIGHT) ===== */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => setSidebarOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.navTitle}>Patient Dashboard</Text>
          <Text style={styles.navSubtitle}>Welcome, {username} 👋</Text>
        </View>
      </View>

      {/* ===== OVERLAY (CLICK OUTSIDE TO CLOSE) ===== */}
      {sidebarOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setSidebarOpen(false)}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Menu</Text>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Dashboard" && styles.activeItem,
            ]}
            onPress={() => goTo("PatientDashboard", "Dashboard")}
          >
            <Text style={styles.menuText}>🏠 Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Book" && styles.activeItem,
            ]}
            onPress={() => goTo("BookAppointment", "Book")}
          >
            <Text style={styles.menuText}>📅 Book Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "View" && styles.activeItem,
            ]}
            onPress={() => goTo("MyAppointments", "View")}
          >
            <Text style={styles.menuText}>👁️ View Appointments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "View" && styles.activeItem,
            ]}
            onPress={() => goTo("MyMedicalRecords", "View")}
          >
            <Text style={styles.menuText}>📌 View Medical Records</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "View" && styles.activeItem,
            ]}
            onPress={() => goTo("PatientLabTestResults", "View")}
          >
            <Text style={styles.menuText}>🧪 View LabTest Result</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "View" && styles.activeItem,
            ]}
            onPress={() => goTo("PatientPrescriptions", "View")}
          >
            <Text style={styles.menuText}>📄 View Prescription</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "View" && styles.activeItem,
            ]}
            onPress={() => goTo("PatientInvoices", "View")}
          >
            <Text style={styles.menuText}>💳 Invoices</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              activeMenu === "Profile" && styles.activeItem,
            ]}
            onPress={() => goTo("PatientProfile", "Profile")}
          >
            <Text style={styles.menuText}>👤 Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logout} onPress={logout}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ===== MAIN CONTENT (NO BOOK/VIEW HERE) ===== */}
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📅 Upcoming Appointments</Text>
          <Text style={styles.cardValue}>3</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🩺 Medical Reports</Text>
          <Text style={styles.cardValue}>12</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📄 Pending Reports</Text>
          <Text style={styles.cardValue}>2</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const PRIMARY = "#0A7C7C";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1fefe",
  },

  /* NAVBAR */
  navbar: {
    height: 140, // 🔥 increased
    backgroundColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  menuIcon: {
    fontSize: 30,
    color: "#fff",
    marginRight: 18,
  },

  navTitle: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },

  navSubtitle: {
    color: "#e0f2f1",
    fontSize: 20,
    marginTop: 10,
    fontWeight: "700"
  },

  /* OVERLAY */
  overlay: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },

  /* SIDEBAR */
  sidebar: {
    position: "absolute",
    top: 120,
    left: 0,
    width: "80%",
    height: "100%",
    backgroundColor: PRIMARY,
    padding: 20,
    zIndex: 10,
  },

  sidebarTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },

  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  activeItem: {
    backgroundColor: "#ffffff33",
  },

  menuText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },

  logout: {
    marginTop: 30,
    backgroundColor: "#dc3545",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* CONTENT */
  content: {
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  cardDesc: {
    color: "#555",
  },

  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: PRIMARY,
    marginTop: 4,
  },
});
