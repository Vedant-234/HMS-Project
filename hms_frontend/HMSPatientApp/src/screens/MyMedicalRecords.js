import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";

import API from "../api/api";

const PRIMARY = "#0A7C7C";

export default function MyMedicalRecords({ navigation }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH RECORDS ================= */

  const fetchRecords = async () => {
    try {
      setLoading(true);

      const res = await API.get("/patient-medical-record/my");
      setRecords(res.data || []);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to load medical records"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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

        <Text style={styles.navTitle}>My Medical Records</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>📄 My Medical Records</Text>
        <Text style={styles.subHeading}>
          View your diagnosis, visits and treatment plan
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : records.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              ⚠️ No medical records found for your profile.
            </Text>
          </View>
        ) : (
          records.map((rec) => (
            <View key={rec.recordid} style={styles.card}>
              {/* Header */}
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  🧾 Record #{rec.recordid}
                </Text>

                <View style={styles.activeBadge}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
              </View>

              {/* Last Visit */}
              <Text style={styles.rowText}>
                <Text style={styles.label}>📅 Last Visit: </Text>
                {new Date(rec.lastVisit).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>

              {/* Diagnosis */}
              <Text style={styles.rowText}>
                <Text style={styles.label}>🩺 Diagnosis: </Text>
                {rec.diagnosis}
              </Text>

              {/* Treatment */}
              <Text style={styles.rowText}>
                <Text style={styles.label}>💊 Treatment Plan: </Text>
                {rec.treatmentPlan}
              </Text>
            </View>
          ))
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

  heading: {
    fontSize: 20,
    fontWeight: "bold",
  },

  subHeading: {
    color: "#666",
    marginBottom: 16,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  activeBadge: {
    backgroundColor: "#d1e7dd",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#0f5132",
    fontWeight: "bold",
    fontSize: 12,
  },

  rowText: {
    marginBottom: 6,
    color: "#333",
  },

  label: {
    fontWeight: "600",
  },

  emptyBox: {
    backgroundColor: "#fff3cd",
    padding: 16,
    borderRadius: 12,
  },

  emptyText: {
    color: "#664d03",
  },

  footer: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 12,
  },
});
