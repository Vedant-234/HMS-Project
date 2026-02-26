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

/* ================= DOSAGE FORMATTER ================= */

const parseDosage = (dosage) => {
  if (!dosage) return null;

  // Example: "1-0-1 after food"
  const parts = dosage.split(" ");
  const timing = parts[0]; // 1-0-1
  const food = parts.slice(1).join(" ");

  const [morning, afternoon, night] = timing.split("-");

  return {
    morning,
    afternoon,
    night,
    food,
  };
};

export default function PatientPrescriptions({ navigation }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH PRESCRIPTIONS ================= */

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/prescription/my");
      setPrescriptions(res.data || []);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message ||
          "Unable to fetch prescriptions"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
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

        <Text style={styles.navTitle}>My Prescriptions</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>💊 My Prescriptions</Text>
        <Text style={styles.subHeading}>
          View your prescribed medicines clearly
        </Text>

        {/* Loading */}
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : prescriptions.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              ⚠️ No prescriptions found
            </Text>
          </View>
        ) : (
          prescriptions.map((p) => (
            <View
              key={p.prescriptionid}
              style={styles.prescriptionCard}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <Text style={styles.doctorName}>
                  👨‍⚕️ {p.doctorName}
                </Text>

                <View style={styles.totalBadge}>
                  <Text style={styles.totalText}>
                    ₹ {p.totalMedicineFees}
                  </Text>
                </View>
              </View>

              {/* Notes */}
              {p.notes ? (
                <Text style={styles.notes}>📝 {p.notes}</Text>
              ) : null}

              {/* Medicines */}
              {p.medicines.map((m, idx) => {
                const d = parseDosage(m.dosage);

                return (
                  <View key={idx} style={styles.medicineCard}>
                    <Text style={styles.medicineName}>
                      💊 {m.medicineName}
                    </Text>

                    {/* Dosage */}
                    {d ? (
                      <>
                        <View style={styles.dosageRow}>
                          <Text style={styles.doseBadgeSuccess}>
                            🌅 {d.morning}
                          </Text>
                          <Text style={styles.doseBadgeWarning}>
                            🌞 {d.afternoon}
                          </Text>
                          <Text style={styles.doseBadgePrimary}>
                            🌙 {d.night}
                          </Text>
                        </View>

                        <Text style={styles.foodText}>
                          🍽️ {d.food}
                        </Text>
                      </>
                    ) : (
                      <Text>{m.dosage}</Text>
                    )}

                    {/* Details */}
                    <View style={styles.detailsRow}>
                      <Text>📆 {m.duration}</Text>
                      <Text>Qty: {m.quantity}</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <Text>₹ {m.unitPrice} / unit</Text>
                      <Text style={styles.lineTotal}>
                        ₹ {m.lineTotal}
                      </Text>
                    </View>
                  </View>
                );
              })}
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

  prescriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  doctorName: {
    fontWeight: "bold",
    fontSize: 16,
  },

  totalBadge: {
    backgroundColor: "#e0f2f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  totalText: {
    color: PRIMARY,
    fontWeight: "bold",
  },

  notes: {
    color: "#555",
    marginBottom: 10,
  },

  medicineCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },

  medicineName: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  dosageRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },

  doseBadgeSuccess: {
    backgroundColor: "#198754",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },

  doseBadgeWarning: {
    backgroundColor: "#ffc107",
    color: "#000",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },

  doseBadgePrimary: {
    backgroundColor: "#0d6efd",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 12,
  },

  foodText: {
    color: "#666",
    fontSize: 12,
    marginBottom: 6,
  },

  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  lineTotal: {
    fontWeight: "bold",
    color: PRIMARY,
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
