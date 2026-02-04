// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { Picker } from "@react-native-picker/picker";
// import { apiFetch } from "../../services/api";

// const API_BASE = "https://markhet-internal-ngfs.onrender.com";

// const OnboardFarmer = () => {
//   const [loading, setLoading] = useState(false);

//   /* ================= FORM ================= */
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [cropType, setCropType] = useState("");
//   const [landSize, setLandSize] = useState("");

//   /* ================= LOCATION ================= */
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [taluk, setTaluk] = useState("");
//   const [village, setVillage] = useState("");

//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   /* ================= FETCH STATES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []))
//       .catch(console.log);
//   }, []);

//   /* ================= FETCH DISTRICTS ================= */
//   useEffect(() => {
//     if (!state) return;

//     setDistrict("");
//     setTaluk("");
//     setVillage("");
//     setDistricts([]);
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/districts?state=${state}`)
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []))
//       .catch(console.log);
//   }, [state]);

//   /* ================= FETCH TALUKS ================= */
//   useEffect(() => {
//     if (!district) return;

//     setTaluk("");
//     setVillage("");
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []))
//       .catch(console.log);
//   }, [district]);

//   /* ================= FETCH VILLAGES ================= */
//   useEffect(() => {
//     if (!taluk) return;

//     setVillage("");
//     setVillages([]);

//     fetch(
//       `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []))
//       .catch(console.log);
//   }, [taluk]);

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (
//       !name ||
//       !phone ||
//       !cropType ||
//       !state ||
//       !district ||
//       !taluk ||
//       !village
//     ) {
//       Alert.alert("Missing Fields", "Please fill all required fields");
//       return;
//     }

//     if (loading) return;

//     try {
//       setLoading(true);

//       // apiFetch already returns parsed JSON
//       await apiFetch(`/api/farmer/onboard`, {
//         method: "POST",
//         body: JSON.stringify({
//           name,
//           phone,
//           cropType,
//           state,
//           district,
//           taluk,
//           village,
//           landSize: Number(landSize),
//         }),
//       });

//       Alert.alert("Success", "Farmer onboarded successfully");

//       // Reset form
//       setName("");
//       setPhone("");
//       setCropType("");
//       setState("");
//       setDistrict("");
//       setTaluk("");
//       setVillage("");
//       setLandSize("");
//     } catch (e: any) {
//       Alert.alert("Submission Failed", e?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Onboard Farmer</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Farmer Name *"
//         value={name}
//         onChangeText={setName}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number *"
//         keyboardType="number-pad"
//         value={phone}
//         onChangeText={setPhone}
//       />

//       <View style={styles.pickerBox}>
//         <Picker selectedValue={cropType} onValueChange={setCropType}>
//           <Picker.Item label="Select Crop *" value="" />
//           <Picker.Item label="Banana" value="Banana" />
//           <Picker.Item label="Dry Coconut" value="Dry Coconut" />
//           <Picker.Item label="Tender Coconut" value="Tender Coconut" />
//           <Picker.Item label="Turmeric" value="Turmeric" />
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker selectedValue={state} onValueChange={setState}>
//           <Picker.Item label="Select State *" value="" />
//           {states.map((s) => (
//             <Picker.Item key={s} label={s} value={s} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker selectedValue={district} onValueChange={setDistrict}>
//           <Picker.Item label="Select District *" value="" />
//           {districts.map((d) => (
//             <Picker.Item key={d} label={d} value={d} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker selectedValue={taluk} onValueChange={setTaluk}>
//           <Picker.Item label="Select Taluk *" value="" />
//           {taluks.map((t) => (
//             <Picker.Item key={t} label={t} value={t} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker selectedValue={village} onValueChange={setVillage}>
//           <Picker.Item label="Select Village *" value="" />
//           {villages.map((v) => (
//             <Picker.Item key={v} label={v} value={v} />
//           ))}
//         </Picker>
//       </View>

//       <TextInput
//         style={styles.input}
//         placeholder="Land Size (Acres)"
//         keyboardType="decimal-pad"
//         value={landSize}
//         onChangeText={setLandSize}
//       />

//       <TouchableOpacity
//         style={[styles.button, loading && { opacity: 0.7 }]}
//         onPress={handleSubmit}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Submit</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default OnboardFarmer;

// /* ================= STYLES ================= */
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f9fafb",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   pickerBox: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#16a34a",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   Switch,
//   Image,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { Picker } from "@react-native-picker/picker";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import { apiFetch } from "../../services/api";

// const API_BASE = "https://markhet-internal-ngfs.onrender.com";

// const OnboardFarmer = () => {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);

//   /* ================= BASIC ================= */
//   const [name, setName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [cropType, setCropType] = useState("");
//   const [landSize, setLandSize] = useState("");

//   /* ================= EXTRA QUESTIONS ================= */
//   const [cropCost, setCropCost] = useState("");
//   const [inputSupplier, setInputSupplier] = useState("");
//   const [paymentType, setPaymentType] = useState<"cash" | "credit">("cash");
//   const [droneConsent, setDroneConsent] = useState(false);
//   const [agronomistConsent, setAgronomistConsent] = useState(false);

//   /* ================= LOCATION (DROPDOWN) ================= */
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [taluk, setTaluk] = useState("");
//   const [village, setVillage] = useState("");

//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   /* ================= GPS + PHOTO ================= */
//   const [location, setLocation] = useState<any>(null);
//   const [photo, setPhoto] = useState<string | null>(null);

//   /* ================= FETCH STATES ================= */
//   useEffect(() => {
//     fetch(`${API_BASE}/newlocations/states`)
//       .then((r) => r.json())
//       .then((j) => setStates(j.data || []))
//       .catch(console.log);
//   }, []);

//   /* ================= FETCH DISTRICTS ================= */
//   useEffect(() => {
//     if (!state) return;

//     setDistrict("");
//     setTaluk("");
//     setVillage("");
//     setDistricts([]);
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/districts?state=${state}`)
//       .then((r) => r.json())
//       .then((j) => setDistricts(j.data || []))
//       .catch(console.log);
//   }, [state]);

//   /* ================= FETCH TALUKS ================= */
//   useEffect(() => {
//     if (!district) return;

//     setTaluk("");
//     setVillage("");
//     setTaluks([]);
//     setVillages([]);

//     fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
//       .then((r) => r.json())
//       .then((j) => setTaluks(j.data || []))
//       .catch(console.log);
//   }, [district]);

//   /* ================= FETCH VILLAGES ================= */
//   useEffect(() => {
//     if (!taluk) return;

//     setVillage("");
//     setVillages([]);

//     fetch(
//       `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
//     )
//       .then((r) => r.json())
//       .then((j) => setVillages(j.data || []))
//       .catch(console.log);
//   }, [taluk]);

//   /* ================= GPS ================= */
//   const getLocation = async () => {
//     const { status } = await Location.requestForegroundPermissionsAsync();
//     if (status !== "granted") {
//       Alert.alert("Permission denied");
//       return;
//     }

//     const loc = await Location.getCurrentPositionAsync({});
//     setLocation({
//       latitude: loc.coords.latitude,
//       longitude: loc.coords.longitude,
//     });

//     Alert.alert("Location captured");
//   };

//   /* ================= PHOTO ================= */
//   const pickPhoto = async () => {
//     const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
//     if (!res.canceled) setPhoto(res.assets[0].uri);
//   };

//   /* ================= SUBMIT ================= */
//   const handleSubmit = async () => {
//     if (
//       !name ||
//       !phone ||
//       !cropType ||
//       !state ||
//       !district ||
//       !taluk ||
//       !village
//     ) {
//       Alert.alert("Missing Fields", "Please fill all required fields");
//       router.replace("/(tabs)");
//       return;
//     }

//     try {
//       setLoading(true);

//       await apiFetch(`/api/farmer/onboard`, {
//         method: "POST",
//         body: JSON.stringify({
//           name,
//           phone,
//           cropType,
//           state,
//           district,
//           taluk,
//           village,
//           landSize: Number(landSize),

//           cropCost: Number(cropCost),
//           inputSupplier,
//           paymentType,
//           droneSprayingConsent: droneConsent,
//           agronomistCareConsent: agronomistConsent,

//           location,
//           photo,
//         }),
//       });

//       Alert.alert("Success", "Farmer onboarded successfully");
//       router.replace("/(tabs)");
//     } catch (e: any) {
//       Alert.alert("Failed", e?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= UI ================= */
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Onboard Farmer</Text>

//       {/* BASIC */}
//       <TextInput
//         style={styles.input}
//         placeholder="Farmer Name *"
//         value={name}
//         onChangeText={setName}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number *"
//         value={phone}
//         onChangeText={setPhone}
//       />

//       {/* CROP */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={cropType} onValueChange={setCropType}>
//           <Picker.Item label="Select Crop *" value="" />
//           <Picker.Item label="Banana" value="Banana" />
//           <Picker.Item label="Dry Coconut" value="Dry Coconut" />
//           <Picker.Item label="Tender Coconut" value="Tender Coconut" />
//           <Picker.Item label="Turmeric" value="Turmeric" />
//         </Picker>
//       </View>

//       {/* LOCATION DROPDOWNS */}
//       <View style={styles.pickerBox}>
//         <Picker selectedValue={state} onValueChange={setState}>
//           <Picker.Item label="Select State *" value="" />
//           {states.map((s) => (
//             <Picker.Item key={s} label={s} value={s} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker
//           selectedValue={district}
//           onValueChange={setDistrict}
//           enabled={!!state}
//         >
//           <Picker.Item label="Select District *" value="" />
//           {districts.map((d) => (
//             <Picker.Item key={d} label={d} value={d} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker
//           selectedValue={taluk}
//           onValueChange={setTaluk}
//           enabled={!!district}
//         >
//           <Picker.Item label="Select Taluk *" value="" />
//           {taluks.map((t) => (
//             <Picker.Item key={t} label={t} value={t} />
//           ))}
//         </Picker>
//       </View>

//       <View style={styles.pickerBox}>
//         <Picker
//           selectedValue={village}
//           onValueChange={setVillage}
//           enabled={!!taluk}
//         >
//           <Picker.Item label="Select Village *" value="" />
//           {villages.map((v) => (
//             <Picker.Item key={v} label={v} value={v} />
//           ))}
//         </Picker>
//       </View>

//       {/* EXTRA */}
//       <TextInput
//         style={styles.input}
//         placeholder="Land Size (Acres)"
//         value={landSize}
//         onChangeText={setLandSize}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Crop Cost"
//         value={cropCost}
//         onChangeText={setCropCost}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Input Supplier"
//         value={inputSupplier}
//         onChangeText={setInputSupplier}
//       />

//       <View style={styles.row}>
//         <Text>Payment Type</Text>
//         <Picker
//           selectedValue={paymentType}
//           onValueChange={setPaymentType}
//           style={{ flex: 1 }}
//         >
//           <Picker.Item label="Cash" value="cash" />
//           <Picker.Item label="Credit" value="credit" />
//         </Picker>
//       </View>

//       <View style={styles.row}>
//         <Text>Drone Spraying (₹500/acre)</Text>
//         <Switch value={droneConsent} onValueChange={setDroneConsent} />
//       </View>

//       <View style={styles.row}>
//         <Text>Agronomist Care (A–Z)</Text>
//         <Switch
//           value={agronomistConsent}
//           onValueChange={setAgronomistConsent}
//         />
//       </View>

//       <TouchableOpacity style={styles.button} onPress={getLocation}>
//         <Text style={styles.buttonText}>Capture Location</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.button} onPress={pickPhoto}>
//         <Text style={styles.buttonText}>Take Photo</Text>
//       </TouchableOpacity>

//       {photo && (
//         <Image
//           source={{ uri: photo }}
//           style={{ height: 180, borderRadius: 8 }}
//         />
//       )}

//       <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
//         {loading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.buttonText}>Submit</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default OnboardFarmer;

// /* ================= STYLES ================= */
// const styles = StyleSheet.create({
//   container: { padding: 20, backgroundColor: "#f9fafb" },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   input: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 8,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//   },
//   pickerBox: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#e5e7eb",
//     marginBottom: 12,
//   },
//   row: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   submit: {
//     backgroundColor: "#16a34a",
//     padding: 16,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: { color: "#fff", fontWeight: "600" },
// });

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  Image,
  Modal,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { apiFetch } from "../../services/api";

// ────────────────────────────────────────────────
// Cloudinary config (using Expo public env variables)
// ────────────────────────────────────────────────
const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

const API_BASE = "https://markhet-internal-ngfs.onrender.com";

export default function OnboardFarmer() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ─── Form fields ────────────────────────────────────────
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [cropType, setCropType] = useState("");
  const [landSize, setLandSize] = useState("");
  const [cropCost, setCropCost] = useState("");
  const [inputSupplier, setInputSupplier] = useState("");
  const [paymentType, setPaymentType] = useState<"cash" | "credit">("cash");
  const [droneConsent, setDroneConsent] = useState(false);
  const [agronomistConsent, setAgronomistConsent] = useState(false);

  // ─── Location dropdowns ─────────────────────────────────
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  // ─── GPS + Photo ────────────────────────────────────────
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null); // local file uri after capture

  // ─── Camera modal state ─────────────────────────────────
  const [cameraVisible, setCameraVisible] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<"off" | "on">("off");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  // ─── Load Indian states ─────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/newlocations/states`)
      .then((r) => r.json())
      .then((j) => setStates(j.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!state) return;
    setDistrict("");
    setTaluk("");
    setVillage("");
    setDistricts([]);
    setTaluks([]);
    setVillages([]);

    fetch(`${API_BASE}/newlocations/districts?state=${state}`)
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []))
      .catch(console.error);
  }, [state]);

  useEffect(() => {
    if (!district) return;
    setTaluk("");
    setVillage("");
    setTaluks([]);
    setVillages([]);

    fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
      .then((r) => r.json())
      .then((j) => setTaluks(j.data || []))
      .catch(console.error);
  }, [district]);

  useEffect(() => {
    if (!taluk) return;
    setVillage("");
    setVillages([]);

    fetch(
      `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
    )
      .then((r) => r.json())
      .then((j) => setVillages(j.data || []))
      .catch(console.error);
  }, [taluk]);

  // ─── Camera permission request ──────────────────────────
  useEffect(() => {
    if (cameraVisible && !permission?.granted) {
      requestPermission();
    }
  }, [cameraVisible, permission, requestPermission]);

  // ─── Get current GPS location ───────────────────────────
  const captureLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      return;
    }

    try {
      const pos = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      Alert.alert("Location captured", "Current position saved.");
    } catch (err) {
      Alert.alert("Error", "Could not obtain location");
      console.error(err);
    }
  };

  // ─── Take photo using expo-camera ───────────────────────
  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const captured = await cameraRef.current.takePictureAsync({
        quality: 0.68,
        skipProcessing: true,
      });

      setPhotoUri(captured.uri);
      setCameraVisible(false);
    } catch (err) {
      console.error("Camera capture failed", err);
      Alert.alert("Capture failed", "Could not take photo");
    }
  };

  // ─── Upload photo to Cloudinary ─────────────────────────
  const uploadPhoto = async (localUri: string): Promise<string | undefined> => {
    try {
      const parts = localUri.split(".");
      const ext = parts[parts.length - 1];

      const formData = new FormData();
      formData.append("file", {
        uri: localUri,
        name: `farmer_${Date.now()}.${ext}`,
        type: `image/${ext === "jpg" ? "jpeg" : ext}`,
      } as any);

      formData.append("upload_preset", UPLOAD_PRESET);

      const response = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const json = await response.json();

      if (json.secure_url) {
        return json.secure_url;
      }

      Alert.alert(
        "Upload failed",
        json.error?.message || "Cloudinary rejected the file",
      );
      return undefined;
    } catch (err) {
      console.error("Cloudinary upload error", err);
      Alert.alert("Network error", "Failed to upload photo");
      return undefined;
    }
  };

  // ─── Submit form ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !cropType) {
      Alert.alert("Incomplete", "Please fill all required fields.");
      return;
    }

    setLoading(true);

    try {
      let photoUrl: string | undefined = undefined;

      if (photoUri) {
        photoUrl = await uploadPhoto(photoUri);
        if (!photoUrl) {
          setLoading(false);
          return;
        }
      }

      // const payload = {
      //   name: name.trim(),
      //   phone: phone.trim(),
      //   cropType,
      //   state,
      //   district,
      //   taluk,
      //   village,
      //   landSize: landSize ? Number(landSize) : undefined,
      //   cropCost: cropCost ? Number(cropCost) : undefined,
      //   inputSupplier: inputSupplier.trim() || undefined,
      //   paymentType,
      //   droneSprayingConsent: droneConsent,
      //   agronomistCareConsent: agronomistConsent,
      //   location: location
      //     ? { latitude: location.latitude, longitude: location.longitude }
      //     : undefined,
      //   photo: photoUrl,
      // };

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        cropType,

        ...(state && { state }),
        ...(district && { district }),
        ...(taluk && { taluk }),
        ...(village && { village }),

        landSize: landSize ? Number(landSize) : undefined,
        cropCost: cropCost ? Number(cropCost) : undefined,
        inputSupplier: inputSupplier.trim() || undefined,
        paymentType,
        droneSprayingConsent: droneConsent,
        agronomistCareConsent: agronomistConsent,
        location: location
          ? { latitude: location.latitude, longitude: location.longitude }
          : undefined,
        photo: photoUrl,
      };

      await apiFetch("/api/farmer/onboard", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      Alert.alert("Success", "Farmer onboarded successfully");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Submission failed", err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Permission states ──────────────────────────────────
  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Requesting camera permission…</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, marginBottom: 16, textAlign: "center" }}>
          Camera access is required to take farmer photos.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={styles.permissionButton}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Grant Camera Permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Main UI ────────────────────────────────────────────
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Onboard Farmer</Text>

      <TextInput
        style={styles.input}
        placeholder="Farmer Name *"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <View style={styles.pickerBox}>
        <Picker selectedValue={cropType} onValueChange={setCropType}>
          <Picker.Item label="Select Crop *" value="" />
          <Picker.Item label="Banana" value="Banana" />
          <Picker.Item label="Dry Coconut" value="Dry Coconut" />
          <Picker.Item label="Tender Coconut" value="Tender Coconut" />
          <Picker.Item label="Turmeric" value="Turmeric" />
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker selectedValue={state} onValueChange={setState}>
          <Picker.Item label="Select State (Optional)" value="" />
          {states.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={district}
          onValueChange={setDistrict}
          enabled={!!state}
        >
          <Picker.Item label="Select District (Optional)" value="" />
          {districts.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={taluk}
          onValueChange={setTaluk}
          enabled={!!district}
        >
          <Picker.Item label="Select Taluk (Optional)" value="" />
          {taluks.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={village}
          onValueChange={setVillage}
          enabled={!!taluk}
        >
          <Picker.Item label="Select Village (Optional)" value="" />
          {villages.map((v) => (
            <Picker.Item key={v} label={v} value={v} />
          ))}
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Land Size (acres)"
        value={landSize}
        onChangeText={setLandSize}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Crop Cost (₹)"
        value={cropCost}
        onChangeText={setCropCost}
      />

      <TextInput
        style={styles.input}
        placeholder="Input Supplier"
        value={inputSupplier}
        onChangeText={setInputSupplier}
      />

      <View style={styles.row}>
        <Text>Payment Type</Text>
        <Picker
          selectedValue={paymentType}
          onValueChange={(v) => setPaymentType(v as "cash" | "credit")}
          style={{ flex: 1 }}
        >
          <Picker.Item label="Cash" value="cash" />
          <Picker.Item label="Credit" value="credit" />
        </Picker>
      </View>

      <View style={styles.row}>
        <Text>Drone Spraying Consent (₹500/acre)</Text>
        <Switch value={droneConsent} onValueChange={setDroneConsent} />
      </View>

      <View style={styles.row}>
        <Text>Agronomist Care Consent</Text>
        <Switch
          value={agronomistConsent}
          onValueChange={setAgronomistConsent}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={captureLocation}>
        <Text style={styles.buttonText}>Capture Current Location</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setCameraVisible(true)}
      >
        <Text style={styles.buttonText}>Take Farmer Photo (Camera)</Text>
      </TouchableOpacity>

      {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={styles.photoPreview}
          resizeMode="cover"
        />
      )}

      <TouchableOpacity
        style={[styles.submit, loading && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit & Onboard Farmer</Text>
        )}
      </TouchableOpacity>

      {/* ─── In-app Camera Modal ──────────────────────────────────────── */}
      <Modal
        visible={cameraVisible}
        animationType="slide"
        onRequestClose={() => setCameraVisible(false)}
      >
        <SafeAreaView style={styles.cameraContainer}>
          <StatusBar hidden />

          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing={facing}
            flash={flash}
            mode="picture"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.topBar}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setCameraVisible(false)}
                >
                  <Text style={styles.controlText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() => setFlash(flash === "off" ? "on" : "off")}
                >
                  <Text style={styles.controlText}>
                    Flash: {flash === "off" ? "OFF" : "ON"}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.captureArea} onPress={takePhoto}>
                <View style={styles.captureRing}>
                  <View style={styles.captureButton} />
                </View>
              </TouchableOpacity>

              <View style={styles.bottomBar}>
                <TouchableOpacity
                  style={styles.controlBtn}
                  onPress={() =>
                    setFacing(facing === "back" ? "front" : "back")
                  }
                >
                  <Text style={styles.controlText}>Flip Camera</Text>
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </SafeAreaView>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    paddingBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    fontSize: 16,
  },
  pickerBox: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginBottom: 12,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  submit: {
    backgroundColor: "#10b981",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  submitDisabled: {
    backgroundColor: "#6ee7b7",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  photoPreview: {
    height: 220,
    borderRadius: 12,
    marginVertical: 16,
    backgroundColor: "#e5e7eb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    marginTop: 16,
  },

  // Camera modal styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bottomBar: {
    alignItems: "center",
  },
  captureArea: {
    alignItems: "center",
    marginBottom: 40,
  },
  captureRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 4,
    borderColor: "#ffffff80",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff",
  },
  controlBtn: {
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  controlText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
