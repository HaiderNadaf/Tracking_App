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
//   TouchableWithoutFeedback,
//   Keyboard,
//   Animated,
//   Dimensions,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState, useRef, useEffect } from "react";
// import { registerForPushToken } from "../../services/push";

// const { height } = Dimensions.get("window");

// export default function Login() {
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Floating label animation
//   const phoneAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     Animated.timing(phoneAnim, {
//       toValue: phone.length > 0 ? 1 : 0,
//       duration: 220,
//       useNativeDriver: true,
//     }).start();
//   }, [phone]);

//   const submit = async () => {
//     console.log("🟢 Login clicked");
//     console.log("📞 Phone entered:", phone);

//     if (phone.length !== 10) {
//       Alert.alert(
//         "Invalid number",
//         "Please enter a valid 10-digit phone number.",
//       );
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

//   const getLabelStyle = () => ({
//     transform: [
//       {
//         translateY: phoneAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [26, 8],
//         }),
//       },
//       {
//         scale: phoneAnim.interpolate({
//           inputRange: [0, 1],
//           outputRange: [1, 0.82],
//         }),
//       },
//     ],
//   });

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.keyboardView}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 40}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.inner}>
//             {/* Header */}
//             <View style={styles.header}>
//               <Text style={styles.title}>Welcome Back</Text>
//               <Text style={styles.subtitle}>
//                 Sign in with your phone number
//               </Text>
//             </View>

//             {/* Form */}
//             <View style={styles.form}>
//               <View style={styles.field}>
//                 <Animated.Text
//                   style={[
//                     styles.floatingLabel,
//                     getLabelStyle(),
//                     phone.length > 0 && styles.labelActive,
//                   ]}
//                 ></Animated.Text>

//                 <TextInput
//                   style={[styles.input, phone.length > 0 && styles.inputFilled]}
//                   value={phone}
//                   onChangeText={(v) => {
//                     setPhone(v);
//                     console.log("✍️ Typing phone:", v);
//                   }}
//                   placeholder={
//                     phone.length === 0 ? "10-digit mobile number" : ""
//                   }
//                   placeholderTextColor="#a0aec0"
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                   autoCorrect={false}
//                   returnKeyType="done"
//                 />
//               </View>

//               {/* Login Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.submitButton,
//                   (phone.length !== 10 || loading) && styles.submitDisabled,
//                 ]}
//                 onPress={submit}
//                 disabled={loading || phone.length !== 10}
//                 activeOpacity={0.85}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" size="small" />
//                 ) : (
//                   <Text style={styles.buttonText}>Sign In</Text>
//                 )}
//               </TouchableOpacity>
//             </View>

//             {/* Register link */}
//             <TouchableOpacity
//               style={styles.registerRow}
//               onPress={() => {
//                 console.log("➡️ Go to register clicked");
//                 router.replace("/(auth)/register");
//               }}
//               activeOpacity={0.7}
//             >
//               <Text style={styles.registerText}>
//                 Don't have an account?{" "}
//                 <Text style={styles.registerLink}>Create one</Text>
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableWithoutFeedback>

//         {loading && (
//           <View style={styles.loadingOverlay}>
//             <ActivityIndicator size="large" color="#16a34a" />
//           </View>
//         )}
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   inner: {
//     flex: 1,
//     paddingHorizontal: 28,
//     paddingTop: height > 800 ? 100 : 60,
//     paddingBottom: 40,
//     justifyContent: "center",
//   },

//   header: {
//     alignItems: "center",
//     marginBottom: 48,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "700",
//     color: "#0f172a",
//     letterSpacing: -0.3,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#64748b",
//     marginTop: 8,
//     textAlign: "center",
//   },

//   form: {
//     gap: 28,
//   },

//   field: {
//     position: "relative",
//   },
//   floatingLabel: {
//     position: "absolute",
//     left: 16,
//     fontSize: 16,
//     color: "#94a3b8",
//     pointerEvents: "none",
//     zIndex: 1,
//   },
//   labelActive: {
//     color: "#16a34a",
//     fontWeight: "500",
//   },

//   input: {
//     backgroundColor: "#ffffff",
//     borderWidth: 1.5,
//     borderColor: "#e2e8f0",
//     borderRadius: 16,
//     paddingHorizontal: 16,
//     paddingTop: 22,
//     paddingBottom: 12,
//     fontSize: 16.5,
//     color: "#0f172a",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   inputFilled: {
//     borderColor: "#16a34a",
//     shadowOpacity: 0.12,
//     shadowRadius: 8,
//     elevation: 4,
//   },

//   submitButton: {
//     backgroundColor: "#16a34a",
//     borderRadius: 16,
//     paddingVertical: 18,
//     alignItems: "center",
//     marginTop: 12,
//     shadowColor: "#16a34a",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 10,
//     elevation: 6,
//   },
//   submitDisabled: {
//     backgroundColor: "#86efac",
//     shadowOpacity: 0.15,
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 17,
//     fontWeight: "600",
//   },

//   registerRow: {
//     alignItems: "center",
//     marginTop: 40,
//   },
//   registerText: {
//     fontSize: 15.5,
//     color: "#64748b",
//   },
//   registerLink: {
//     color: "#16a34a",
//     fontWeight: "600",
//   },

//   loadingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: "rgba(248,250,252,0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 999,
//   },
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
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { apiFetch } from "../../services/api";
import { useState, useRef, useEffect } from "react";
import { registerForPushToken } from "../../services/push";

const { height } = Dimensions.get("window");

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  /* Floating label animation */
  const phoneAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(phoneAnim, {
      toValue: phone.length > 0 ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [phone]);

  const submit = async () => {
    console.log("🟢 Login clicked:", phone);

    if (phone.length !== 10) {
      Alert.alert("Invalid number", "Enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ LOGIN */
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      console.log("✅ Login success:", res);

      /* 2️⃣ SAVE TOKENS */
      await AsyncStorage.multiSet([
        ["accessToken", res.accessToken],
        ["refreshToken", res.refreshToken],
        ["user", JSON.stringify(res.user)],
      ]);

      /* 3️⃣ REGISTER PUSH TOKEN */
      const fcmToken = await registerForPushToken();

      if (fcmToken) {
        const accessToken = res.accessToken;

        await apiFetch("/api/users/save-fcm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ token: fcmToken }),
        });

        console.log("🔔 FCM token saved");
      }

      /* 4️⃣ REDIRECT */
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("❌ Login error:", err);

      Alert.alert(
        "Login failed",
        err?.message || err?.response?.message || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    transform: [
      {
        translateY: phoneAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [26, 8],
        }),
      },
      {
        scale: phoneAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.82],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in with your phone number
              </Text>
            </View>

            {/* Input */}
            <View style={styles.field}>
              <Animated.Text
                style={[
                  styles.floatingLabel,
                  labelStyle,
                  phone.length > 0 && styles.labelActive,
                ]}
              ></Animated.Text>

              <TextInput
                style={[styles.input, phone.length > 0 && styles.inputFilled]}
                value={phone}
                onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={10}
                placeholder={phone ? "" : "10-digit mobile number"}
              />
            </View>

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (phone.length !== 10 || loading) && styles.submitDisabled,
              ]}
              onPress={submit}
              disabled={loading || phone.length !== 10}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Register */}
            <TouchableOpacity
              style={styles.registerRow}
              onPress={() => router.replace("/(auth)/register")}
            >
              <Text style={styles.registerText}>
                Don’t have an account?{" "}
                <Text style={styles.registerLink}>Create one</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#16a34a" />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  keyboardView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: height > 800 ? 100 : 60,
    paddingBottom: 40,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 8,
    textAlign: "center",
  },

  form: {
    gap: 28,
  },

  field: {
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    fontSize: 16,
    color: "#94a3b8",
    pointerEvents: "none",
    zIndex: 1,
  },
  labelActive: {
    color: "#16a34a",
    fontWeight: "500",
  },

  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 22,
    paddingBottom: 12,
    fontSize: 16.5,
    color: "#0f172a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  inputFilled: {
    borderColor: "#16a34a",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  submitButton: {
    backgroundColor: "#16a34a",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 12,
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitDisabled: {
    backgroundColor: "#86efac",
    shadowOpacity: 0.15,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
  },

  registerRow: {
    alignItems: "center",
    marginTop: 40,
  },
  registerText: {
    fontSize: 15.5,
    color: "#64748b",
  },
  registerLink: {
    color: "#16a34a",
    fontWeight: "600",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(248,250,252,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});
