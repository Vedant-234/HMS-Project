import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";

import API from "../api/api";

const PRIMARY = "#0A7C7C";

export default function PatientInvoices({ navigation }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH INVOICES ================= */

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/invoice/patient");
      setInvoices(res.data || []);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Unable to load invoices"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD INVOICE ================= */
  /* Mobile-safe: opens PDF in browser / PDF viewer */

  const downloadInvoice = async (invoiceId) => {
    try {
      const url = `${API.defaults.baseURL}/invoice/${invoiceId}/pdf`;
      await Linking.openURL(url);
    } catch {
      Alert.alert("Error", "Unable to download invoice");
    }
  };

  useEffect(() => {
    fetchInvoices();
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

        <Text style={styles.navTitle}>My Invoices</Text>
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>🧾 My Invoices</Text>
        <Text style={styles.subHeading}>
          View & download your hospital bills
        </Text>

        {/* Loading */}
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : invoices.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              ⚠️ No invoices available
            </Text>
          </View>
        ) : (
          invoices.map((inv) => (
            <View
              key={inv.invoiceId}
              style={styles.invoiceCard}
            >
              {/* Header */}
              <View style={styles.headerRow}>
                <View>
                  <Text style={styles.invoiceId}>
                    Invoice #{inv.invoiceId}
                  </Text>
                  <Text style={styles.dateText}>
                    📅{" "}
                    {new Date(inv.createdAt).toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    inv.paymentStatus === "PAID"
                      ? styles.badgePaid
                      : styles.badgeUnpaid,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {inv.paymentStatus}
                  </Text>
                </View>
              </View>

              {/* Doctor */}
              <View style={styles.doctorBadge}>
                <Text style={styles.doctorText}>
                  👨‍⚕️ {inv.doctorName}
                </Text>
              </View>

              {/* Fees */}
              <View style={styles.row}>
                <Text>Doctor Fees</Text>
                <Text>₹ {inv.doctorFees}</Text>
              </View>

              <View style={styles.row}>
                <Text>Medicines</Text>
                <Text>₹ {inv.medicineFees}</Text>
              </View>

              <View style={styles.row}>
                <Text>Lab Tests</Text>
                <Text>₹ {inv.labtestFees}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.row}>
                <Text style={styles.bold}>Subtotal</Text>
                <Text style={styles.bold}>
                  ₹ {inv.subtotal}
                </Text>
              </View>

              <View style={styles.row}>
                <Text>GST</Text>
                <Text>₹ {inv.gstAmount}</Text>
              </View>

              <View style={styles.totalRow}>
                <Text style={styles.totalText}>
                  Total Amount
                </Text>
                <Text style={styles.totalText}>
                  ₹ {inv.nettotal}
                </Text>
              </View>

              {/* Download */}
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() =>
                  downloadInvoice(inv.invoiceId)
                }
              >
                <Text style={styles.downloadText}>
                  ⬇ Download Invoice PDF
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.footer}>
          © 2026 HealthCare HMS • Secure Billing
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

  invoiceCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
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

  invoiceId: {
    fontWeight: "bold",
    fontSize: 16,
  },

  dateText: {
    color: "#666",
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgePaid: {
    backgroundColor: "#198754",
  },

  badgeUnpaid: {
    backgroundColor: "#dc3545",
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  doctorBadge: {
    backgroundColor: "#e0f2f1",
    padding: 8,
    borderRadius: 12,
    marginVertical: 8,
  },

  doctorText: {
    color: PRIMARY,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },

  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 8,
  },

  bold: {
    fontWeight: "bold",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  totalText: {
    fontWeight: "bold",
    fontSize: 16,
    color: PRIMARY,
  },

  downloadBtn: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: PRIMARY,
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: "center",
  },

  downloadText: {
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
