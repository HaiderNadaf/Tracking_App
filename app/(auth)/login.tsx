import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { apiFetch } from "../../services/api";
import { useState } from "react";
import { registerForPushToken } from "../../services/push";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    console.log("🟢 Login clicked");
    console.log("📞 Phone entered:", phone);

    if (phone.length !== 10) {
      Alert.alert("Enter valid 10 digit number");
      console.log("❌ Invalid phone length");
      return;
    }

    try {
      setLoading(true);
      console.log("🚀 Sending login request...");

      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      console.log("✅ Login response:", res);

      console.log("💾 Saving tokens & user to storage...");

      await AsyncStorage.multiSet([
        ["accessToken", res.accessToken],
        ["refreshToken", res.refreshToken],
        ["user", JSON.stringify(res.user)],
      ]);

      // 🔔 Register for push & send to backend
      const fcmToken = await registerForPushToken();

      if (fcmToken) {
        await apiFetch("/api/users/save-fcm", {
          method: "POST",
          body: JSON.stringify({ token: fcmToken }),
        });
        console.log("✅ FCM token saved to backend");
      }

      console.log("➡️ Redirecting to tabs...");
      router.replace("/(tabs)");
    } catch (e: any) {
      console.error("❌ Login error:", e);
      Alert.alert("Login failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
      console.log("⏹️ Login finished");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        value={phone}
        onChangeText={(v) => {
          setPhone(v);
          console.log("✍️ Typing phone:", v);
        }}
        placeholder="Phone number"
        keyboardType="phone-pad"
        maxLength={10}
        style={styles.input}
      />

      <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.RegisterBtn}
        onPress={() => {
          console.log("➡️ Go to login clicked");
          router.replace("/(auth)/register");
        }}
      >
        <Text style={styles.RegisterText}>
          create a account <Text style={styles.RegisterLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  btn: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  RegisterBtn: {
    marginTop: 25,
    alignItems: "center",
  },

  RegisterText: {
    color: "#64748b",
    fontSize: 14,
  },

  RegisterLink: {
    color: "#2563eb",
    fontWeight: "700",
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
