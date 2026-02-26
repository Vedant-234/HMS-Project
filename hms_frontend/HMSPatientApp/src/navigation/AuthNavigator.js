import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import PatientDashboard from "../screens/PatientDashboard";
import BookAppointment from "../screens/BookAppointment";
import MyAppointments from "../screens/MyAppointments";
import PatientProfile from "../screens/PatientProfile";
import MyMedicalRecords from "../screens/MyMedicalRecords";
import PatientLabTestResults from "../screens/PatientLabTestResults";
import PatientPrescriptions from "../screens/PatientPrescriptions";
import PatientInvoices from "../screens/PatientInvoices";
import ChangePasswordScreen from "../screens/ChangePassword";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="PatientDashboard"
        component={PatientDashboard}
      />
      <Stack.Screen
        name="BookAppointment"
        component={BookAppointment}
      />
      <Stack.Screen
        name="MyAppointments"
        component={MyAppointments}
      />
      <Stack.Screen
        name="PatientProfile"
        component={PatientProfile}
      />
      <Stack.Screen
        name="MyMedicalRecords"
        component={MyMedicalRecords}
      />
      <Stack.Screen
        name="PatientLabTestResults"
        component={PatientLabTestResults}
      />
      <Stack.Screen
        name="PatientPrescriptions"
        component={PatientPrescriptions}
      />
      <Stack.Screen
        name="PatientInvoices"
        component={PatientInvoices}
      />
    </Stack.Navigator>
  );
}
