import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const startApp = async () => {
      let targetScreen = "Login";

      try {
        const token = await AsyncStorage.getItem("token");
        console.log("SPLASH TOKEN 👉", token);

        if (token) {
          targetScreen = "PatientDashboard";
        }
      } catch (err) {
        targetScreen = "Login";
      }

      // ⏱️ FORCE SPLASH FOR 10 SECONDS
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: targetScreen }],
        });
      }, 5000); // 10 seconds
    };

    startApp();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>HMS Care</Text>
      <Text style={styles.subtitle}>Your Health, Our Priority</Text>
      <Text style={styles.loading}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A7C7C",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#e0f2f1",
    marginTop: 5,
  },
  loading: {
    marginTop: 20,
    color: "#e0f2f1",
    fontSize: 12,
  },
});
