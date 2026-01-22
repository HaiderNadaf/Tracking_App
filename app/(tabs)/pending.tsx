// import {
//   StyleSheet,
//   Text,
//   View,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   Image,
//   Modal,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import * as ImagePicker from "expo-image-picker";
// import { apiFetch } from "../../services/api";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// type Load = {
//   _id: string;
//   productName: string;
//   from: string;
//   to: string;
//   numberOfVehicles: number;
//   pricePaying: number;
// };

// export default function Pending() {
//   const [loads, setLoads] = useState<Load[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     console.log("🔁 Pending screen mounted");
//     fetchPending();
//   }, []);

//   // 🔥 FETCH PENDING LOADS
//   const fetchPending = async () => {
//     try {
//       console.log("📥 Fetching pending loads...");

//       const userStr = await AsyncStorage.getItem("user");
//       console.log("👤 Stored user:", userStr);

//       if (!userStr) return;

//       const user = JSON.parse(userStr);
//       console.log("👤 Parsed user ID:", user._id);

//       const res = await apiFetch(`/loads/pending/${user._id}`);
//       console.log("✅ Pending loads response:", res);

//       setLoads(res);
//     } catch (e) {
//       console.error("❌ Error fetching pending loads:", e);
//       Alert.alert("Failed to load pending loads");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 📸 TAKE IMAGE
//   const pickImage = async () => {
//     try {
//       console.log("📸 Requesting camera permission...");

//       const cam = await ImagePicker.requestCameraPermissionsAsync();
//       console.log("📸 Camera permission:", cam);

//       if (!cam.granted) return Alert.alert("Camera permission needed");

//       const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
//       console.log("📸 Image picker result:", res);

//       if (!res.canceled) setImageUri(res.assets[0].uri);
//     } catch (e) {
//       console.error("❌ Image pick error:", e);
//     }
//   };

//   // ✅ COMPLETE LOAD
//   const completeLoad = async () => {
//     try {
//       console.log("🚀 Starting complete load flow");

//       if (!selectedLoad || !imageUri) {
//         Alert.alert("Please take completion image");
//         return;
//       }

//       console.log("🆔 Load ID:", selectedLoad._id);
//       console.log("🖼 Image URI:", imageUri);

//       setSubmitting(true);

//       // ☁️ Upload image to Cloudinary
//       const form = new FormData();
//       form.append("file", {
//         uri: imageUri,
//         type: "image/jpeg",
//         name: "complete.jpg",
//       } as any);
//       form.append("upload_preset", UPLOAD_PRESET);

//       console.log("☁️ Uploading image to Cloudinary...");

//       const cloudRes = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: form,
//       });

//       const cloudData = await cloudRes.json();
//       console.log("☁️ Cloudinary response:", cloudData);

//       if (!cloudData.secure_url) {
//         Alert.alert("Image upload failed");
//         return;
//       }

//       // ✅ Complete load API
//       console.log("📤 Sending complete load API...");

//       const apiRes = await apiFetch(`/loads/${selectedLoad._id}/complete`, {
//         method: "POST",
//         body: JSON.stringify({
//           loadEndedAt: new Date().toISOString(),
//           completionImage: cloudData.secure_url,
//         }),
//       });

//       console.log("✅ Complete load API response:", apiRes);

//       Alert.alert("Completed", "Load marked as completed");

//       setSelectedLoad(null);
//       setImageUri(null);
//       fetchPending();
//     } catch (e) {
//       console.error("❌ Complete load error:", e);
//       Alert.alert("Failed to complete load");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Pending Loads</Text>

//       {loading ? (
//         <Text>Loading...</Text>
//       ) : loads.length === 0 ? (
//         <Text>No pending loads</Text>
//       ) : (
//         <FlatList
//           data={loads}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <Text style={styles.bold}>{item.productName}</Text>
//               <Text>
//                 {item.from} → {item.to}
//               </Text>
//               <Text>Vehicles: {item.numberOfVehicles}</Text>
//               <Text>₹ {item.pricePaying}</Text>

//               <TouchableOpacity
//                 style={styles.completeBtn}
//                 onPress={() => {
//                   console.log("👉 Complete clicked for:", item._id);
//                   setSelectedLoad(item);
//                 }}
//               >
//                 <Text style={styles.btnText}>Complete</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}

//       {/* 🔥 COMPLETE MODAL */}
//       <Modal visible={!!selectedLoad} transparent animationType="slide">
//         <View style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Upload Completion Image</Text>

//             {imageUri && (
//               <Image source={{ uri: imageUri }} style={styles.preview} />
//             )}

//             <TouchableOpacity
//               style={styles.photoBtn}
//               onPress={() => {
//                 console.log("📸 Take completion photo");
//                 pickImage();
//               }}
//             >
//               <Text style={styles.btnText}>Take Photo</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.submitBtn}
//               onPress={completeLoad}
//               disabled={submitting}
//             >
//               <Text style={styles.btnText}>
//                 {submitting ? "Submitting..." : "Submit"}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 console.log("❌ Cancel complete");
//                 setSelectedLoad(null);
//               }}
//             >
//               <Text style={{ color: "#ef4444", marginTop: 10 }}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, paddingTop: 60 },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 16,
//     textAlign: "center",
//   },

//   card: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 12,
//     elevation: 3,
//   },

//   bold: { fontWeight: "700", fontSize: 16 },

//   completeBtn: {
//     marginTop: 10,
//     backgroundColor: "#22c55e",
//     padding: 10,
//     borderRadius: 8,
//     alignItems: "center",
//   },

//   btnText: { color: "#fff", fontWeight: "700" },

//   modalBg: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.4)",
//     justifyContent: "flex-end",
//   },

//   modalCard: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },

//   modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },

//   preview: { width: "100%", height: 160, borderRadius: 10, marginBottom: 10 },

//   photoBtn: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },

//   submitBtn: {
//     backgroundColor: "#22c55e",
//     padding: 16,
//     borderRadius: 12,
//     alignItems: "center",
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { apiFetch } from "../../services/api";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

type Load = {
  _id: string;
  productName: string;
  from: string;
  to: string;
  numberOfVehicles: number;
  pricePaying: number;
};

export default function Pending() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const res = await apiFetch(`/api/loads/pending/${user._id}`);
      setLoads(res || []);
    } catch (err) {
      Alert.alert("Error", "Failed to load pending loads");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera access is needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to open camera");
    }
  };

  const completeLoad = async () => {
    if (!selectedLoad || !imageUri) {
      Alert.alert("Missing Photo", "Please capture a completion photo.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "completion.jpg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) throw new Error("Image upload failed");

      await apiFetch(`/api/loads/${selectedLoad._id}/complete`, {
        method: "POST",
        body: JSON.stringify({
          loadEndedAt: new Date().toISOString(),
          completionImage: uploadData.secure_url,
        }),
      });

      Alert.alert("Success", "Load marked as completed!");
      setSelectedLoad(null);
      setImageUri(null);
      fetchPending();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to complete load");
    } finally {
      setSubmitting(false);
    }
  };

  const renderLoad = ({ item }: { item: Load }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedLoad(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <Ionicons name="cube-outline" size={24} color="#4d7c0f" />
        <Text style={styles.productName}>{item.productName}</Text>
      </View>

      <View style={styles.routeContainer}>
        <Text style={styles.location}>{item.from}</Text>
        <Ionicons
          name="arrow-forward"
          size={20}
          color="#64748b"
          style={styles.arrow}
        />
        <Text style={styles.location}>{item.to}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="car-sport-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            {item.numberOfVehicles} vehicles
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color="#64748b" />
          <Text style={styles.detailText}>
            ₹{item.pricePaying.toLocaleString()}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.completeButton}
        onPress={() => setSelectedLoad(item)}
      >
        <Text style={styles.completeText}>Mark as Completed</Text>
        <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Pending Loads</Text>

        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#4d7c0f" />
            <Text style={styles.loadingText}>Loading pending loads...</Text>
          </View>
        ) : loads.length === 0 ? (
          <View style={styles.centerContainer}>
            <Ionicons name="cube-outline" size={80} color="#cbd5e1" />
            <Text style={styles.emptyText}>No pending loads right now</Text>
            <Text style={styles.emptySubText}>
              Completed loads will appear here after finishing
            </Text>
          </View>
        ) : (
          <FlatList
            data={loads}
            renderItem={renderLoad}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Completion Modal */}
      <Modal
        visible={!!selectedLoad}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedLoad(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Load</Text>
                <TouchableOpacity onPress={() => setSelectedLoad(null)}>
                  <Ionicons name="close" size={28} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalLabel}>Completion Proof Photo *</Text>

                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Ionicons name="camera-outline" size={60} color="#cbd5e1" />
                    <Text style={styles.placeholderText}>No photo yet</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.photoButton}
                  onPress={pickImage}
                  disabled={submitting}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.photoButtonText}>
                    Capture Proof Photo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (!imageUri || submitting) && styles.submitDisabled,
                  ]}
                  onPress={completeLoad}
                  disabled={!imageUri || submitting}
                >
                  {submitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Submit Completion</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setSelectedLoad(null)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#166534",
    textAlign: "center",
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#64748b",
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#475569",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
  },
  listContent: {
    paddingBottom: 20,
  },

  // Card
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    flex: 1,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  location: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "500",
    flex: 1,
  },
  arrow: {
    marginHorizontal: 12,
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#64748b",
  },
  completeButton: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.50)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    marginTop: 12,
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewPlaceholder: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    marginBottom: 12,
  },
  placeholderText: {
    color: "#94a3b8",
    marginTop: 8,
    fontSize: 14,
  },
  photoButton: {
    flexDirection: "row",
    backgroundColor: "#4d7c0f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  photoButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  submitDisabled: {
    backgroundColor: "#86efac",
    opacity: 0.7,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});
