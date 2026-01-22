// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";
// import { Picker } from "@react-native-picker/picker";
// import * as ImagePicker from "expo-image-picker";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// export default function LoadForm() {
//   const [productName, setProductName] = useState("");
//   const [numberOfVehicles, setVehicles] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [pricePaying, setPrice] = useState("");

//   const [status, setStatus] = useState<"pending" | "completed">("pending");
//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // ================= IMAGE PICK =================
//   const pickImage = async () => {
//     try {
//       console.log("📸 Requesting camera permission...");
//       const cam = await ImagePicker.requestCameraPermissionsAsync();
//       console.log("📸 Camera permission:", cam);

//       if (!cam.granted) {
//         Alert.alert("Camera permission required");
//         return;
//       }

//       const res = await ImagePicker.launchCameraAsync({ quality: 0.6 });
//       console.log("📸 Image picker result:", res);

//       if (!res.canceled) setImageUri(res.assets[0].uri);
//     } catch (e) {
//       console.error("❌ Image pick error:", e);
//     }
//   };

//   // ================= SUBMIT LOAD =================
//   const submitLoad = async () => {
//     try {
//       console.log("🚀 Submit load clicked");

//       const visitId = await AsyncStorage.getItem("currentVisitId");
//       console.log("🆔 Visit ID:", visitId);

//       if (!visitId) return Alert.alert("Visit missing");

//       if (!productName || !numberOfVehicles || !from || !to || !pricePaying) {
//         Alert.alert("Fill all fields");
//         return;
//       }

//       setLoading(true);

//       // ✅ CREATE LOAD (STATUS = PENDING)
//       console.log("📤 Creating load...");

//       const loadRes = await apiFetch("/loads", {
//         method: "POST",
//         body: JSON.stringify({
//           visitId,
//           productName,
//           numberOfVehicles: Number(numberOfVehicles),
//           from,
//           to,
//           pricePaying: Number(pricePaying),
//           loadStartedAt: new Date().toISOString(),
//         }),
//       });

//       console.log("✅ Create load response:", loadRes);

//       if (!loadRes?._id) {
//         Alert.alert("Failed to save load");
//         return;
//       }

//       // 🟡 IF STATUS = PENDING → FINISH
//       if (status === "pending") {
//         await AsyncStorage.removeItem("currentVisitId");
//         Alert.alert("Saved", "Load saved as pending");
//         router.replace("/(tabs)");
//         return;
//       }

//       // 🟢 IF STATUS = COMPLETED → ASK IMAGE + COMPLETE API
//       if (!imageUri) {
//         Alert.alert("Please upload completion image");
//         return;
//       }

//       console.log("☁️ Uploading completion image...");

//       const form = new FormData();
//       form.append("file", {
//         uri: imageUri,
//         type: "image/jpeg",
//         name: "complete.jpg",
//       } as any);
//       form.append("upload_preset", UPLOAD_PRESET);

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

//       console.log("📤 Completing load API...");

//       const completeRes = await apiFetch(`/loads/${loadRes._id}/complete`, {
//         method: "POST",
//         body: JSON.stringify({
//           loadEndedAt: new Date().toISOString(),
//           completionImage: cloudData.secure_url,
//         }),
//       });

//       console.log("✅ Complete load response:", completeRes);

//       await AsyncStorage.removeItem("currentVisitId");
//       Alert.alert("Success", "Load completed successfully");
//       router.replace("/(tabs)");
//     } catch (e) {
//       console.error("❌ Submit load error:", e);
//       Alert.alert("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Load Details</Text>

//       <TextInput
//         placeholder="Product"
//         onChangeText={setProductName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Vehicles"
//         keyboardType="numeric"
//         onChangeText={setVehicles}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="From"
//         onChangeText={setFrom}
//         style={styles.input}
//       />
//       <TextInput placeholder="To" onChangeText={setTo} style={styles.input} />
//       <TextInput
//         placeholder="Price"
//         keyboardType="numeric"
//         onChangeText={setPrice}
//         style={styles.input}
//       />

//       {/* ✅ STATUS DROPDOWN */}
//       <Text style={{ marginBottom: 6, fontWeight: "600" }}>Status</Text>
//       <View style={styles.pickerBox}>
//         <Picker
//           selectedValue={status}
//           onValueChange={(v) => {
//             console.log("📌 Status changed:", v);
//             setStatus(v);
//           }}
//         >
//           <Picker.Item label="Pending" value="pending" />
//           <Picker.Item label="Completed" value="completed" />
//         </Picker>
//       </View>

//       {/* ✅ IMAGE ONLY IF COMPLETE */}
//       {status === "completed" && (
//         <>
//           {imageUri && (
//             <Image source={{ uri: imageUri }} style={styles.preview} />
//           )}

//           <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
//             <Text style={{ color: "#fff", fontWeight: "700" }}>
//               Upload Completion Image
//             </Text>
//           </TouchableOpacity>
//         </>
//       )}

//       <Button
//         title={loading ? "Saving..." : "Submit Load"}
//         onPress={submitLoad}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20, paddingTop: 60 },
//   title: {
//     fontSize: 20,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5f5",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//   },

//   pickerBox: {
//     borderWidth: 1,
//     borderColor: "#cbd5f5",
//     borderRadius: 10,
//     marginBottom: 12,
//     overflow: "hidden",
//   },

//   preview: {
//     width: "100%",
//     height: 160,
//     borderRadius: 10,
//     marginBottom: 10,
//   },

//   photoBtn: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 14,
//   },
// });

// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   ScrollView,
//   Image,
//   ActivityIndicator,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { useState } from "react";
// import { Ionicons } from "@expo/vector-icons";
// import * as ImagePicker from "expo-image-picker";
// import { Picker } from "@react-native-picker/picker";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// export default function LoadForm() {
//   const [productName, setProductName] = useState("");
//   const [numberOfVehicles, setVehicles] = useState("");
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [pricePaying, setPrice] = useState("");
//   const [status, setStatus] = useState<"pending" | "completed">("pending");

//   const [imageUri, setImageUri] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const isFormValid = () =>
//     productName.trim() &&
//     numberOfVehicles.trim() &&
//     from.trim() &&
//     to.trim() &&
//     pricePaying.trim() &&
//     (status === "pending" || imageUri);

//   const pickImage = async () => {
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Required", "Camera access is needed.");
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 0.7,
//       });

//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     } catch (err) {
//       Alert.alert("Error", "Failed to open camera");
//     }
//   };

//   const submitLoad = async () => {
//     if (!isFormValid()) {
//       Alert.alert(
//         "Incomplete",
//         "Please fill all required fields" +
//           (status === "completed" ? " and upload completion photo." : ".")
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const visitId = await AsyncStorage.getItem("currentVisitId");
//       if (!visitId) throw new Error("No active visit found");

//       // 1. Create load (always pending first)
//       const loadRes = await apiFetch("/loads", {
//         method: "POST",
//         body: JSON.stringify({
//           visitId,
//           productName: productName.trim(),
//           numberOfVehicles: Number(numberOfVehicles.trim()),
//           from: from.trim(),
//           to: to.trim(),
//           pricePaying: Number(pricePaying.trim()),
//           loadStartedAt: new Date().toISOString(),
//         }),
//       });

//       if (!loadRes?._id) throw new Error("Failed to create load");

//       // 2. If completed → upload image & complete
//       if (status === "completed") {
//         const formData = new FormData();
//         formData.append("file", {
//           uri: imageUri!,
//           type: "image/jpeg",
//           name: "load-complete.jpg",
//         } as any);
//         formData.append("upload_preset", UPLOAD_PRESET);

//         const uploadRes = await fetch(CLOUDINARY_URL, {
//           method: "POST",
//           body: formData,
//         });
//         const uploadData = await uploadRes.json();

//         if (!uploadData.secure_url) throw new Error("Image upload failed");

//         await apiFetch(`/loads/${loadRes._id}/complete`, {
//           method: "POST",
//           body: JSON.stringify({
//             loadEndedAt: new Date().toISOString(),
//             completionImage: uploadData.secure_url,
//           }),
//         });
//       }

//       await AsyncStorage.removeItem("currentVisitId");

//       Alert.alert(
//         "Success",
//         status === "completed"
//           ? "Load completed and recorded!"
//           : "Load saved as pending"
//       );

//       router.replace("/(tabs)");
//     } catch (err: any) {
//       Alert.alert("Error", err.message || "Failed to save load");
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
//           <Text style={styles.screenTitle}>Record Load Details</Text>

//           <View style={styles.formCard}>
//             <InputField
//               label="Product / Commodity *"
//               value={productName}
//               onChange={setProductName}
//               placeholder="e.g. Paddy, Maize, Tur dal"
//             />

//             <InputField
//               label="Number of Vehicles *"
//               value={numberOfVehicles}
//               onChange={setVehicles}
//               placeholder="e.g. 3"
//               keyboardType="numeric"
//             />

//             <InputField
//               label="From (Origin) *"
//               value={from}
//               onChange={setFrom}
//               placeholder="Village / Market / Godown"
//             />

//             <InputField
//               label="To (Destination) *"
//               value={to}
//               onChange={setTo}
//               placeholder="Village / Market / Godown"
//             />

//             <InputField
//               label="Price Paying (₹ per Quintal) *"
//               value={pricePaying}
//               onChange={setPrice}
//               placeholder="e.g. 2200"
//               keyboardType="numeric"
//             />

//             <Text style={styles.label}>Load Status *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={status}
//                 onValueChange={(value: "pending" | "completed") =>
//                   setStatus(value)
//                 }
//                 style={styles.picker}
//               >
//                 <Picker.Item label="Pending (ongoing)" value="pending" />
//                 <Picker.Item
//                   label="Completed (finished today)"
//                   value="completed"
//                 />
//               </Picker>
//               <Ionicons
//                 name="chevron-down"
//                 size={20}
//                 color="#4d7c0f"
//                 style={styles.pickerIcon}
//               />
//             </View>

//             {status === "completed" && (
//               <View style={styles.imageSection}>
//                 <Text style={styles.label}>Completion Proof Photo *</Text>

//                 {imageUri ? (
//                   <Image source={{ uri: imageUri }} style={styles.preview} />
//                 ) : (
//                   <View style={styles.previewPlaceholder}>
//                     <Ionicons name="camera-outline" size={48} color="#94a3b8" />
//                     <Text style={styles.placeholderText}>
//                       No photo selected
//                     </Text>
//                   </View>
//                 )}

//                 <TouchableOpacity
//                   style={styles.photoButton}
//                   onPress={pickImage}
//                   disabled={loading}
//                 >
//                   <Ionicons name="camera" size={20} color="#fff" />
//                   <Text style={styles.photoButtonText}>
//                     Capture Completion Photo
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>

//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               (!isFormValid() || loading) && styles.submitDisabled,
//             ]}
//             onPress={submitLoad}
//             disabled={!isFormValid() || loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>
//                 {status === "completed" ? "Complete Load" : "Save Pending Load"}
//               </Text>
//             )}
//           </TouchableOpacity>

//           <View style={{ height: 60 }} />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // ────────────────────────────────────────────────
// // Reusable Input
// // ────────────────────────────────────────────────
// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder = "",
//   keyboardType = "default",
// }: {
//   label: string;
//   value: string;
//   onChange: (text: string) => void;
//   placeholder?: string;
//   keyboardType?: "default" | "numeric" | "phone-pad";
// }) {
//   return (
//     <View style={styles.inputContainer}>
//       <Text style={styles.label}>
//         {label} <Text style={{ color: "#ef4444" }}>*</Text>
//       </Text>
//       <TextInput
//         style={styles.input}
//         value={value}
//         onChangeText={onChange}
//         placeholder={placeholder}
//         placeholderTextColor="#94a3b8"
//         keyboardType={keyboardType}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f0fdf4",
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 100,
//   },
//   screenTitle: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#166534",
//     textAlign: "center",
//     marginBottom: 24,
//   },

//   formCard: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.07,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   label: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#475569",
//     marginBottom: 6,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5e1",
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     fontSize: 16,
//     backgroundColor: "#f8fafc",
//   },

//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: "#cbd5e1",
//     borderRadius: 10,
//     backgroundColor: "#f8fafc",
//     marginBottom: 16,
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   picker: {
//     flex: 1,
//     color: "#1e293b",
//     paddingHorizontal: 12,
//   },
//   pickerIcon: {
//     paddingHorizontal: 12,
//   },

//   imageSection: {
//     marginTop: 8,
//   },
//   preview: {
//     width: "100%",
//     height: 180,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   previewPlaceholder: {
//     width: "100%",
//     height: 180,
//     borderRadius: 12,
//     backgroundColor: "#f1f5f9",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#e2e8f0",
//     borderStyle: "dashed",
//     marginBottom: 12,
//   },
//   placeholderText: {
//     color: "#94a3b8",
//     marginTop: 8,
//     fontSize: 14,
//   },
//   photoButton: {
//     flexDirection: "row",
//     backgroundColor: "#4d7c0f",
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//   },
//   photoButtonText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },

//   submitButton: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//     elevation: 4,
//   },
//   submitDisabled: {
//     backgroundColor: "#86efac",
//     opacity: 0.7,
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 17,
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
  ScrollView,
  Image,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { apiFetch } from "../../services/api";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

/* ───────────────── CONFIG ───────────────── */
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/* ───────────────── TYPES ───────────────── */
type Aggregator = {
  _id: string;
  name: string;
  mobileNumber: string;
  village: string;
  taluk: string;
  productDealing: string;
};

/* ───────────────── COMPONENT ───────────────── */
export default function LoadForm() {
  /* ───── Aggregator Search ───── */
  const [aggMobile, setAggMobile] = useState("");
  const [suggestions, setSuggestions] = useState<Aggregator[]>([]);
  const [aggregator, setAggregator] = useState<Aggregator | null>(null);
  const [searchingAgg, setSearchingAgg] = useState(false);

  /* ───── Load Fields ───── */
  const [productName, setProductName] = useState("");
  const [numberOfVehicles, setVehicles] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [pricePaying, setPrice] = useState("");
  const [status, setStatus] = useState<"pending" | "completed">("pending");

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* ───────── VALIDATION ───────── */
  const isFormValid = () =>
    aggregator &&
    productName.trim() &&
    numberOfVehicles.trim() &&
    from.trim() &&
    to.trim() &&
    pricePaying.trim() &&
    (status === "pending" || imageUri);

  /* ───────── AUTO SEARCH AFTER 6 DIGITS ───────── */
  const onMobileChange = async (text: string) => {
    setAggMobile(text);
    setAggregator(null);

    if (text.length < 6) {
      setSuggestions([]);
      return;
    }

    try {
      console.log("🔍 Searching aggregators:", text);
      setSearchingAgg(true);

      const res = await apiFetch(`/api/aggregators/search?mobile=${text}`);

      console.log("✅ Suggestions:", res);
      setSuggestions(res || []);
    } catch (e) {
      console.log("❌ Search error:", e);
    } finally {
      setSearchingAgg(false);
    }
  };

  /* ───────── SELECT AGGREGATOR ───────── */
  const selectAggregator = (agg: Aggregator) => {
    console.log("✅ Selected aggregator:", agg);
    setAggregator(agg);
    setAggMobile(agg.mobileNumber);
    setSuggestions([]);
  };

  /* ───────── IMAGE ───────── */
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Camera permission required");
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
      Alert.alert("Camera error");
    }
  };

  /* ───────── SUBMIT LOAD ───────── */
  const submitLoad = async () => {
    if (!isFormValid()) {
      Alert.alert("Fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const visitId = await AsyncStorage.getItem("currentVisitId");
      if (!visitId) throw new Error("No active visit found");

      console.log("🚀 Creating load...");

      const loadRes = await apiFetch("/api/loads", {
        method: "POST",
        body: JSON.stringify({
          visitId,
          aggregatorId: aggregator!._id, // 🔥 IMPORTANT
          productName: productName.trim(),
          numberOfVehicles: Number(numberOfVehicles),
          from: from.trim(),
          to: to.trim(),
          pricePaying: Number(pricePaying),
          loadStartedAt: new Date().toISOString(),
        }),
      });

      console.log("✅ Load created:", loadRes);

      if (status === "completed") {
        console.log("📸 Uploading image");

        const fd = new FormData();
        fd.append("file", {
          uri: imageUri!,
          type: "image/jpeg",
          name: "complete.jpg",
        } as any);
        fd.append("upload_preset", UPLOAD_PRESET);

        const upload = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: fd,
        });

        const img = await upload.json();
        console.log("☁️ Image URL:", img.secure_url);

        await apiFetch(`/api/loads/${loadRes._id}/complete`, {
          method: "POST",
          body: JSON.stringify({
            loadEndedAt: new Date().toISOString(),
            completionImage: img.secure_url,
          }),
        });
      }

      await AsyncStorage.removeItem("currentVisitId");

      Alert.alert("Success", "Load saved successfully");
      router.replace("/(tabs)");
    } catch (err: any) {
      console.error("❌ Load submit error:", err);
      Alert.alert("Failed", err.message || "Could not save load");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────── UI ───────────────── */
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.screenTitle}>Create Load</Text>

          {/* ───── Aggregator Search ───── */}
          <View style={styles.formCard}>
            <Text style={styles.label}>Aggregator Mobile *</Text>

            <TextInput
              value={aggMobile}
              onChangeText={onMobileChange}
              placeholder="Enter mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.input}
            />

            {searchingAgg && <ActivityIndicator style={{ marginTop: 6 }} />}

            {suggestions.length > 0 && (
              <View style={styles.suggestionBox}>
                {suggestions.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    style={styles.suggestionItem}
                    onPress={() => selectAggregator(item)}
                  >
                    <Text style={{ fontWeight: "700" }}>{item.name}</Text>
                    <Text style={styles.suggSub}>
                      📞 {item.mobileNumber} | {item.village}, {item.taluk}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {aggregator && (
              <View style={styles.aggCard}>
                <Text style={styles.aggName}>{aggregator.name}</Text>
                <Text style={styles.aggSub}>
                  📍 {aggregator.village}, {aggregator.taluk}
                </Text>
                <Text style={styles.aggSub}>
                  🌾 {aggregator.productDealing}
                </Text>
              </View>
            )}
          </View>

          {/* ───── Load Form ───── */}
          {aggregator && (
            <View style={styles.formCard}>
              <InputField
                label="Product"
                value={productName}
                onChange={setProductName}
              />
              <InputField
                label="Vehicles"
                value={numberOfVehicles}
                onChange={setVehicles}
                keyboardType="numeric"
              />
              <InputField label="From" value={from} onChange={setFrom} />
              <InputField label="To" value={to} onChange={setTo} />
              <InputField
                label="Price"
                value={pricePaying}
                onChange={setPrice}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Status</Text>
              <Picker selectedValue={status} onValueChange={setStatus}>
                <Picker.Item label="Pending" value="pending" />
                <Picker.Item label="Completed" value="completed" />
              </Picker>

              {status === "completed" && (
                <>
                  {imageUri && (
                    <Image source={{ uri: imageUri }} style={styles.preview} />
                  )}
                  <TouchableOpacity style={styles.photoBtn} onPress={pickImage}>
                    <Text style={styles.btnText}>Take Photo</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* ───── Submit ───── */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isFormValid() || loading) && styles.submitDisabled,
            ]}
            onPress={submitLoad}
            disabled={!isFormValid() || loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit Load</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ───────────────── INPUT ───────────────── */

function InputField({ label, value, onChange, keyboardType = "default" }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

/* ───────────────── STYLES ───────────────── */

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f0fdf4" },
  scrollContent: { padding: 20, paddingBottom: 100 },

  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#166534",
  },

  formCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  label: { fontWeight: "600", marginBottom: 6 },

  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  suggestionBox: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },

  suggSub: { color: "#64748b", marginTop: 2 },

  aggCard: {
    backgroundColor: "#ecfeff",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },

  aggName: { fontWeight: "700", fontSize: 16 },
  aggSub: { color: "#475569", marginTop: 4 },

  photoBtn: {
    backgroundColor: "#4d7c0f",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },

  preview: { width: "100%", height: 160, borderRadius: 10, marginBottom: 10 },

  submitButton: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitDisabled: { backgroundColor: "#86efac" },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  btnText: { color: "#fff", fontWeight: "700" },
});
