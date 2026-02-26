import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Image,

} from "react-native";
import { changePasswordApi } from "../api/authApi";
import styles from "../styles/authStyles";
import { useNavigation } from '@react-navigation/native';


export default function ChangePasswordScreen() {
  const [email, setEmail] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [show, setShow] = useState(false);

  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (!email || !newPass || !confirmPass) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      await changePasswordApi({
        email: email.trim(),
        newPassword: newPass,
      });

      Alert.alert("Success", "Password updated successfully");

      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (e) {
      console.log("CHANGE PASSWORD ERROR 👉", err);
      Alert.alert("Error", e.response?.data?.message || "Failed");
    }
};

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{ width: 100, height: 100, marginBottom: 15 }}
        />

        <View style={styles.container}>
          <Image
            source={require("../assets/changepassword.png")}
            style={styles.logo}
          />

          <Text style={styles.heading}>Change Password</Text>

          <TextInput placeholder="Email" style={styles.input} value={email}
            onChangeText={setEmail} />
          <TextInput
            placeholder="New Password"
            secureTextEntry={!show}
            style={styles.input}
            value={newPass}
            onChangeText={setNewPass}
          />

          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!show}
            style={styles.input}
            value={confirmPass}
            onChangeText={setConfirmPass}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>UPDATE PASSWORD</Text>
          </TouchableOpacity>
<TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              })
            }
          >
            <Text style={styles.link}>Back To Login</Text>
          </TouchableOpacity>
        
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
