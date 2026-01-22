// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState<"field_guy" | "office">("field_guy");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     try {
//       if (!name || !phone) {
//         Alert.alert("Fill all fields");
//         return;
//       }

//       if (phone.length < 10) {
//         Alert.alert("Enter valid phone number");
//         return;
//       }

//       setLoading(true);

//       const res = await apiFetch("/users", {
//         method: "POST",
//         body: JSON.stringify({ name, phone, role }),
//       });

//       if (!res?._id) {
//         Alert.alert("Registration failed");
//         return;
//       }

//       // ✅ SHOW DETAILS AFTER REGISTER
//       Alert.alert(
//         "User Registered ✅",
//         `Name: ${res.name}\nPhone: ${res.phone}\nRole: ${res.role}`,
//         [
//           {
//             text: "Continue",
//             onPress: async () => {
//               await AsyncStorage.setItem("user", JSON.stringify(res));
//               router.replace("/(tabs)");
//             },
//           },
//         ]
//       );
//     } catch (e: any) {
//       if (e?.message) Alert.alert("Error", e.message);
//       else Alert.alert("Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Create Account</Text>

//       <TextInput
//         placeholder="Full Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />

//       <TextInput
//         placeholder="Phone Number"
//         value={phone}
//         onChangeText={setPhone}
//         keyboardType="phone-pad"
//         style={styles.input}
//       />

//       {/* ✅ ROLE SELECT */}
//       <Text style={styles.label}>Select Role</Text>

//       <View style={styles.roleRow}>
//         <TouchableOpacity
//           style={[styles.roleBtn, role === "field_guy" && styles.activeRole]}
//           onPress={() => setRole("field_guy")}
//         >
//           <Text
//             style={[
//               styles.roleText,
//               role === "field_guy" && styles.activeRoleText,
//             ]}
//           >
//             Field Executive
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[styles.roleBtn, role === "office" && styles.activeRole]}
//           onPress={() => setRole("office")}
//         >
//           <Text
//             style={[
//               styles.roleText,
//               role === "office" && styles.activeRoleText,
//             ]}
//           >
//             Office Staff
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <Button
//         title={loading ? "Registering..." : "Register"}
//         onPress={submit}
//       />

//       <TouchableOpacity
//         style={styles.loginBtn}
//         onPress={() => {
//           console.log("➡️ Redirect to Login");
//           router.replace("/(auth)/login");
//         }}
//       >
//         <Text style={styles.loginText}>Already have an account? Login</Text>
//       </TouchableOpacity>
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
//     borderColor: "#cbd5f5",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 14,
//   },

//   label: { marginBottom: 8, fontWeight: "600" },

//   roleRow: { flexDirection: "row", marginBottom: 20 },

//   roleBtn: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#cbd5f5",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginRight: 10,
//   },

//   activeRole: {
//     backgroundColor: "#2563eb",
//     borderColor: "#2563eb",
//   },

//   loginBtn: {
//     marginTop: 16,
//     alignItems: "center",
//   },

//   loginText: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },

//   roleText: { color: "#334155", fontWeight: "600" },
//   activeRoleText: { color: "#fff" },
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
// import { Picker } from "@react-native-picker/picker"; // ← added
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";
// import { Ionicons } from "@expo/vector-icons";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState<"field_guy" | "office">("field_guy");
//   const [loading, setLoading] = useState(false);

//   const isFormValid = name.trim().length >= 2 && phone.trim().length === 10;

//   const submit = async () => {
//     if (!isFormValid) {
//       Alert.alert(
//         "Incomplete",
//         "Please enter a valid name and 10-digit phone number."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await apiFetch("/users", {
//         method: "POST",
//         body: JSON.stringify({
//           name: name.trim(),
//           phone: phone.trim(),
//           role,
//         }),
//       });

//       if (!res?._id) {
//         throw new Error("Registration failed - no user ID returned");
//       }

//       await AsyncStorage.setItem("user", JSON.stringify(res));

//       Alert.alert(
//         "Account Created!",
//         `Welcome, ${res.name}!\n\nPhone: ${res.phone}\nRole: ${res.role}`,
//         [
//           {
//             text: "Continue",
//             onPress: () => router.replace("/(tabs)"),
//           },
//         ]
//       );
//     } catch (err: any) {
//       Alert.alert(
//         "Error",
//         err.message || "Registration failed. Please try again."
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
//             <Text style={styles.title}>Create Your Account</Text>
//             <Text style={styles.subtitle}>
//               Join the team and start managing tasks
//             </Text>

//             {/* Full Name */}
//             <View style={styles.fieldContainer}>
//               <Text style={styles.fieldLabel}>Full Name *</Text>
//               <View style={styles.inputContainer}>
//                 <Ionicons
//                   name="person-outline"
//                   size={22}
//                   color="#64748b"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   placeholder="Enter your full name"
//                   value={name}
//                   onChangeText={setName}
//                   autoCapitalize="words"
//                   placeholderTextColor="#94a3b8"
//                 />
//               </View>
//             </View>

//             {/* Phone Number */}
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
//               {phone.length > 0 && phone.length !== 10 && (
//                 <Text style={styles.errorMessage}>
//                   Please enter a valid 10-digit number
//                 </Text>
//               )}
//             </View>

//             {/* Role Dropdown */}
//             <View style={styles.fieldContainer}>
//               <Text style={styles.fieldLabel}>Select Your Role *</Text>
//               <View style={styles.pickerContainer}>
//                 <Picker
//                   selectedValue={role}
//                   onValueChange={(itemValue: "field_guy" | "office") =>
//                     setRole(itemValue)
//                   }
//                   style={styles.picker}
//                   dropdownIconColor="#4d7c0f"
//                 >
//                   <Picker.Item
//                     label="Field Executive"
//                     value="field_guy"
//                     color="#1e293b"
//                   />
//                   <Picker.Item
//                     label="Office Staff"
//                     value="office"
//                     color="#1e293b"
//                   />
//                 </Picker>
//               </View>
//             </View>

//             {/* Create Account Button */}
//             <TouchableOpacity
//               style={[
//                 styles.createButton,
//                 (!isFormValid || loading) && styles.createButtonDisabled,
//               ]}
//               onPress={submit}
//               disabled={!isFormValid || loading}
//             >
//               {loading ? (
//                 <ActivityIndicator color="#ffffff" size="small" />
//               ) : (
//                 <Text style={styles.createButtonText}>Create Account</Text>
//               )}
//             </TouchableOpacity>

//             {/* Login Link */}
//             <TouchableOpacity
//               style={styles.loginContainer}
//               onPress={() => router.replace("/(auth)/login")}
//             >
//               <Text style={styles.loginText}>
//                 Already have an account?{" "}
//                 <Text style={styles.loginLinkText}>Login</Text>
//               </Text>
//             </TouchableOpacity>

//             {/* Legal text */}
//             <Text style={styles.legalText}>
//               By continuing, you agree to our{" "}
//               <Text style={styles.legalLink}>Terms of Service</Text> and{" "}
//               <Text style={styles.legalLink}>Privacy Policy</Text>
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
//   errorMessage: {
//     color: "#ef4444",
//     fontSize: 13,
//     marginTop: 6,
//     marginLeft: 4,
//   },

//   // Dropdown styles
//   pickerContainer: {
//     borderWidth: 1.5,
//     borderColor: "#cbd5e1",
//     borderRadius: 14,
//     backgroundColor: "#f9fafb",
//     overflow: "hidden",
//   },
//   picker: {
//     color: "#1e293b",
//     paddingHorizontal: 12,
//     height: 52,
//   },

//   createButton: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   createButtonDisabled: {
//     backgroundColor: "#86efac",
//     opacity: 0.75,
//   },
//   createButtonText: {
//     color: "#ffffff",
//     fontSize: 17,
//     fontWeight: "700",
//   },

//   loginContainer: {
//     marginTop: 28,
//     alignItems: "center",
//   },
//   loginText: {
//     fontSize: 15,
//     color: "#64748b",
//   },
//   loginLinkText: {
//     color: "#2563eb",
//     fontWeight: "600",
//   },

//   legalText: {
//     marginTop: 32,
//     fontSize: 13,
//     color: "#94a3b8",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   legalLink: {
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
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async () => {
//     console.log("🟢 Register clicked");
//     console.log("📤 Name:", name);
//     console.log("📤 Phone:", phone);

//     if (!name || phone.length !== 10) {
//       Alert.alert("Fill valid details");
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("🚀 Sending register request...");

//       const res = await apiFetch("/users", {
//         method: "POST",
//         body: JSON.stringify({ name, phone, role: "field_guy" }),
//       });

//       console.log("✅ Register success:", res);

//       Alert.alert("Success", "Account created. Please login.");

//       router.replace("/(auth)/login");
//     } catch (e: any) {
//       console.error("❌ Register error:", e);
//       Alert.alert("Register failed", e.message);
//     } finally {
//       setLoading(false);
//       console.log("⏹️ Register finished");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>

//       <TextInput
//         value={name}
//         onChangeText={setName}
//         placeholder="Name"
//         style={styles.input}
//       />

//       <TextInput
//         value={phone}
//         onChangeText={setPhone}
//         placeholder="Phone"
//         keyboardType="phone-pad"
//         maxLength={10}
//         style={styles.input}
//       />

//       {/* ✅ REGISTER BUTTON */}
//       <TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.btnText}>Create Account</Text>
//         )}
//       </TouchableOpacity>

//       {/* ✅ LOGIN BUTTON */}
//       <TouchableOpacity
//         style={styles.loginBtn}
//         onPress={() => {
//           console.log("➡️ Go to login clicked");
//           router.replace("/(auth)/login");
//         }}
//       >
//         <Text style={styles.loginText}>
//           Already have an account? <Text style={styles.loginLink}>Login</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
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
//     backgroundColor: "#2563eb",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },

//   btnText: { color: "#fff", fontWeight: "700" },

//   loginBtn: {
//     marginTop: 25,
//     alignItems: "center",
//   },

//   loginText: {
//     color: "#64748b",
//     fontSize: 14,
//   },

//   loginLink: {
//     color: "#2563eb",
//     fontWeight: "700",
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
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { apiFetch } from "../../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isFormValid = name.trim().length >= 2 && phone.length === 10;

  const submit = async () => {
    if (!isFormValid) {
      Alert.alert(
        "Incomplete",
        "Please enter a valid name and 10-digit phone number.",
      );
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), phone, role: "field_guy" }),
      });

      Alert.alert("Success", "Account created!\nPlease login to continue.", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      const message = err?.message?.includes("already exists")
        ? "This phone number is already registered."
        : err?.message || "Something went wrong. Please try again.";
      Alert.alert("Registration Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Enter your details to get started
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="John Doe"
                  placeholderTextColor="#9ca3af"
                  style={[
                    styles.input,
                    focusedField === "name" && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedField("name")}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
                  placeholder="9876543210"
                  placeholderTextColor="#9ca3af"
                  style={[
                    styles.input,
                    focusedField === "phone" && styles.inputFocused,
                  ]}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={[styles.btn, !isFormValid && styles.btnDisabled]}
                onPress={submit}
                disabled={loading || !isFormValid}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.btnText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => router.replace("/(auth)/login")}
              activeOpacity={0.7}
            >
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLink}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  inputFocused: {
    borderColor: "#3b82f6",
    backgroundColor: "#ffffff",
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  btn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 12,
  },
  btnDisabled: {
    backgroundColor: "#93c5fd",
    opacity: 0.7,
  },
  btnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  loginLinkContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: "#6b7280",
  },
  loginLink: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
