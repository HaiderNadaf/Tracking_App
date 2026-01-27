// import { View, TextInput, Button, Alert, StyleSheet, Text } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     try {
//       if (!phone || phone.length < 10) {
//         Alert.alert("Enter valid phone number");
//         return;
//       }

//       setLoading(true);

//       console.log("🔐 Login attempt:", phone);

//       // ✅ CORRECT LOGIN API
//       const res = await apiFetch("/users/login", {
//         method: "POST",
//         body: JSON.stringify({ phone }),
//       });

//       console.log("✅ Login response:", res);

//       if (!res?._id) {
//         Alert.alert("User not found");
//         return;
//       }

//       await AsyncStorage.setItem("user", JSON.stringify(res));
//       router.replace("/(tabs)");
//     } catch (e: any) {
//       console.error("❌ Login error:", e);
//       if (e?.message) Alert.alert("Error", e.message);
//       else Alert.alert("Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//         style={styles.input}
//       />

//       <Button title={loading ? "Logging in..." : "Login"} onPress={submit} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
// });

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";
// import { Ionicons } from "@expo/vector-icons";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const isValidPhone = phone.trim().length === 10;

//   const submit = async () => {
//     if (!isValidPhone) {
//       Alert.alert(
//         "Invalid Number",
//         "Please enter a valid 10-digit phone number."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await apiFetch("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ phone: phone.trim() }),
//       });

//       if (!res?._id) {
//         Alert.alert("Not Found", "No account found with this phone number.");
//         return;
//       }

//       // await AsyncStorage.setItem("user", JSON.stringify(res));
//       await AsyncStorage.multiSet([
//         ["accessToken", res.accessToken],
//         ["refreshToken", res.refreshToken],
//         ["user", JSON.stringify(res.user)],
//       ]);

//       Alert.alert(
//         "Welcome Back!",
//         `Logged in as ${res.name || "User"}\nRole: ${res.role || "Unknown"}`,
//         [
//           {
//             text: "Continue",
//             onPress: () => router.replace("/(tabs)"),
//           },
//         ]
//       );
//     } catch (err: any) {
//       Alert.alert(
//         "Login Failed",
//         err.message || "Something went wrong. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <View style={styles.formCard}>
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>
//               Login to continue managing your tasks
//             </Text>

//             {/* Phone Input */}
//             <View style={styles.fieldContainer}>
//               <Text style={styles.fieldLabel}>Phone Number *</Text>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="call-outline"
//                   size={22}
//                   color="#64748b"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="10-digit mobile number"
//                   value={phone}
//                   onChangeText={setPhone}
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                   placeholderTextColor="#94a3b8"
//                 />
//               </View>

//               {phone.length > 0 && !isValidPhone && (
//                 <Text style={styles.errorText}>
//                   Please enter a valid 10-digit number
//                 </Text>
//               )}
//             </View>

//             {/* Login Button */}
//             <TouchableOpacity
//               style={[
//                 styles.loginButton,
//                 (!isValidPhone || loading) && styles.loginButtonDisabled,
//               ]}
//               onPress={submit}
//               disabled={!isValidPhone || loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#ffffff" size="small" />
//               ) : (
//                 <Text style={styles.loginButtonText}>Login</Text>
//               )}
//             </TouchableOpacity>

//             {/* Register Link */}
//             <TouchableOpacity
//               style={styles.registerLink}
//               onPress={() => router.replace("/(auth)/register")}
//             >
//               <Text style={styles.registerText}>
//                 Don't have an account?{" "}
//                 <Text style={styles.registerHighlight}>Create one</Text>
//               </Text>
//             </TouchableOpacity>

//             {/* Optional legal note / version info */}
//             <Text style={styles.footerText}>
//               By continuing, you agree to our{" "}
//               <Text style={styles.footerLink}>Terms</Text> &{" "}
//               <Text style={styles.footerLink}>Privacy Policy</Text>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f0fdf4",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: "center",
//     paddingHorizontal: 24,
//     paddingVertical: 40,
//   },

//   formCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 28,
//     padding: 32,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     elevation: 8,
//   },

//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     color: "#166534",
//     textAlign: "center",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 15,
//     color: "#64748b",
//     textAlign: "center",
//     marginBottom: 40,
//     lineHeight: 22,
//   },

//   fieldContainer: {
//     marginBottom: 24,
//   },
//   fieldLabel: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#475569",
//     marginBottom: 8,
//   },

//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderWidth: 1.5,
//     borderColor: "#cbd5e1",
//     borderRadius: 14,
//     backgroundColor: "#f9fafb",
//     overflow: "hidden",
//   },
//   inputIcon: {
//     paddingHorizontal: 16,
//   },
//   textInput: {
//     flex: 1,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: "#1e293b",
//   },
//   errorText: {
//     color: "#ef4444",
//     fontSize: 13,
//     marginTop: 6,
//     marginLeft: 4,
//   },

//   loginButton: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   loginButtonDisabled: {
//     backgroundColor: "#86efac",
//     opacity: 0.75,
//   },
//   loginButtonText: {
//     color: "#ffffff",
//     fontSize: 17,
//     fontWeight: "700",
//   },

//   registerLink: {
//     marginTop: 28,
//     alignItems: "center",
//   },
//   registerText: {
//     fontSize: 15,
//     color: "#64748b",
//   },
//   registerHighlight: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },

//   footerText: {
//     marginTop: 32,
//     fontSize: 13,
//     color: "#94a3b8",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   footerLink: {
//     color: "#2563eb",
//     fontWeight: "500",
//   },
// });

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ActivityIndicator,
//   SafeAreaView,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";
// import { registerForPushToken } from "../../services/push";

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     console.log("🟢 Login clicked");
//     console.log("📞 Phone entered:", phone);

//     if (phone.length !== 10) {
//       Alert.alert("Enter valid 10 digit number");
//       console.log("❌ Invalid phone length");
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("🚀 Sending login request...");

//       const res = await apiFetch("/api/auth/login", {
//         method: "POST",
//         body: JSON.stringify({ phone }),
//       });

//       console.log("✅ Login response:", res);

//       console.log("💾 Saving tokens & user to storage...");

//       await AsyncStorage.multiSet([
//         ["accessToken", res.accessToken],
//         ["refreshToken", res.refreshToken],
//         ["user", JSON.stringify(res.user)],
//       ]);

//       // 🔔 Register for push & send to backend
//       const fcmToken = await registerForPushToken();

//       if (fcmToken) {
//         await apiFetch("/api/users/save-fcm", {
//           method: "POST",
//           body: JSON.stringify({ token: fcmToken }),
//         });
//         console.log("✅ FCM token saved to backend");
//       }

//       console.log("➡️ Redirecting to tabs...");
//       router.replace("/(tabs)");
//     } catch (e: any) {
//       console.error("❌ Login error:", e);
//       Alert.alert("Login failed", e.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//       console.log("⏹️ Login finished");
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Login</Text>

//       <TextInput
//         value={phone}
//         onChangeText={(v) => {
//           setPhone(v);
//           console.log("✍️ Typing phone:", v);
//         }}
//         placeholder="Phone number"
//         keyboardType="phone-pad"
//         maxLength={10}
//         style={styles.input}
//       />

//       <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.btnText}>Login</Text>
//         )}
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.RegisterBtn}
//         onPress={() => {
//           console.log("➡️ Go to login clicked");
//           router.replace("/(auth)/register");
//         }}
//       >
//         <Text style={styles.RegisterText}>
//           create a account <Text style={styles.RegisterLink}>Register</Text>
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 24 },
//   title: {
//     fontSize: 26,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5e1",
//     padding: 14,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   btn: {
//     backgroundColor: "#16a34a",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//   },

//   RegisterBtn: {
//     marginTop: 25,
//     alignItems: "center",
//   },

//   RegisterText: {
//     color: "#64748b",
//     fontSize: 14,
//   },

//   RegisterLink: {
//     color: "#2563eb",
//     fontWeight: "700",
//   },
//   btnText: { color: "#fff", fontWeight: "700" },
// });

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
    if (phone.length !== 10) {
      Alert.alert("Enter valid 10 digit number");
      return;
    }

    try {
      setLoading(true);

      /* ================= LOGIN ================= */
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      /* ================= SAVE TOKENS ================= */
      await AsyncStorage.multiSet([
        ["accessToken", res.accessToken],
        ["refreshToken", res.refreshToken],
        ["user", JSON.stringify(res.user)],
      ]);

      /* ================= PUSH TOKEN ================= */
      const expoToken = await registerForPushToken();

      if (expoToken) {
        await apiFetch("/api/users/save-fcm", {
          method: "POST",
          body: JSON.stringify({ token: expoToken }),
        });
        console.log("✅ Expo push token saved");
      } else {
        console.log("⚠️ No push token generated");
      }

      /* ================= GO TO APP ================= */
      router.replace("/(tabs)");
    } catch (e: any) {
      console.error("❌ Login error:", e);
      Alert.alert("Login failed", e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        value={phone}
        onChangeText={setPhone}
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
        style={styles.registerBtn}
        onPress={() => router.replace("/(auth)/register")}
      >
        <Text style={styles.registerText}>
          Create an account <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

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
  btnText: { color: "#fff", fontWeight: "700" },

  registerBtn: {
    marginTop: 25,
    alignItems: "center",
  },
  registerText: {
    color: "#64748b",
    fontSize: 14,
  },
  registerLink: {
    color: "#2563eb",
    fontWeight: "700",
  },
});
