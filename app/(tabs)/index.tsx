// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Modal,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { useEffect, useState, useRef } from "react";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiFetch } from "../../services/api";

// /* ================= CLOUDINARY ================= */
// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// /* ================= ROLES ================= */
// const roles = [
//   { id: "field", title: "Field Guy", icon: "person-outline", color: "#4d7c0f" },
//   {
//     id: "agronomist",
//     title: "Agronomist",
//     icon: "leaf-outline",
//     color: "#166534",
//   },
//   {
//     id: "junior",
//     title: "Junior Agronomist",
//     icon: "school-outline",
//     color: "#65a30d",
//   },
//   {
//     id: "senior",
//     title: "Senior Agronomist",
//     icon: "star-outline",
//     color: "#15803d",
//   },
// ];

// export default function Home() {
//   const [currentDate, setCurrentDate] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [startModal, setStartModal] = useState(false);
//   const [endModal, setEndModal] = useState(false);
//   const [imageUri, setImageUri] = useState<string | null>(null);

//   const trackingTimer = useRef<NodeJS.Timeout | null>(null);

//   /* ================= DATE ================= */
//   useEffect(() => {
//     const update = () => {
//       setCurrentDate(
//         new Date().toLocaleDateString("en-IN", {
//           weekday: "long",
//           day: "numeric",
//           month: "long",
//           year: "numeric",
//         }),
//       );
//     };
//     update();
//     const timer = setInterval(update, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   /* ================= CAMERA ================= */
//   const takePhoto = async () => {
//     const perm = await ImagePicker.requestCameraPermissionsAsync();
//     if (!perm.granted) {
//       Alert.alert("Camera permission required");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   /* ================= CLOUDINARY ================= */
//   const uploadToCloudinary = async (uri: string) => {
//     const form = new FormData();
//     form.append("file", {
//       uri,
//       type: "image/jpeg",
//       name: "photo.jpg",
//     } as any);
//     form.append("upload_preset", UPLOAD_PRESET);

//     const res = await fetch(CLOUDINARY_URL, {
//       method: "POST",
//       body: form,
//     });

//     const data = await res.json();
//     return data.secure_url;
//   };

//   /* ================= AUTO TRACKING ================= */
//   const startAutoTracking = (sessionId: string) => {
//     console.log("🟢 Auto tracking started");

//     trackingTimer.current = setInterval(
//       async () => {
//         try {
//           const loc = await Location.getCurrentPositionAsync({
//             accuracy: Location.Accuracy.High,
//           });

//           const payload = {
//             sessionId,
//             lat: loc.coords.latitude,
//             lng: loc.coords.longitude,
//             accuracy: loc.coords.accuracy,
//             timestamp: new Date().toISOString(),
//           };

//           console.log("📍 Auto point:", payload);

//           await apiFetch("/api/tracking/auto-point", {
//             method: "POST",
//             body: JSON.stringify(payload),
//           });
//         } catch (err) {
//           console.log("⚠ Auto tracking error:", err);
//         }
//       },
//       20 * 60 * 1000,
//     ); // ✅ 20 minutes
//   };

//   const stopAutoTracking = () => {
//     if (trackingTimer.current) {
//       clearInterval(trackingTimer.current);
//       trackingTimer.current = null;
//       console.log("🔴 Auto tracking stopped");
//     }
//   };

//   /* ================= START TRACKING ================= */
//   const confirmStartTracking = async () => {
//     try {
//       if (!imageUri) return Alert.alert("Please take photo");

//       setLoading(true);

//       const locPerm = await Location.requestForegroundPermissionsAsync();
//       if (locPerm.status !== "granted") {
//         Alert.alert("Location permission required");
//         return;
//       }

//       const imageUrl = await uploadToCloudinary(imageUri);

//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const payload = {
//         lat: loc.coords.latitude,
//         lng: loc.coords.longitude,
//         accuracy: loc.coords.accuracy,
//         startImage: imageUrl,
//       };

//       const data = await apiFetch("/api/tracking/start", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       await AsyncStorage.setItem("trackingSessionId", data._id);

//       startAutoTracking(data._id); // ✅ START AUTO TRACK

//       setStartModal(false);
//       setImageUri(null);

//       Alert.alert("Tracking Started");
//     } catch (err: any) {
//       console.log("❌ START ERROR:", err);
//       Alert.alert("Error", err.message || "Start failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= END TRACKING ================= */
//   const confirmEndTracking = async () => {
//     try {
//       if (!imageUri) return Alert.alert("Please take photo");

//       setLoading(true);

//       const sessionId = await AsyncStorage.getItem("trackingSessionId");
//       if (!sessionId) return Alert.alert("No active session");

//       const imageUrl = await uploadToCloudinary(imageUri);

//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       const payload = {
//         sessionId,
//         lat: loc.coords.latitude,
//         lng: loc.coords.longitude,
//         accuracy: loc.coords.accuracy,
//         endImage: imageUrl,
//       };

//       await apiFetch("/api/tracking/stop", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       stopAutoTracking(); // ✅ STOP AUTO TRACK

//       await AsyncStorage.removeItem("trackingSessionId");

//       setEndModal(false);
//       setImageUri(null);

//       Alert.alert("Tracking Ended");
//     } catch (err: any) {
//       console.log("❌ END ERROR:", err);
//       Alert.alert("Error", err.message || "Stop failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= ROLE CARD ================= */
//   const renderRoleCard = ({ item }: { item: (typeof roles)[0] }) => (
//     <TouchableOpacity
//       style={styles.roleCard}
//       onPress={() => router.push(`/role/${item.id}`)}
//     >
//       <View style={styles.roleInfo}>
//         <View
//           style={[
//             styles.roleIconContainer,
//             { backgroundColor: `${item.color}20` },
//           ]}
//         >
//           <Ionicons name={item.icon as any} size={28} color={item.color} />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.roleTitle}>{item.title}</Text>
//           <Text style={styles.roleSubtitle}>
//             {item.id === "field"
//               ? "Track visits & tasks in field"
//               : "Analyze crops & give recommendations"}
//           </Text>
//         </View>
//         <Ionicons name="chevron-forward" size={24} color="#64748b" />
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
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
//                 <Text style={styles.greeting}>Welcome</Text>
//                 <Text style={styles.date}>{currentDate}</Text>
//               </View>
//             </View>
//             <Image
//               source={require("../../assets/images/oneroot_backside2.png")}
//               style={styles.brandLogo}
//             />
//           </View>
//         </View>

//         {/* ROLE LIST */}
//         <Text style={styles.sectionTitle}>Select Your Role</Text>

//         <FlatList
//           data={roles}
//           keyExtractor={(item) => item.id}
//           renderItem={renderRoleCard}
//           ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.rolesList}
//         />

//         {/* BUTTONS */}
//         <View style={styles.trackingBox}>
//           <TouchableOpacity
//             style={[styles.trackBtn, { backgroundColor: "#16a34a" }]}
//             onPress={() => setStartModal(true)}
//           >
//             <Text style={styles.trackText}>START</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.trackBtn, { backgroundColor: "#dc2626" }]}
//             onPress={() => setEndModal(true)}
//           >
//             <Text style={styles.trackText}>END</Text>
//           </TouchableOpacity>
//         </View>

//         {/* START MODAL */}
//         <Modal visible={startModal} transparent animationType="slide">
//           <View style={styles.modalBg}>
//             <View style={styles.modalBox}>
//               <Text style={styles.modalTitle}>Start Tracking</Text>

//               <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
//                 <Text style={{ color: "#fff" }}>
//                   {imageUri ? "Retake Photo" : "Take Photo"}
//                 </Text>
//               </TouchableOpacity>

//               {imageUri && (
//                 <Image source={{ uri: imageUri }} style={styles.preview} />
//               )}

//               <TouchableOpacity
//                 style={[styles.confirmBtn, { backgroundColor: "#16a34a" }]}
//                 onPress={confirmStartTracking}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.confirmText}>CONFIRM START</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   setStartModal(false);
//                   setImageUri(null);
//                 }}
//               >
//                 <Text style={{ color: "#64748b" }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>

//         {/* END MODAL */}
//         <Modal visible={endModal} transparent animationType="slide">
//           <View style={styles.modalBg}>
//             <View style={styles.modalBox}>
//               <Text style={styles.modalTitle}>End Tracking</Text>

//               <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
//                 <Text style={{ color: "#fff" }}>
//                   {imageUri ? "Retake Photo" : "Take Photo"}
//                 </Text>
//               </TouchableOpacity>

//               {imageUri && (
//                 <Image source={{ uri: imageUri }} style={styles.preview} />
//               )}

//               <TouchableOpacity
//                 style={[styles.confirmBtn, { backgroundColor: "#dc2626" }]}
//                 onPress={confirmEndTracking}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text style={styles.confirmText}>CONFIRM END</Text>
//                 )}
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   setEndModal(false);
//                   setImageUri(null);
//                 }}
//               >
//                 <Text style={{ color: "#64748b" }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     </SafeAreaView>
//   );
// }

// /* ================= STYLES ================= */

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: "#f0fdf4" },
//   container: { flex: 1 },
//   header: { padding: 16, marginBottom: 8 },
//   profileSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 54,
//     height: 54,
//     borderRadius: 27,
//     overflow: "hidden",
//     borderWidth: 2,
//     borderColor: "#86efac",
//   },
//   avatarImage: { width: "115%", height: "115%" },
//   greeting: { fontSize: 24, fontWeight: "700", color: "#166534" },
//   date: { color: "#64748b", fontSize: 15 },
//   brandLogo: { width: 90, height: 36, resizeMode: "contain" },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#166534",
//     marginBottom: 16,
//     paddingHorizontal: 16,
//   },
//   rolesList: { paddingHorizontal: 16, paddingBottom: 20 },
//   roleCard: {
//     backgroundColor: "#ffffff",
//     padding: 18,
//     borderRadius: 14,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//   },
//   roleInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
//   roleIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   roleTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 4,
//   },
//   roleSubtitle: { fontSize: 14, color: "#64748b" },
//   trackingBox: { padding: 16, flexDirection: "row", gap: 12 },
//   trackBtn: {
//     flex: 1,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   trackText: { color: "#fff", fontSize: 18, fontWeight: "700" },
//   modalBg: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalBox: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 14,
//     width: "85%",
//     alignItems: "center",
//     gap: 12,
//   },
//   modalTitle: { fontSize: 18, fontWeight: "700" },
//   photoBtn: {
//     backgroundColor: "#2563eb",
//     padding: 12,
//     borderRadius: 10,
//   },
//   preview: { width: 200, height: 200, borderRadius: 10 },
//   confirmBtn: {
//     width: "100%",
//     padding: 14,
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   confirmText: { color: "#fff", fontWeight: "700" },
// });

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";

import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../../services/api";
import {
  startBackgroundTracking,
  stopBackgroundTracking,
} from "../../services/backgroundTrackingService";
import { syncOfflinePoints } from "../../services/syncOfflinePoints";

/* ================= CLOUDINARY ================= */
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/* ================= ROLES ================= */
const roles = [
  { id: "field", title: "Field Guy", icon: "person-outline", color: "#4d7c0f" },
  {
    id: "agronomist",
    title: "Agronomist",
    icon: "leaf-outline",
    color: "#166534",
  },
  {
    id: "junior",
    title: "Junior Agronomist",
    icon: "school-outline",
    color: "#65a30d",
  },
  {
    id: "senior",
    title: "Senior Agronomist",
    icon: "star-outline",
    color: "#15803d",
  },
];

export default function Home() {
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [startModal, setStartModal] = useState(false);
  const [endModal, setEndModal] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [isTracking, setIsTracking] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [availabilitySession, setAvailabilitySession] = useState<string | null>(
    null,
  );

  const sendAvailability = async (available: boolean) => {
    try {
      console.log("📤 Sending availability:", available);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission required");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const sessionId = await AsyncStorage.getItem("trackingSession");

      if (!sessionId) {
        console.log("⚠️ No active session — skipping availability");
        return;
      }

      await apiFetch("/api/availability/respond", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          available,
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        }),
      });

      // ✅ CLOSE POPUP AFTER CLICK
      setShowAvailability(false);
      setAvailabilitySession(null);

      console.log("✅ Availability sent to backend");
    } catch (err) {
      console.error("❌ Availability send failed", err);
    }
  };

  // useEffect(() => {
  //   const sub = Notifications.addNotificationReceivedListener((notif) => {
  //     const data = notif.request.content.data;

  //     if (data?.type === "AVAILABILITY") {
  //       setAvailabilitySession((data.sessionId as string) || null);
  //       setShowAvailability(true);
  //     }
  //   });

  //   return () => sub.remove();
  // }, []);

  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const data = res.notification.request.content.data;

      if (data?.type === "AVAILABILITY") {
        setAvailabilitySession((data.sessionId as string) || null);
        setShowAvailability(true);
      }
    });

    // 🔥 KILLED STATE
    Notifications.getLastNotificationResponseAsync().then((res) => {
      const data = res?.notification?.request?.content?.data;
      if (data?.type === "AVAILABILITY") {
        setAvailabilitySession((data.sessionId as string) || null);
        setShowAvailability(true);
      }
    });

    return () => sub.remove();
  }, []);

  /* ================= CHECK TRACKING + SYNC OFFLINE ================= */
  useEffect(() => {
    const init = async () => {
      const s = await AsyncStorage.getItem("trackingSession");
      setIsTracking(!!s);
      await syncOfflinePoints();
    };
    init();
  }, []);

  /* ================= DATE ================= */
  useEffect(() => {
    const update = () => {
      setCurrentDate(
        new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    };
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);

  /* ================= CHECK TRACKING + SYNC OFFLINE ================= */
  useEffect(() => {
    const init = async () => {
      const s = await AsyncStorage.getItem("trackingSession");
      setIsTracking(!!s);
      await syncOfflinePoints();
    };
    init();
  }, []);

  /* ================= CAMERA ================= */
  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Camera permission required");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.6 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  /* ================= CLOUDINARY ================= */
  const uploadToCloudinary = async (uri: string) => {
    const form = new FormData();
    form.append("file", {
      uri,
      type: "image/jpeg",
      name: "photo.jpg",
    } as any);
    form.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    return data.secure_url;
  };

  /* ================= START TRACKING ================= */
  const confirmStartTracking = async () => {
    try {
      if (!imageUri) return Alert.alert("Please take photo");

      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission is required");
        return;
      }

      const imageUrl = await uploadToCloudinary(imageUri);

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const payload = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        startImage: imageUrl,
      };

      const data = await apiFetch("/api/tracking/start", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await AsyncStorage.setItem("trackingSession", data._id);

      await startBackgroundTracking();

      setIsTracking(true);
      setStartModal(false);
      setImageUri(null);

      Alert.alert("Tracking Started");
    } catch (err: any) {
      console.log("❌ START ERROR:", err);
      Alert.alert("Error", err.message || "Start failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= END TRACKING ================= */
  const confirmEndTracking = async () => {
    try {
      if (!imageUri) return Alert.alert("Please take photo");

      setLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission is required");
        return;
      }

      const sessionId =
        availabilitySession || (await AsyncStorage.getItem("trackingSession"));

      if (!sessionId) return Alert.alert("No active session");

      const imageUrl = await uploadToCloudinary(imageUri);

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const payload = {
        sessionId,
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
        accuracy: loc.coords.accuracy,
        endImage: imageUrl,
      };

      await apiFetch("/api/tracking/stop", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      await stopBackgroundTracking();
      await AsyncStorage.removeItem("trackingSession");

      setIsTracking(false);
      setEndModal(false);
      setImageUri(null);

      Alert.alert("Tracking Ended");
    } catch (err: any) {
      console.log("❌ END ERROR:", err);
      Alert.alert("Error", err.message || "Stop failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ROLE CARD ================= */
  const renderRoleCard = ({ item }: { item: (typeof roles)[0] }) => (
    <TouchableOpacity
      style={styles.roleCard}
      onPress={() => router.push(`/role/${item.id}`)}
    >
      <View style={styles.roleInfo}>
        <View
          style={[
            styles.roleIconContainer,
            { backgroundColor: `${item.color}20` },
          ]}
        >
          <Ionicons name={item.icon as any} size={28} color={item.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.roleTitle}>{item.title}</Text>
          <Text style={styles.roleSubtitle}>
            {item.id === "field"
              ? "Track visits & tasks in field"
              : "Analyze crops & give recommendations"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#64748b" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
                <Text style={styles.greeting}>Welcome</Text>
                <Text style={styles.date}>{currentDate}</Text>

                {isTracking && (
                  <View style={styles.trackingBadge}>
                    <Text style={styles.trackingBadgeText}>
                      ● TRACKING ACTIVE
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <Image
              source={require("../../assets/images/oneroot_backside2.png")}
              style={styles.brandLogo}
            />
          </View>
        </View>

        {/* ROLE LIST */}
        <Text style={styles.sectionTitle}>Select Your Role</Text>

        <FlatList
          data={roles}
          keyExtractor={(item) => item.id}
          renderItem={renderRoleCard}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.rolesList}
        />

        {/* BUTTONS */}
        <View style={styles.trackingBox}>
          <TouchableOpacity
            style={[styles.trackBtn, { backgroundColor: "#16a34a" }]}
            onPress={() => {
              setImageUri(null);
              setStartModal(true);
            }}
          >
            <Text style={styles.trackText}>START</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.trackBtn, { backgroundColor: "#dc2626" }]}
            onPress={() => {
              setImageUri(null);
              setEndModal(true);
            }}
          >
            <Text style={styles.trackText}>END</Text>
          </TouchableOpacity>
        </View>

        {/* START MODAL */}
        <Modal visible={startModal} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Start Tracking</Text>

              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Text style={{ color: "#fff" }}>
                  {imageUri ? "Retake Photo" : "Take Photo"}
                </Text>
              </TouchableOpacity>

              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.preview} />
              )}

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#16a34a" }]}
                onPress={confirmStartTracking}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>CONFIRM START</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setStartModal(false);
                  setImageUri(null);
                }}
              >
                <Text style={{ color: "#64748b" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* END MODAL */}
        <Modal visible={endModal} transparent animationType="slide">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>End Tracking</Text>

              <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
                <Text style={{ color: "#fff" }}>
                  {imageUri ? "Retake Photo" : "Take Photo"}
                </Text>
              </TouchableOpacity>

              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.preview} />
              )}

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#dc2626" }]}
                onPress={confirmEndTracking}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>CONFIRM END</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setEndModal(false);
                  setImageUri(null);
                }}
              >
                <Text style={{ color: "#64748b" }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* AVAILABILITY MODAL */}
        <Modal visible={showAvailability} transparent animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Are you available?</Text>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#16a34a" }]}
                onPress={() => sendAvailability(true)}
              >
                <Text style={styles.confirmText}>AVAILABLE</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmBtn, { backgroundColor: "#dc2626" }]}
                onPress={() => sendAvailability(false)}
              >
                <Text style={styles.confirmText}>NOT AVAILABLE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0fdf4" },
  container: { flex: 1 },
  header: { padding: 16, marginBottom: 8 },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#86efac",
  },
  avatarImage: { width: "115%", height: "115%" },
  greeting: { fontSize: 24, fontWeight: "700", color: "#166534" },
  date: { color: "#64748b", fontSize: 15 },

  trackingBadge: {
    marginTop: 4,
    backgroundColor: "#16a34a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
  },
  trackingBadgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  brandLogo: { width: 90, height: 36, resizeMode: "contain" },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  rolesList: { paddingHorizontal: 16, paddingBottom: 20 },
  roleCard: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  roleInfo: { flexDirection: "row", alignItems: "center", gap: 16 },
  roleIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  roleSubtitle: { fontSize: 14, color: "#64748b" },
  trackingBox: { padding: 16, flexDirection: "row", gap: 12 },
  trackBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  trackText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 14,
    width: "85%",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  photoBtn: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 10,
  },
  preview: { width: 200, height: 200, borderRadius: 10 },
  confirmBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "700" },
});
