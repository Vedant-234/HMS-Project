import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  BackHandler,
} from "react-native";

import API from "../api/api";

const PRIMARY = "#0A7C7C";

export default function MyAppointments({ navigation }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [cancelLoadingId, setCancelLoadingId] = useState(null);

  /* ================= HARDWARE BACK ================= */

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("PatientDashboard");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  /* ================= FETCH ================= */

  const fetchMyAppointments = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const res = await API.get("/appointments/my");
      setAppointments(res.data?.data || []);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || "Failed to fetch appointments"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  /* ================= HELPERS ================= */

  const now = new Date();
  const isPast = (dateStr) => new Date(dateStr) < now;

  const upcomingAppointments = useMemo(() => {
    return appointments
      .filter(
        (a) => a.status === "SCHEDULED" && !isPast(a.scheduledAt)
      )
      .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
  }, [appointments]);

  const previousAppointments = useMemo(() => {
    return appointments
      .filter(
        (a) =>
          a.status !== "CANCELLED" &&
          (isPast(a.scheduledAt) ||
            a.status === "ATTENDED" ||
            a.status === "IN_PROGRESS")
      )
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  }, [appointments]);

  const cancelledAppointments = useMemo(() => {
    return appointments
      .filter((a) => a.status === "CANCELLED")
      .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));
  }, [appointments]);

  const currentList =
    activeTab === "upcoming"
      ? upcomingAppointments
      : activeTab === "previous"
      ? previousAppointments
      : cancelledAppointments;

  /* ================= CANCEL ================= */

  const cancelAppointment = (appointmentId) => {
    Alert.alert(
      "Cancel Appointment?",
      "You can cancel only future scheduled appointments.",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelLoadingId(appointmentId);
              await API.put(`/appointments/cancel/${appointmentId}`);
              Alert.alert("Success", "Appointment cancelled");
              fetchMyAppointments();
            } catch (err) {
              Alert.alert(
                "Cancel Failed",
                err.response?.data?.message ||
                  "Appointment cannot be cancelled"
              );
            } finally {
              setCancelLoadingId(null);
            }
          },
        },
      ]
    );
  };

  const statusStyle = (status) => {
    if (status === "SCHEDULED") return styles.badgeSuccess;
    if (status === "CANCELLED") return styles.badgeDanger;
    if (status === "ATTENDED") return styles.badgePrimary;
    if (status === "IN_PROGRESS") return styles.badgeWarning;
    return styles.badgeSecondary;
  };

  /* ================= UI ================= */

  return (
    <View style={{ flex: 1 }}>
      {/* ===== NAVBAR ===== */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate("PatientDashboard")}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navTitle}>My Appointments</Text>
      </View>

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchMyAppointments(true)}
            colors={[PRIMARY]}
            tintColor={PRIMARY}
          />
        }
      >
        <Text style={styles.heading}>📅 My Appointments</Text>
        <Text style={styles.subHeading}>
          Pull down to refresh your appointments
        </Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "upcoming" && styles.tabActiveSuccess,
            ]}
            onPress={() => setActiveTab("upcoming")}
          >
            <Text style={styles.tabText}>
              Upcoming ({upcomingAppointments.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "previous" && styles.tabActivePrimary,
            ]}
            onPress={() => setActiveTab("previous")}
          >
            <Text style={styles.tabText}>
              Previous ({previousAppointments.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === "cancelled" && styles.tabActiveDanger,
            ]}
            onPress={() => setActiveTab("cancelled")}
          >
            <Text style={styles.tabText}>
              Cancelled ({cancelledAppointments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={PRIMARY} />
        ) : currentList.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text>⚠️ No appointments found</Text>
          </View>
        ) : (
          currentList.map((a) => (
            <View key={a.appointmentId} style={styles.card}>
              <Text style={styles.cardTitle}>
                Appointment #{a.appointmentId}
              </Text>

              <Text>👨‍⚕️ Doctor: {a.doctorName}</Text>

              <Text>
                📅{" "}
                {new Date(a.scheduledAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </Text>

              <View style={[styles.badge, statusStyle(a.status)]}>
                <Text style={styles.badgeText}>{a.status}</Text>
              </View>

              {activeTab === "upcoming" && (
                <TouchableOpacity
                  style={styles.cancelBtn}
                  disabled={cancelLoadingId === a.appointmentId}
                  onPress={() => cancelAppointment(a.appointmentId)}
                >
                  <Text style={styles.cancelText}>
                    {cancelLoadingId === a.appointmentId
                      ? "Cancelling..."
                      : "Cancel Appointment"}
                  </Text>
                </TouchableOpacity>
              )}
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

  tabs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },

  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  tabText: {
    fontWeight: "600",
  },

  tabActiveSuccess: {
    backgroundColor: "#198754",
    borderColor: "#198754",
  },

  tabActivePrimary: {
    backgroundColor: "#0d6efd",
    borderColor: "#0d6efd",
  },

  tabActiveDanger: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 3,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  badge: {
    alignSelf: "flex-start",
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  badgeSuccess: { backgroundColor: "#198754" },
  badgeDanger: { backgroundColor: "#dc3545" },
  badgePrimary: { backgroundColor: "#0d6efd" },
  badgeWarning: { backgroundColor: "#ffc107" },
  badgeSecondary: { backgroundColor: "#6c757d" },

  cancelBtn: {
    marginTop: 10,
    backgroundColor: "#dc3545",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  cancelText: {
    color: "#fff",
    fontWeight: "bold",
  },

  emptyBox: {
    backgroundColor: "#fff3cd",
    padding: 14,
    borderRadius: 10,
  },

  footer: {
    textAlign: "center",
    color: "#777",
    marginVertical: 20,
    fontSize: 12,
  },
});
