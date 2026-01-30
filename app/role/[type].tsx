// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";

// export default function RolePage() {
//   const { type } = useLocalSearchParams<{ type: string }>();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Role: {type}</Text>

//       {/* ✅ ONBOARD */}
//       <TouchableOpacity
//         style={styles.btn}
//         onPress={() => router.push("/meet/onbaord-aggregator")}
//       >
//         <Text style={styles.btnText}>Onboard Aggregator</Text>
//       </TouchableOpacity>

//       {/* ✅ MEET */}
//       <TouchableOpacity
//         style={[styles.btn, { backgroundColor: "#2563eb" }]}
//         onPress={() => router.push("/meet/start")}
//       >
//         <Text style={styles.btnText}>Meet Aggregator</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f8fafc",
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 30,
//   },
//   btn: {
//     backgroundColor: "#22c55e",
//     padding: 18,
//     borderRadius: 14,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
// } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";

// export default function RolePage() {
//   const { type } = useLocalSearchParams<{ type: string }>();

//   const [currentDate, setCurrentDate] = useState("");

//   useEffect(() => {
//     const date = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     };
//     setCurrentDate(date.toLocaleDateString("en-IN", options));
//   }, []);

//   const roleDisplayName =
//     type === "field"
//       ? "Field Guy"
//       : type === "agronomist"
//         ? "Agronomist"
//         : type?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
//           "Role";

//   const isFieldGuy = type === "field";

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.scrollContainer}>
//         {/* Header – consistent with your main home */}
//         <View style={styles.header}>
//           <View style={styles.profileSection}>
//             <View
//               style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
//             >
//               <View style={styles.avatar}>
//                 <Image
//                   source={require("../../assets/images/field_guy.png")} // ← adjust path
//                   style={styles.avatarImage}
//                 />
//               </View>
//               <View>
//                 <Text style={styles.greeting}>{roleDisplayName}</Text>
//                 <Text style={styles.date}>{currentDate}</Text>
//               </View>
//             </View>

//             <View style={styles.brandChip}>
//               <Image
//                 source={require("../../assets/images/oneroot_backside2.png")}
//                 style={styles.BrandImg}
//               />
//             </View>
//           </View>
//         </View>

//         {/* Main content */}
//         <View style={styles.content}>
//           <Text style={styles.sectionTitle}>What would you like to do?</Text>

//           {/* Onboard Aggregator Card */}
//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => router.push("/meet/onbaord-aggregator")}
//             activeOpacity={0.78}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: "#4d7c0f15" }]}>
//               <Ionicons name="people-outline" size={28} color="#4d7c0f" />
//             </View>

//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Onboard Aggregator</Text>
//               <Text style={styles.cardSubtitle}>
//                 Register new aggregators and add them to the network
//               </Text>
//             </View>

//             <Ionicons name="chevron-forward" size={24} color="#64748b" />
//           </TouchableOpacity>

//           {/* Meet Aggregator Card */}
//           <TouchableOpacity
//             style={[
//               styles.actionCard,
//               isFieldGuy ? {} : { borderColor: "#2563eb", borderWidth: 1.5 },
//             ]}
//             onPress={() => router.push("/meet/start")}
//             activeOpacity={0.78}
//           >
//             <View
//               style={[
//                 styles.iconCircle,
//                 {
//                   backgroundColor: isFieldGuy ? "#2563eb15" : "#2563eb25",
//                 },
//               ]}
//             >
//               <Ionicons
//                 name="videocam-outline"
//                 size={28}
//                 color={isFieldGuy ? "#2563eb" : "#1e40af"}
//               />
//             </View>

//             <View style={styles.cardTextContainer}>
//               <Text
//                 style={[styles.cardTitle, !isFieldGuy && { color: "#1e40af" }]}
//               >
//                 Meet Aggregator
//               </Text>
//               <Text style={styles.cardSubtitle}>
//                 Start video call or schedule meeting with aggregator
//               </Text>
//             </View>

//             <Ionicons name="chevron-forward" size={24} color="#64748b" />
//           </TouchableOpacity>

//           {/* Optional: future actions can be added here as more cards */}
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
//   scrollContainer: {
//     flex: 1,
//   },

//   header: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 20,
//   },
//   profileSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "#bbf7d0",
//   },
//   avatarImage: {
//     width: "108%",
//     height: "108%",
//   },
//   greeting: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#166534",
//   },
//   date: {
//     color: "#64748b",
//     fontSize: 14,
//   },
//   brandChip: {
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   BrandImg: {
//     width: 80,
//     height: 30,
//     resizeMode: "contain",
//   },

//   content: {
//     paddingHorizontal: 16,
//     paddingBottom: 40,
//   },
//   sectionTitle: {
//     fontSize: 19,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 20,
//   },

//   actionCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.07,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   iconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   cardTextContainer: {
//     flex: 1,
//   },
//   cardTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 4,
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: "#64748b",
//     lineHeight: 20,
//   },
// });

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiFetch } from "../../services/api";

// /* ================= TYPES ================= */

// type Task = {
//   _id: string;
//   title: string;
//   description?: string;
//   createdAt: string;
// };

// /* ================= PAGE ================= */

// export default function RolePage() {
//   const { type } = useLocalSearchParams<{ type: string }>();

//   const [currentDate, setCurrentDate] = useState("");

//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [loadingTasks, setLoadingTasks] = useState(false);
//   const [completingId, setCompletingId] = useState<string | null>(null);

//   /* ================= DATE ================= */

//   useEffect(() => {
//     const date = new Date();
//     const options: Intl.DateTimeFormatOptions = {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     };
//     setCurrentDate(date.toLocaleDateString("en-IN", options));
//   }, []);

//   /* ================= FETCH TASKS ================= */

//   const fetchTasks = async () => {
//     try {
//       setLoadingTasks(true);

//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) {
//         console.log("❌ No user in AsyncStorage");
//         return;
//       }

//       const user = JSON.parse(userStr);

//       console.log("📡 Fetching tasks for user:", user._id);

//       const data = await apiFetch(`/api/tasks/user/${user._id}`);
//       setTasks(data || []);
//     } catch (err) {
//       console.error("❌ TASK FETCH ERROR:", err);
//       Alert.alert("Failed to load tasks");
//     } finally {
//       setLoadingTasks(false);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   /* ================= COMPLETE TASK ================= */

//   const completeTask = async (taskId: string) => {
//     try {
//       setCompletingId(taskId);

//       await apiFetch(`/api/tasks/${taskId}/complete`, {
//         method: "POST",
//       });

//       setTasks((prev) => prev.filter((t) => t._id !== taskId));

//       Alert.alert("Task Completed ✅");
//     } catch (err) {
//       console.error("❌ COMPLETE TASK ERROR:", err);
//       Alert.alert("Failed to complete task");
//     } finally {
//       setCompletingId(null);
//     }
//   };

//   /* ================= ROLE ================= */

//   const roleDisplayName =
//     type === "field"
//       ? "Field Guy"
//       : type === "agronomist"
//         ? "Agronomist"
//         : type?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
//           "Role";

//   const isFieldGuy = type === "field";

//   /* ================= UI ================= */

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView style={styles.scrollContainer}>
//         {/* HEADER */}
//         <View style={styles.header}>
//           <View style={styles.profileSection}>
//             <View
//               style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
//             >
//               <View style={styles.avatar}>
//                 <Image
//                   source={require("../../assets/images/field_guy.png")}
//                   style={styles.avatarImage}
//                 />
//               </View>
//               <View>
//                 <Text style={styles.greeting}>{roleDisplayName}</Text>
//                 <Text style={styles.date}>{currentDate}</Text>
//               </View>
//             </View>

//             <View style={styles.brandChip}>
//               <Image
//                 source={require("../../assets/images/oneroot_backside2.png")}
//                 style={styles.BrandImg}
//               />
//             </View>
//           </View>
//         </View>

//         {/* ===== ACTIONS ===== */}
//         <View style={styles.content}>
//           <Text style={styles.sectionTitle}>What would you like to do?</Text>

//           <TouchableOpacity
//             style={styles.actionCard}
//             onPress={() => router.push("/meet/onbaord-aggregator")}
//             activeOpacity={0.78}
//           >
//             <View style={[styles.iconCircle, { backgroundColor: "#4d7c0f15" }]}>
//               <Ionicons name="people-outline" size={28} color="#4d7c0f" />
//             </View>

//             <View style={styles.cardTextContainer}>
//               <Text style={styles.cardTitle}>Onboard Aggregator</Text>
//               <Text style={styles.cardSubtitle}>
//                 Register new aggregators and add them to the network
//               </Text>
//             </View>

//             <Ionicons name="chevron-forward" size={24} color="#64748b" />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.actionCard,
//               isFieldGuy ? {} : { borderColor: "#2563eb", borderWidth: 1.5 },
//             ]}
//             onPress={() => router.push("/meet/start")}
//             activeOpacity={0.78}
//           >
//             <View
//               style={[
//                 styles.iconCircle,
//                 { backgroundColor: isFieldGuy ? "#2563eb15" : "#2563eb25" },
//               ]}
//             >
//               <Ionicons
//                 name="videocam-outline"
//                 size={28}
//                 color={isFieldGuy ? "#2563eb" : "#1e40af"}
//               />
//             </View>

//             <View style={styles.cardTextContainer}>
//               <Text
//                 style={[styles.cardTitle, !isFieldGuy && { color: "#1e40af" }]}
//               >
//                 Meet Aggregator
//               </Text>
//               <Text style={styles.cardSubtitle}>
//                 Start video call or schedule meeting with aggregator
//               </Text>
//             </View>

//             <Ionicons name="chevron-forward" size={24} color="#64748b" />
//           </TouchableOpacity>
//         </View>

//         {/* ===== MY TASKS ===== */}
//         <View style={styles.content}>
//           <Text style={styles.sectionTitle}>My Assigned Tasks</Text>

//           {loadingTasks ? (
//             <ActivityIndicator />
//           ) : tasks.length === 0 ? (
//             <Text style={{ color: "#64748b" }}>No pending tasks 🎉</Text>
//           ) : (
//             tasks.map((task) => (
//               <View key={task._id} style={styles.taskCard}>
//                 <View style={{ flex: 1 }}>
//                   <Text style={styles.taskTitle}>{task.title}</Text>
//                   {task.description && (
//                     <Text style={styles.taskDesc}>{task.description}</Text>
//                   )}
//                 </View>

//                 <TouchableOpacity
//                   style={styles.completeBtn}
//                   disabled={completingId === task._id}
//                   onPress={() => completeTask(task._id)}
//                 >
//                   {completingId === task._id ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <Ionicons name="checkmark" size={20} color="#fff" />
//                   )}
//                 </TouchableOpacity>
//               </View>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f0fdf4" },
//   scrollContainer: { flex: 1 },

//   header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
//   profileSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "#bbf7d0",
//   },
//   avatarImage: { width: "108%", height: "108%" },
//   greeting: { fontSize: 22, fontWeight: "700", color: "#166534" },
//   date: { color: "#64748b", fontSize: 14 },
//   brandChip: {
//     backgroundColor: "#e0f2fe",
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     borderRadius: 20,
//   },
//   BrandImg: { width: 80, height: 30, resizeMode: "contain" },

//   content: { paddingHorizontal: 16, paddingBottom: 24 },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 12,
//   },

//   taskCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 14,
//     padding: 14,
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   taskTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
//   taskDesc: { fontSize: 13, color: "#64748b" },
//   completeBtn: {
//     backgroundColor: "#16a34a",
//     padding: 10,
//     borderRadius: 999,
//     marginLeft: 12,
//   },

//   actionCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   iconCircle: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 16,
//   },
//   cardTextContainer: { flex: 1 },
//   cardTitle: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 4,
//   },
//   cardSubtitle: { fontSize: 14, color: "#64748b", lineHeight: 20 },
// });

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../../services/api";

/* enable animation on android */
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

/* ================= TYPES ================= */

type Task = {
  _id: string;
  title: string;
  description?: string;
  createdAt: string;
};

/* ================= PAGE ================= */

export default function RolePage() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const [currentDate, setCurrentDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  /* ================= DATE ================= */

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
  }, []);

  /* ================= FETCH TASKS ================= */

  const fetchTasks = async () => {
    try {
      setLoadingTasks(true);

      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);

      const data = await apiFetch(`/api/tasks/user/${user._id}`);
      setTasks(data || []);
    } catch (err) {
      console.error("❌ TASK FETCH ERROR:", err);
      Alert.alert("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  /* ================= COMPLETE TASK ================= */

  const completeTask = async (taskId: string) => {
    try {
      setCompletingId(taskId);

      await apiFetch(`/api/tasks/${taskId}/complete`, { method: "POST" });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));

      Alert.alert("Task Completed ✅");
    } catch (err) {
      console.error("❌ COMPLETE TASK ERROR:", err);
      Alert.alert("Failed to complete task");
    } finally {
      setCompletingId(null);
    }
  };

  /* ================= ROLE ================= */

  const roleDisplayName =
    type === "field"
      ? "Field Guy"
      : type === "agronomist"
        ? "Agronomist"
        : type?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
          "Role";

  const isFieldGuy = type === "field";

  /* ================= UI ================= */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View style={styles.avatar}>
                <Image
                  source={require("../../assets/images/field_guy.png")}
                  style={styles.avatarImage}
                />
              </View>
              <View>
                <Text style={styles.greeting}>{roleDisplayName}</Text>
                <Text style={styles.date}>{currentDate}</Text>
              </View>
            </View>

            <View style={styles.brandChip}>
              <Image
                source={require("../../assets/images/oneroot_backside2.png")}
                style={styles.BrandImg}
              />
            </View>
          </View>
        </View>

        {/* ===== ACTIONS ===== */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/meet/onbaord-aggregator")}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#4d7c0f15" }]}>
              <Ionicons name="people-outline" size={28} color="#4d7c0f" />
            </View>

            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Onboard Aggregator</Text>
              <Text style={styles.cardSubtitle}>
                Register new aggregators and add them to the network
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionCard,
              isFieldGuy ? {} : { borderColor: "#2563eb", borderWidth: 1.5 },
            ]}
            onPress={() => router.push("/meet/start")}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: isFieldGuy ? "#2563eb15" : "#2563eb25" },
              ]}
            >
              <Ionicons
                name="videocam-outline"
                size={28}
                color={isFieldGuy ? "#2563eb" : "#1e40af"}
              />
            </View>

            <View style={styles.cardTextContainer}>
              <Text
                style={[styles.cardTitle, !isFieldGuy && { color: "#1e40af" }]}
              >
                Meet Aggregator
              </Text>
              <Text style={styles.cardSubtitle}>
                Start video call or schedule meeting with aggregator
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* ===== MY TASKS ===== */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>My Assigned Tasks</Text>

          {loadingTasks ? (
            <ActivityIndicator />
          ) : tasks.length === 0 ? (
            <Text style={{ color: "#64748b" }}>No pending tasks 🎉</Text>
          ) : (
            tasks.map((task) => {
              const isOpen = openTaskId === task._id;

              return (
                <View key={task._id} style={styles.taskCard}>
                  {/* HEADER ROW */}
                  <TouchableOpacity
                    style={styles.taskHeader}
                    onPress={() => {
                      LayoutAnimation.configureNext(
                        LayoutAnimation.Presets.easeInEaseOut,
                      );
                      setOpenTaskId(isOpen ? null : task._id);
                    }}
                  >
                    <Text style={styles.taskTitle}>{task.title}</Text>

                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={22}
                      color="#64748b"
                    />
                  </TouchableOpacity>

                  {/* DROPDOWN */}
                  {isOpen && (
                    <View style={styles.taskBody}>
                      {task.description && (
                        <Text style={styles.taskDesc}>{task.description}</Text>
                      )}

                      <TouchableOpacity
                        style={styles.completeBtn}
                        disabled={completingId === task._id}
                        onPress={() => completeTask(task._id)}
                      >
                        {completingId === task._id ? (
                          <ActivityIndicator color="#fff" />
                        ) : (
                          <>
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={18}
                              color="#fff"
                            />
                            <Text style={styles.completeText}>
                              Mark Complete
                            </Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollContainer: { flex: 1 },

  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#bbf7d0",
  },
  avatarImage: { width: "108%", height: "108%" },

  greeting: { fontSize: 22, fontWeight: "700", color: "#166534" },
  date: { color: "#64748b", fontSize: 14 },

  brandChip: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  BrandImg: { width: 80, height: 30, resizeMode: "contain" },

  content: { paddingHorizontal: 16, paddingBottom: 24 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },

  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },

  taskHeader: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  taskBody: {
    padding: 14,
    paddingTop: 0,
    gap: 10,
  },

  taskTitle: { fontSize: 15, fontWeight: "700", color: "#1e293b" },
  taskDesc: { fontSize: 13, color: "#64748b" },

  completeBtn: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },

  completeText: { color: "#fff", fontWeight: "600", fontSize: 13 },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  cardTextContainer: { flex: 1 },

  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },

  cardSubtitle: { fontSize: 14, color: "#64748b", lineHeight: 20 },
});
