// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Modal,
//   TextInput,
//   Image,
// } from "react-native";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// export default function LoadDecision() {
//   const [showModal, setShowModal] = useState(false);
//   const [remark, setRemark] = useState("");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // 📸 pick image
//   const takePhoto = async () => {
//     const cam = await ImagePicker.requestCameraPermissionsAsync();
//     if (!cam.granted) {
//       Alert.alert("Camera permission required");
//       return;
//     }

//     const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
//     if (!res.canceled) setImageUri(res.assets[0].uri);
//   };

//   // ✅ YES FLOW
//   const handleYes = async () => {
//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) return router.replace("/(auth)/login");
//       const user = JSON.parse(userStr);

//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;

//       const visit = await apiFetch("/visits", {
//         method: "POST",
//         body: JSON.stringify({
//           userId: user._id,
//           latitude,
//           longitude,
//           hasLoad: true,
//         }),
//       });

//       if (!visit?._id) {
//         Alert.alert("Visit failed");
//         return;
//       }

//       await AsyncStorage.setItem("currentVisitId", visit._id);
//       router.push("/meet/load-form");
//     } catch (e) {
//       console.error(e);
//       Alert.alert("Something went wrong");
//     }
//   };

//   // ❌ NO FLOW (WITH MODAL FORM)
//   const submitNoLoad = async () => {
//     try {
//       if (!remark || !imageUri) {
//         Alert.alert("Please add remark and image");
//         return;
//       }

//       setLoading(true);

//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) return router.replace("/(auth)/login");
//       const user = JSON.parse(userStr);

//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;

//       // ☁️ upload image
//       const form = new FormData();
//       form.append("file", {
//         uri: imageUri,
//         type: "image/jpeg",
//         name: "no-load.jpg",
//       } as any);
//       form.append("upload_preset", UPLOAD_PRESET);

//       const cloudRes = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: form,
//       });
//       const cloudData = await cloudRes.json();

//       if (!cloudData.secure_url) {
//         Alert.alert("Image upload failed");
//         return;
//       }

//       // ✅ FINAL PAYLOAD (EXACT LIKE POSTMAN)
//       const visit = await apiFetch("/visits", {
//         method: "POST",
//         body: JSON.stringify({
//           userId: user._id,
//           latitude,
//           longitude,
//           hasLoad: false,
//           remark,
//           image: cloudData.secure_url,
//         }),
//       });

//       if (!visit?._id) {
//         Alert.alert("Visit failed");
//         return;
//       }

//       setShowModal(false);
//       Alert.alert("Saved", "No-load visit submitted");
//       router.replace("/(tabs)");
//     } catch (e) {
//       console.error(e);
//       Alert.alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Is any load happening?</Text>

//       <TouchableOpacity style={styles.yesBtn} onPress={handleYes}>
//         <Text style={styles.btnText}>YES</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.noBtn} onPress={() => setShowModal(true)}>
//         <Text style={styles.btnText}>NO</Text>
//       </TouchableOpacity>

//       {/* 🔥 NO LOAD MODAL FORM */}
//       <Modal visible={showModal} transparent animationType="slide">
//         <View style={styles.modalBg}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>No Load Details</Text>

//             <TextInput
//               placeholder="Enter remark"
//               value={remark}
//               onChangeText={setRemark}
//               style={styles.input}
//             />

//             {imageUri && (
//               <Image source={{ uri: imageUri }} style={styles.preview} />
//             )}

//             <TouchableOpacity style={styles.photoBtn} onPress={takePhoto}>
//               <Text style={styles.btnText}>Take Photo</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.submitBtn} onPress={submitNoLoad}>
//               <Text style={styles.btnText}>
//                 {loading ? "Saving..." : "Submit"}
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelBtn}
//               onPress={() => setShowModal(false)}
//             >
//               <Text style={{ color: "#ef4444", fontWeight: "700" }}>
//                 Cancel
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, paddingTop: 80 },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     textAlign: "center",
//     marginBottom: 30,
//   },

//   yesBtn: {
//     backgroundColor: "#22c55e",
//     padding: 18,
//     borderRadius: 14,
//     alignItems: "center",
//     marginBottom: 16,
//   },

//   noBtn: {
//     backgroundColor: "#ef4444",
//     padding: 18,
//     borderRadius: 14,
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

//   modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5f5",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//   },

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

//   cancelBtn: { alignItems: "center", marginTop: 12 },
// });

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { apiFetch } from "../../services/api";
import { useState } from "react";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export default function LoadDecision() {
  const [showModal, setShowModal] = useState(false);
  const [remark, setRemark] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // ────────────────────────────────────────────────
  // Take photo
  // ────────────────────────────────────────────────
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Camera access is needed.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.65,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to open camera");
    }
  };

  // ────────────────────────────────────────────────
  // YES → has load
  // ────────────────────────────────────────────────
  const handleYes = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Required", "Please allow location access.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;

      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        router.replace("/(auth)/login");
        return;
      }
      const user = JSON.parse(userStr);

      const visit = await apiFetch("/visits", {
        method: "POST",
        body: JSON.stringify({
          userId: user._id,
          latitude,
          longitude,
          hasLoad: true,
        }),
      });

      if (!visit?._id) throw new Error("Visit creation failed");

      await AsyncStorage.setItem("currentVisitId", visit._id);
      router.push("/meet/load-form");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to start visit");
    } finally {
      setLocationLoading(false);
    }
  };

  // ────────────────────────────────────────────────
  // NO → no load (with modal)
  // ────────────────────────────────────────────────
  const submitNoLoad = async () => {
    if (!remark.trim() || !imageUri) {
      Alert.alert(
        "Missing Information",
        "Please add a remark and take a photo."
      );
      return;
    }

    setLoading(true);

    try {
      const userStr = await AsyncStorage.getItem("user");
      if (!userStr) {
        router.replace("/(auth)/login");
        return;
      }
      const user = JSON.parse(userStr);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") throw new Error("Location permission denied");

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Upload image
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "no-load-proof.jpg",
      } as any);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadRes = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();

      if (!uploadData.secure_url) throw new Error("Image upload failed");

      // Create visit
      const visit = await apiFetch("/visits", {
        method: "POST",
        body: JSON.stringify({
          userId: user._id,
          latitude,
          longitude,
          hasLoad: false,
          remark: remark.trim(),
          image: uploadData.secure_url,
        }),
      });

      if (!visit?._id) throw new Error("Visit creation failed");

      setShowModal(false);
      setRemark("");
      setImageUri(null);

      Alert.alert("Success", "No-load visit recorded");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit no-load visit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Is any load happening today?</Text>

        <TouchableOpacity
          style={[styles.decisionBtn, styles.yesBtn]}
          onPress={handleYes}
          disabled={locationLoading}
        >
          {locationLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={28} color="#fff" />
              <Text style={styles.btnText}>YES – Load is happening</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.decisionBtn, styles.noBtn]}
          onPress={() => setShowModal(true)}
          disabled={loading || locationLoading}
        >
          <Ionicons name="close-circle" size={28} color="#fff" />
          <Text style={styles.btnText}>NO – No load today</Text>
        </TouchableOpacity>
      </View>

      {/* ──────────────────────────────────────────────── */}
      {/* No Load Modal */}
      {/* ──────────────────────────────────────────────── */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>No Load Details</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={28} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalLabel}>Remark / Reason *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. No stock available, farmer not present, etc."
                  value={remark}
                  onChangeText={setRemark}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text style={styles.modalLabel}>Proof Photo *</Text>

                {imageUri ? (
                  <Image
                    source={{ uri: imageUri }}
                    style={styles.previewImage}
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Ionicons name="image-outline" size={60} color="#cbd5e1" />
                    <Text style={styles.placeholderText}>No photo yet</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.photoCaptureBtn}
                  onPress={takePhoto}
                  disabled={loading}
                >
                  <Ionicons name="camera" size={20} color="#fff" />
                  <Text style={styles.btnTextSmall}>Capture Proof Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.submitNoBtn,
                    (!remark.trim() || !imageUri || loading) &&
                      styles.disabledBtn,
                  ]}
                  onPress={submitNoLoad}
                  disabled={!remark.trim() || !imageUri || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitText}>Submit No-Load Visit</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelLink}
                  onPress={() => setShowModal(false)}
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
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#166534",
    textAlign: "center",
    marginBottom: 60,
  },

  decisionBtn: {
    width: "100%",
    maxWidth: 360,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  yesBtn: {
    backgroundColor: "#16a34a",
  },
  noBtn: {
    backgroundColor: "#dc2626",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
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
  modalInput: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f8fafc",
    minHeight: 100,
    textAlignVertical: "top",
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
  photoCaptureBtn: {
    flexDirection: "row",
    backgroundColor: "#4d7c0f",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  submitNoBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledBtn: {
    backgroundColor: "#fca5a5",
    opacity: 0.8,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  cancelLink: {
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  btnTextSmall: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
