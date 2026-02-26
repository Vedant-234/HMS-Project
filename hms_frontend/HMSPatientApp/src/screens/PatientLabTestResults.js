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

export default function PatientLabTestResults({ navigation }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH LAB RESULTS ================= */

  const fetchResults = async () => {
    try {
      setLoading(true);

      const res = await API.get("/labtest-result/my");
      setResults(res.data || []);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "Unable to fetch lab test results"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
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

        <Text style={styles.navTitle}>Lab Test Results</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>🧪 Lab Test Results</Text>
        <Text style={styles.subHeading}>
          View your completed lab test reports
        </Text>

        {/* Loading */}
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : results.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              ⚠️ No lab test results available
            </Text>
          </View>
        ) : (
          results.map((r, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.testName}>
                🧪 {r.testName}
              </Text>

              <Text style={styles.row}>
                <Text style={styles.label}>📅 Result Date: </Text>
                {new Date(r.resultDate).toLocaleDateString("en-IN")}
              </Text>

              <Text style={styles.row}>
                <Text style={styles.label}>🔬 Findings: </Text>
                {r.findings}
              </Text>

              <View style={styles.feesBox}>
                <Text style={styles.feesText}>
                  ₹ {r.labTestFees}
                </Text>
              </View>
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

  testName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: PRIMARY,
  },

  row: {
    marginBottom: 6,
    color: "#333",
  },

  label: {
    fontWeight: "600",
  },

  feesBox: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  feesText: {
    color: PRIMARY,
    fontWeight: "bold",
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
