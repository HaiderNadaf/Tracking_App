// import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function Profile() {
//   const router = useRouter();

//   // demo data — later replace with API data
//   const user = {
//     name: "Haider Nadaf",
//     phone: "9900768505",
//     role: "Field Executive",
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem("token");
//     router.replace("/(auth)/register");
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.card}>
//         <Image
//           source={require("../../assets/images/avatar.png")} // optional avatar
//           style={styles.avatar}
//         />

//         <Text style={styles.name}>{user.name}</Text>
//         <Text style={styles.text}>{user.phone}</Text>
//         <Text style={styles.role}>{user.role}</Text>

//         <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f8fafc", justifyContent: "center" },
//   card: {
//     margin: 20,
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 24,
//     alignItems: "center",
//     elevation: 4,
//   },
//   avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
//   name: { fontSize: 20, fontWeight: "700" },
//   text: { color: "#64748b", marginTop: 4 },
//   role: {
//     marginTop: 6,
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     color: "#0369a1",
//   },
//   logoutBtn: {
//     marginTop: 24,
//     backgroundColor: "#ef4444",
//     paddingVertical: 12,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   logoutText: { color: "#fff", fontWeight: "600" },
// });

// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { useState, useEffect } from "react";

// export default function Profile() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [loadingLogout, setLoadingLogout] = useState(false);
//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     // Set current date
//     const date = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     };
//     setCurrentDate(date.toLocaleDateString("en-IN", options));

//     // Load user from storage
//     loadUser();
//   }, []);

//   const loadUser = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) {
//         Alert.alert("Session Expired", "Please login again.");
//         router.replace("/(auth)/register");
//         return;
//       }

//       const parsedUser = JSON.parse(userStr);
//       setUser(parsedUser);
//     } catch (err) {
//       console.error("Failed to load user:", err);
//       Alert.alert("Error", "Failed to load profile data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDisplayRole = (role: string) => {
//     if (role === "field_guy") return "Field Executive";
//     if (role === "office") return "Office Staff";
//     return role || "Unknown Role";
//   };

//   const handleLogout = () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to log out?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Yes, Logout",
//           style: "destructive",
//           onPress: async () => {
//             setLoadingLogout(true);
//             try {
//               await AsyncStorage.multiRemove(["token", "user"]);
//               router.replace("/(auth)/register");
//             } catch (err) {
//               Alert.alert("Error", "Failed to logout. Please try again.");
//             } finally {
//               setLoadingLogout(false);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   if (loading) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#4d7c0f" />
//           <Text style={styles.loadingText}>Loading profile...</Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   if (!user) {
//     return (
//       <SafeAreaView style={styles.safeArea}>
//         <View style={styles.loadingContainer}>
//           <Text style={styles.errorText}>No user data found</Text>
//           <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
//             <Text style={styles.retryText}>Go to Login</Text>
//           </TouchableOpacity>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.profileHeaderRow}>
//             <View
//               style={{ flexDirection: "row", alignItems: "center", gap: 14 }}
//             >
//               <View style={styles.avatarWrapper}>
//                 <Image
//                   source={require("../../assets/images/field_avatar.png")}
//                   style={styles.avatar}
//                 />
//               </View>
//               <View>
//                 <Text style={styles.greeting}>
//                   Hi, {user.name?.split(" ")[0] || "User"}
//                 </Text>
//                 <Text style={styles.dateText}>{currentDate}</Text>
//               </View>
//             </View>

//             <View style={styles.brandContainer}>
//               <Image
//                 source={require("../../assets/images/oneroot_backside2.png")}
//                 style={styles.brandLogo}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Main Profile Card */}
//         <View style={styles.centerContent}>
//           <View style={styles.profileCard}>
//             <View style={styles.infoBlock}>
//               <Text style={styles.sectionTitle}>Account Information</Text>

//               <View style={styles.infoItem}>
//                 <Ionicons name="person-outline" size={22} color="#4d7c0f" />
//                 <View style={styles.infoTextBlock}>
//                   <Text style={styles.infoLabel}>Name</Text>
//                   <Text style={styles.infoValue}>{user.name || "N/A"}</Text>
//                 </View>
//               </View>

//               <View style={styles.infoItem}>
//                 <Ionicons name="call-outline" size={22} color="#4d7c0f" />
//                 <View style={styles.infoTextBlock}>
//                   <Text style={styles.infoLabel}>Phone</Text>
//                   <Text style={styles.infoValue}>
//                     +91 {user.phone || "N/A"}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoItem}>
//                 <Ionicons
//                   name="shield-checkmark-outline"
//                   size={22}
//                   color="#4d7c0f"
//                 />
//                 <View style={styles.infoTextBlock}>
//                   <Text style={styles.infoLabel}>Role</Text>
//                   <View style={styles.roleBadge}>
//                     <Text style={styles.roleText}>
//                       {getDisplayRole(user.role)}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* Logout Button */}
//             <TouchableOpacity
//               style={[
//                 styles.logoutButton,
//                 loadingLogout && styles.logoutButtonDisabled,
//               ]}
//               onPress={handleLogout}
//               disabled={loadingLogout}
//             >
//               {loadingLogout ? (
//                 <ActivityIndicator color="#ffffff" size="small" />
//               ) : (
//                 <>
//                   <Ionicons name="log-out-outline" size={20} color="#ffffff" />
//                   <Text style={styles.logoutButtonText}>Logout</Text>
//                 </>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>
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
//     paddingHorizontal: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: "#64748b",
//   },
//   errorText: {
//     fontSize: 18,
//     color: "#ef4444",
//     marginBottom: 16,
//   },
//   retryText: {
//     color: "#2563eb",
//     fontWeight: "600",
//     fontSize: 16,
//   },

//   // Header
//   header: {
//     paddingTop: 12,
//     paddingBottom: 28,
//     marginTop: 100,
//   },
//   profileHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   avatarWrapper: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     overflow: "hidden",
//     borderWidth: 3,
//     borderColor: "#bbf7d0",
//   },
//   avatar: {
//     width: "100%",
//     height: "100%",
//   },
//   greeting: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#166534",
//   },
//   dateText: {
//     fontSize: 14,
//     color: "#64748b",
//     marginTop: 2,
//   },
//   brandContainer: {
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   brandLogo: {
//     width: 80,
//     height: 30,
//     resizeMode: "contain",
//   },

//   // Center wrapper
//   centerContent: {
//     justifyContent: "center",
//     paddingVertical: 20,
//   },

//   // Profile Card
//   profileCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 20,
//     padding: 28,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 20,
//   },
//   infoBlock: {
//     marginBottom: 32,
//   },
//   infoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     gap: 16,
//   },
//   infoTextBlock: {
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1e293b",
//   },
//   roleBadge: {
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//   },
//   roleText: {
//     color: "#0369a1",
//     fontSize: 14,
//     fontWeight: "600",
//   },

//   // Logout
//   logoutButton: {
//     flexDirection: "row",
//     backgroundColor: "#dc2626",
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   logoutButtonDisabled: {
//     backgroundColor: "#fca5a5",
//     opacity: 0.75,
//   },
//   logoutButtonText: {
//     color: "#ffffff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

// import { View, Text, StyleSheet, Button } from "react-native";
// import { useEffect, useState } from "react";
// import { apiFetch } from "../../services/api";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";

// export default function Profile() {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     load();
//   }, []);

//   const load = async () => {
//     const res = await apiFetch("/users/me");
//     setUser(res);
//   };

//   const logout = async () => {
//     await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
//     router.replace("/(auth)/login");
//   };

//   if (!user) return null;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.name}>{user.name}</Text>
//       <Text>{user.phone}</Text>
//       <Text>{user.role}</Text>

//       <Button title="Logout" onPress={logout} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 24 },
//   name: { fontSize: 22, fontWeight: "700", marginBottom: 10 },
// });
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { apiFetch } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const res = await apiFetch("/api/users/me");
      setUser(res);
    } catch (err: any) {
      console.error("Profile load error:", err);
      Alert.alert("Error", "Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove([
                "accessToken",
                "refreshToken",
                "user",
              ]);
              router.replace("/(auth)/login");
            } catch (err) {
              console.error("Logout error:", err);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4d7c0f" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ef4444" />
        <Text style={styles.errorText}>No profile data found</Text>
        <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
          <Text style={styles.retryText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={100} color="#4d7c0f" />
        </View>

        <Text style={styles.name}>{user.name || "User"}</Text>
        <Text style={styles.phone}>+91 {user.phone || "Not available"}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {user.role?.replace("_", " ").toUpperCase() || "USER"}
          </Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={22} color="#4d7c0f" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+91 {user.phone || "N/A"}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#4d7c0f" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>
              {user.role?.replace("_", " ").toUpperCase() || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={22} color="#4d7c0f" />
          <View style={styles.infoText}>
            <Text style={styles.infoLabel}>Joined</Text>
            <Text style={styles.infoValue}>
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "N/A"}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#ffffff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
  },
  errorText: {
    fontSize: 18,
    color: "#ef4444",
    marginTop: 16,
    marginBottom: 24,
  },
  retryText: {
    color: "#3b82f6",
    fontSize: 16,
    fontWeight: "600",
  },

  // Header
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  phone: {
    fontSize: 16,
    color: "#6b7280",
    marginBottom: 12,
  },
  roleBadge: {
    backgroundColor: "#ecfdf5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#a7f3d0",
  },
  roleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065f46",
    textTransform: "uppercase",
  },

  // Info Card
  infoCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoText: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },

  // Logout
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dc2626",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    gap: 10,
  },
  logoutText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});
