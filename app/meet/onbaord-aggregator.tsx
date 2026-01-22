import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { apiFetch } from "../../services/api";

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/* ================= CONFIG ================= */
const API_BASE = "https://markhet-internal-ngfs.onrender.com";

type Crop = { cropName: string; capacity: string };

export default function OnboardAggregator() {
  /* ===== BASIC ===== */
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gstNo, setGstNo] = useState("");
  const [panNo, setPanNo] = useState("");
  const [aadharNo, setAadharNo] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  /* ===== LOCATION ===== */
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [taluk, setTaluk] = useState("");
  const [village, setVillage] = useState("");

  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [taluks, setTaluks] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);

  /* ===== BUSINESS ===== */
  const [productDealing, setProductDealing] = useState("");
  const [capacityOfDealing, setCapacityOfDealing] = useState("");
  const [currentlySupplyTo, setCurrentlySupplyTo] = useState("");
  const [supplyLocation, setSupplyLocation] = useState("");

  /* ===== CROPS ===== */
  const [crops, setCrops] = useState<Crop[]>([{ cropName: "", capacity: "" }]);

  /* ===== IMAGES ===== */
  const [selfie, setSelfie] = useState("");
  const [storeImage, setStoreImage] = useState("");

  /* ===== GPS ===== */
  const [location, setLocation] = useState<any>(null);
  const [locLoading, setLocLoading] = useState(false);

  /* ===== SUBMIT ===== */
  const [loading, setLoading] = useState(false);

  /* ===== CAMERA ===== */
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<"selfie" | "store">("selfie");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  const uploadToCloudinary = async (uri: string) => {
    const formData = new FormData();

    formData.append("file", {
      uri,
      type: "image/jpeg",
      name: `photo_${Date.now()}.jpg`,
    } as any);

    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    return data.secure_url as string;
  };

  /* ================= LOCATION ================= */
  const getLocation = async () => {
    try {
      setLocLoading(true);
      const perm = await Location.requestForegroundPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("Location permission needed");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      Alert.alert("Location captured");
    } catch (e) {
      console.log("Location error", e);
      Alert.alert("Location failed");
    } finally {
      setLocLoading(false);
    }
  };

  /* ================= OPEN CAMERA ================= */
  const openCamera = async (type: "selfie" | "store") => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert("Camera permission required");
        return;
      }
    }
    setCameraType(type);
    setShowCamera(true);
  };

  /* ================= TAKE PHOTO ================= */
  // const takePhoto = async () => {
  //   try {
  //     if (!cameraRef.current) return;

  //     const photo = await cameraRef.current.takePictureAsync({
  //       quality: 0.4,
  //       skipProcessing: true,
  //     });

  //     if (cameraType === "selfie") setSelfie(photo.uri);
  //     else setStoreImage(photo.uri);

  //     setShowCamera(false);
  //   } catch (e) {
  //     console.log("Camera error", e);
  //     Alert.alert("Failed to take photo");
  //   }
  // };

  const takePhoto = async () => {
    try {
      if (!cameraRef.current || !isCameraReady || capturing) return;

      setCapturing(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.4,
        skipProcessing: true,
      });

      if (!photo?.uri) throw new Error("No photo uri");

      if (cameraType === "selfie") setSelfie(photo.uri);
      else setStoreImage(photo.uri);

      // ✅ wait before closing camera (VERY IMPORTANT)
      setTimeout(() => {
        setShowCamera(false);
        setIsCameraReady(false);
      }, 300);
    } catch (e) {
      console.log("Camera crash fix error:", e);
      Alert.alert("Camera error", "Please try again");
    } finally {
      setCapturing(false);
    }
  };

  /* ================= LOCATION DROPDOWNS ================= */
  useEffect(() => {
    fetch(`${API_BASE}/newlocations/states`)
      .then((r) => r.json())
      .then((j) => setStates(j.data || []))
      .catch(console.log);
  }, []);

  useEffect(() => {
    if (!state) return;
    fetch(`${API_BASE}/newlocations/districts?state=${state}`)
      .then((r) => r.json())
      .then((j) => setDistricts(j.data || []))
      .catch(console.log);
  }, [state]);

  useEffect(() => {
    if (!district) return;
    fetch(`${API_BASE}/newlocations/taluks?state=${state}&district=${district}`)
      .then((r) => r.json())
      .then((j) => setTaluks(j.data || []))
      .catch(console.log);
  }, [district]);

  useEffect(() => {
    if (!taluk) return;
    fetch(
      `${API_BASE}/newlocations/villages?state=${state}&district=${district}&taluk=${taluk}`,
    )
      .then((r) => r.json())
      .then((j) => setVillages(j.data || []))
      .catch(console.log);
  }, [taluk]);

  /* ================= SUBMIT ================= */
  // const submit = async () => {
  //   if (
  //     !name ||
  //     !mobileNumber ||
  //     !state ||
  //     !district ||
  //     !taluk ||
  //     !village ||
  //     !productDealing ||
  //     !selfie ||
  //     !storeImage ||
  //     !location
  //   ) {
  //     Alert.alert("Fill all required fields");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const payload = {
  //       name,
  //       mobileNumber,
  //       gstNo,
  //       panNo,
  //       aadharNo,
  //       state,
  //       district,
  //       taluk,
  //       village,
  //       productDealing,
  //       capacityOfDealing,
  //       currentlySupplyTo,
  //       supplyLocation,
  //       cropDetails: crops.filter((c) => c.cropName),
  //       selfieImage: selfie,
  //       storeImage: storeImage,
  //       location,
  //     };

  //     console.log("SENDING:", payload);

  //     const data = await apiFetch(`/aggregators/onboard`, {
  //       method: "POST",
  //       body: JSON.stringify(payload),
  //     });

  //     console.log("RESPONSE:", data);

  //     Alert.alert("Success", "Aggregator onboarded");
  //     router.replace("/(tabs)");
  //   } catch (e: any) {
  //     console.log("Submit error:", e);
  //     Alert.alert("Submit failed", e.message || "Server error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const submit = async () => {
    if (
      !name ||
      !mobileNumber ||
      !state ||
      !district ||
      !taluk ||
      !village ||
      !productDealing ||
      !selfie ||
      !storeImage ||
      !location
    ) {
      Alert.alert("Fill all required fields");
      return;
    }

    try {
      setLoading(true);

      // ✅ UPLOAD IMAGES FIRST
      console.log("Uploading selfie...");
      const selfieUrl = await uploadToCloudinary(selfie);

      console.log("Uploading store image...");
      const storeUrl = await uploadToCloudinary(storeImage);

      // ✅ SEND CLOUDINARY URL TO BACKEND
      const payload = {
        name,
        mobileNumber,
        gstNo,
        panNo,
        aadharNo,
        state,
        district,
        taluk,
        village,
        productDealing,
        capacityOfDealing,
        currentlySupplyTo,
        supplyLocation,
        cropDetails: crops.filter((c) => c.cropName),
        selfieImage: selfieUrl, // ✅ URL
        storeImage: storeUrl, // ✅ URL
        location,
      };

      console.log("FINAL PAYLOAD:", payload);

      const data = await apiFetch(`/aggregators/onboard`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("RESPONSE:", data);

      Alert.alert("Success", "Aggregator onboarded");
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log("Submit error:", e);
      Alert.alert("Submit failed", e.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Onboard Aggregator</Text>

        <TextInput
          style={styles.input}
          placeholder="Name *"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Mobile *"
          value={mobileNumber}
          onChangeText={setMobileNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="GST No"
          value={gstNo}
          onChangeText={setGstNo}
        />
        <TextInput
          style={styles.input}
          placeholder="PAN No"
          value={panNo}
          onChangeText={setPanNo}
        />
        <TextInput
          style={styles.input}
          placeholder="Aadhar No"
          value={aadharNo}
          onChangeText={setAadharNo}
          keyboardType="numeric"
        />

        <Picker selectedValue={state} onValueChange={setState}>
          <Picker.Item label="Select State" value="" />
          {states.map((s) => (
            <Picker.Item key={s} label={s} value={s} />
          ))}
        </Picker>

        <Picker selectedValue={district} onValueChange={setDistrict}>
          <Picker.Item label="Select District" value="" />
          {districts.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>

        <Picker selectedValue={taluk} onValueChange={setTaluk}>
          <Picker.Item label="Select Taluk" value="" />
          {taluks.map((t) => (
            <Picker.Item key={t} label={t} value={t} />
          ))}
        </Picker>

        <Picker selectedValue={village} onValueChange={setVillage}>
          <Picker.Item label="Select Village" value="" />
          {villages.map((v) => (
            <Picker.Item key={v} label={v} value={v} />
          ))}
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Product Dealing *"
          value={productDealing}
          onChangeText={setProductDealing}
        />
        <TextInput
          style={styles.input}
          placeholder="Capacity of Dealing"
          value={capacityOfDealing}
          onChangeText={setCapacityOfDealing}
        />
        <TextInput
          style={styles.input}
          placeholder="Currently Supply To"
          value={currentlySupplyTo}
          onChangeText={setCurrentlySupplyTo}
        />
        <TextInput
          style={styles.input}
          placeholder="Supply Location"
          value={supplyLocation}
          onChangeText={setSupplyLocation}
        />

        <TouchableOpacity style={styles.btn} onPress={getLocation}>
          {locLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Get Location</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => openCamera("selfie")}
        >
          <Text style={styles.btnText}>Take Selfie</Text>
        </TouchableOpacity>
        {selfie ? <Image source={{ uri: selfie }} style={styles.img} /> : null}

        <TouchableOpacity
          style={styles.btn}
          onPress={() => openCamera("store")}
        >
          <Text style={styles.btnText}>Store Photo</Text>
        </TouchableOpacity>
        {storeImage ? (
          <Image source={{ uri: storeImage }} style={styles.img} />
        ) : null}

        <TouchableOpacity
          style={styles.submit}
          onPress={submit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* CAMERA MODAL */}
      <Modal visible={showCamera} animationType="slide">
        <View style={{ flex: 1, backgroundColor: "black" }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing={cameraType === "selfie" ? "front" : "back"}
            onCameraReady={() => setIsCameraReady(true)}
          />

          <View style={styles.cameraControls}>
            <TouchableOpacity onPress={() => setShowCamera(false)}>
              <Text style={styles.camBtnText}>Cancel</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={takePhoto} style={styles.captureBtn} /> */}
            <TouchableOpacity
              onPress={takePhoto}
              style={[
                styles.captureBtn,
                capturing && { backgroundColor: "#999" },
              ]}
              disabled={capturing}
            />

            <View style={{ width: 60 }} />
          </View>
        </View>
      </Modal>
    </>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 8,
  },
  submit: {
    backgroundColor: "#16a34a",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 20,
  },
  btnText: { color: "#fff", fontWeight: "700" },
  img: { width: "100%", height: 200, borderRadius: 10, marginTop: 8 },

  cameraControls: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
  },
  camBtnText: { color: "#fff", fontSize: 16 },
});

// import {
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from "react-native";
// import React, { useState } from "react";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// type Crop = { cropName: string; capacity: string };

// export default function OnboardAggregator() {
//   const [form, setForm] = useState({
//     name: "",
//     mobileNumber: "",
//     gstNo: "",
//     panNo: "",
//     aadharNo: "",
//     village: "",
//     taluk: "",
//     district: "",
//     state: "",
//     productDealing: "",
//     capacityOfDealing: "",
//     currentlySupplyTo: "",
//     supplyLocation: "",
//   });

//   const [crops, setCrops] = useState<Crop[]>([{ cropName: "", capacity: "" }]);

//   const [location, setLocation] = useState<any>(null);
//   const [selfie, setSelfie] = useState<string | null>(null);
//   const [storeImage, setStoreImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   /* ================= LOCATION ================= */
//   const getLocation = async () => {
//     try {
//       console.log("📍 Requesting location permission...");
//       const { status } = await Location.requestForegroundPermissionsAsync();

//       if (status !== "granted") {
//         Alert.alert("Permission denied");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       console.log("📍 Location captured:", loc.coords);

//       setLocation(loc.coords);
//       Alert.alert("Location captured");
//     } catch (err) {
//       console.error("❌ Location error:", err);
//     }
//   };

//   /* ================= IMAGE PICK ================= */
//   const takePhoto = async (setFn: any, label: string) => {
//     try {
//       console.log(`📸 Opening camera for ${label}`);

//       const { granted } = await ImagePicker.requestCameraPermissionsAsync();
//       if (!granted) {
//         Alert.alert("Camera permission required");
//         return;
//       }

//       const res = await ImagePicker.launchCameraAsync({
//         quality: 0.6,
//       });

//       if (!res.canceled) {
//         console.log(`📸 ${label} image selected`);
//         setFn(res.assets[0].uri);
//       }
//     } catch (err) {
//       console.error("❌ Camera error:", err);
//     }
//   };

//   /* ================= CLOUDINARY ================= */
//   const uploadImage = async (uri: string) => {
//     console.log("☁️ Uploading image:", uri);

//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       type: "image/jpeg",
//       name: "image.jpg",
//     } as any);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     const res = await fetch(CLOUDINARY_URL, {
//       method: "POST",
//       body: formData,
//     });

//     const data = await res.json();
//     console.log("☁️ Cloudinary response:", data);

//     if (!data.secure_url) {
//       throw new Error("Image upload failed");
//     }

//     return data.secure_url;
//   };

//   /* ================= SUBMIT ================= */
//   const submit = async () => {
//     try {
//       console.log("🚀 Submitting aggregator onboarding");

//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) {
//         console.log("❌ User not found in storage");
//         return router.replace("/(auth)/register");
//       }

//       if (!selfie || !storeImage || !location) {
//         Alert.alert("Please capture images & location");
//         return;
//       }

//       setLoading(true);

//       console.log("☁️ Uploading images...");
//       const selfieUrl = await uploadImage(selfie);
//       const storeUrl = await uploadImage(storeImage);

//       const payload = {
//         ...form,
//         cropDetails: crops.filter((c) => c.cropName && c.capacity),
//         selfieImage: selfieUrl,
//         storeImage: storeUrl,
//         location: {
//           latitude: location.latitude,
//           longitude: location.longitude,
//         },
//       };

//       console.log("📤 FINAL PAYLOAD:", JSON.stringify(payload, null, 2));

//       const res = await apiFetch("/aggregators/onboard", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       console.log("✅ Backend response:", res);

//       Alert.alert("Success", "Aggregator onboarded successfully");
//       router.replace("/(tabs)");
//     } catch (err) {
//       console.error("❌ Submit failed:", err);
//       Alert.alert("Onboarding failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onChange = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

//   const updateCrop = (i: number, k: keyof Crop, v: string) => {
//     const arr = [...crops];
//     arr[i][k] = v;
//     setCrops(arr);
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Onboard Aggregator</Text>

//       {Object.keys(form).map((k) => (
//         <TextInput
//           key={k}
//           placeholder={k}
//           value={(form as any)[k]}
//           onChangeText={(v) => onChange(k, v)}
//           style={styles.input}
//         />
//       ))}

//       <Text style={styles.subTitle}>Crop Details</Text>

//       {crops.map((c, i) => (
//         <View key={i} style={{ flexDirection: "row", gap: 8 }}>
//           <TextInput
//             placeholder="Crop Name"
//             value={c.cropName}
//             onChangeText={(v) => updateCrop(i, "cropName", v)}
//             style={[styles.input, { flex: 1 }]}
//           />
//           <TextInput
//             placeholder="Capacity"
//             value={c.capacity}
//             onChangeText={(v) => updateCrop(i, "capacity", v)}
//             style={[styles.input, { flex: 1 }]}
//           />
//         </View>
//       ))}

//       <TouchableOpacity
//         style={styles.addBtn}
//         onPress={() => setCrops((p) => [...p, { cropName: "", capacity: "" }])}
//       >
//         <Text style={{ color: "#2563eb", fontWeight: "700" }}>+ Add Crop</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.btn} onPress={getLocation}>
//         <Text style={styles.btnText}>
//           {location ? "Location Captured" : "Get Location"}
//         </Text>
//       </TouchableOpacity>

//       {selfie && <Image source={{ uri: selfie }} style={styles.preview} />}
//       <TouchableOpacity
//         style={styles.photoBtn}
//         onPress={() => takePhoto(setSelfie, "selfie")}
//       >
//         <Text style={styles.btnText}>Take Selfie</Text>
//       </TouchableOpacity>

//       {storeImage && (
//         <Image source={{ uri: storeImage }} style={styles.preview} />
//       )}
//       <TouchableOpacity
//         style={styles.photoBtn}
//         onPress={() => takePhoto(setStoreImage, "store")}
//       >
//         <Text style={styles.btnText}>Take Store Photo</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.submitBtn} onPress={submit}>
//         <Text style={styles.btnText}>
//           {loading ? "Submitting..." : "Submit"}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { padding: 20, paddingBottom: 80 },
//   title: { fontSize: 20, fontWeight: "700", textAlign: "center" },
//   subTitle: { fontWeight: "700", marginVertical: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#cbd5f5",
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   btn: {
//     backgroundColor: "#2563eb",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   addBtn: { alignItems: "center", marginBottom: 10 },
//   photoBtn: {
//     backgroundColor: "#7c3aed",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   submitBtn: {
//     backgroundColor: "#22c55e",
//     padding: 16,
//     borderRadius: 14,
//     alignItems: "center",
//   },
//   btnText: { color: "#fff", fontWeight: "700" },
//   preview: { width: "100%", height: 160, borderRadius: 10 },
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
// import React, { useState, useEffect } from "react";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { Picker } from "@react-native-picker/picker";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME!;
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET!;
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// const API_BASE = "https://markhet-internal-ngfs.onrender.com";

// type Crop = { cropName: string; capacity: string };

// export default function OnboardAggregator() {
//   const [form, setForm] = useState({
//     name: "",
//     mobileNumber: "",
//     gstNo: "",
//     panNo: "",
//     aadharNo: "",
//     state: "",
//     district: "",
//     taluk: "",
//     village: "",
//     productDealing: "",
//     capacityOfDealing: "",
//     currentlySupplyTo: "",
//     supplyLocation: "",
//   });

//   const [crops, setCrops] = useState<Crop[]>([{ cropName: "", capacity: "" }]);

//   const [location, setLocation] = useState<any>(null);
//   const [selfie, setSelfie] = useState<string | null>(null);
//   const [storeImage, setStoreImage] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Location dropdown data
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   // Loading states for dropdowns
//   const [locationLoading, setLocationLoading] = useState({
//     states: false,
//     districts: false,
//     taluks: false,
//     villages: false,
//   });

//   const isFormValid = () =>
//     form.name.trim() &&
//     form.mobileNumber.trim().length === 10 &&
//     form.village.trim() &&
//     form.taluk.trim() &&
//     form.district.trim() &&
//     form.state.trim() &&
//     form.productDealing.trim() &&
//     selfie &&
//     storeImage &&
//     location &&
//     crops.some((c) => c.cropName.trim());

// // Fetch states on mount
// useEffect(() => {
//   const fetchStates = async () => {
//     setLocationLoading((prev) => ({ ...prev, states: true }));
//     try {
//       const response = await fetch(`${API_BASE}/newlocations/states`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();
//       const stateList = Array.isArray(data.data) ? data.data : data || [];
//       setStates(stateList);
//       console.log("States loaded:", stateList.length);
//     } catch (err) {
//       console.error("States fetch failed:", err);
//       Alert.alert(
//         "Connection Issue",
//         "Failed to load states. Check internet."
//       );
//       setStates([]);
//     } finally {
//       setLocationLoading((prev) => ({ ...prev, states: false }));
//     }
//   };

//   fetchStates();
// }, []);

// // Fetch districts when state changes
// useEffect(() => {
//   if (!form.state) {
//     setDistricts([]);
//     setTaluks([]);
//     setVillages([]);
//     setForm((p) => ({ ...p, district: "", taluk: "", village: "" }));
//     return;
//   }

//   const fetchDistricts = async () => {
//     setLocationLoading((prev) => ({ ...prev, districts: true }));
//     try {
//       const url = `${API_BASE}/newlocations/districts?state=${encodeURIComponent(
//         form.state
//       )}`;
//       console.log("Fetching districts from:", url);

//       const response = await fetch(url, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();
//       const districtList = Array.isArray(data.data) ? data.data : data || [];
//       setDistricts(districtList);
//     } catch (err) {
//       console.error("Districts fetch failed:", err);
//       setDistricts([]);
//     } finally {
//       setLocationLoading((prev) => ({ ...prev, districts: false }));
//     }
//   };

//   fetchDistricts();
// }, [form.state]);

// // Fetch taluks when district changes
// useEffect(() => {
//   if (!form.district) {
//     setTaluks([]);
//     setVillages([]);
//     setForm((p) => ({ ...p, taluk: "", village: "" }));
//     return;
//   }

//   const fetchTaluks = async () => {
//     setLocationLoading((prev) => ({ ...prev, taluks: true }));
//     try {
//       const url = `${API_BASE}/newlocations/taluks?state=${encodeURIComponent(
//         form.state
//       )}&district=${encodeURIComponent(form.district)}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();
//       const talukList = Array.isArray(data.data) ? data.data : data || [];
//       setTaluks(talukList);
//     } catch (err) {
//       console.error("Taluks fetch failed:", err);
//       setTaluks([]);
//     } finally {
//       setLocationLoading((prev) => ({ ...prev, taluks: false }));
//     }
//   };

//   fetchTaluks();
// }, [form.district]);

// // Fetch villages when taluk changes
// useEffect(() => {
//   if (!form.taluk) {
//     setVillages([]);
//     setForm((p) => ({ ...p, village: "" }));
//     return;
//   }

//   const fetchVillages = async () => {
//     setLocationLoading((prev) => ({ ...prev, villages: true }));
//     try {
//       const url = `${API_BASE}/newlocations/villages?state=${encodeURIComponent(
//         form.state
//       )}&district=${encodeURIComponent(
//         form.district
//       )}&taluk=${encodeURIComponent(form.taluk)}`;
//       const response = await fetch(url);
//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const data = await response.json();
//       const villageList = Array.isArray(data.data) ? data.data : data || [];
//       setVillages(villageList);
//     } catch (err) {
//       console.error("Villages fetch failed:", err);
//       setVillages([]);
//     } finally {
//       setLocationLoading((prev) => ({ ...prev, villages: false }));
//     }
//   };

//   fetchVillages();
// }, [form.taluk]);

//   // GPS Location
//   const getLocation = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Required", "Location access is needed.");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       setLocation(loc.coords);
//       Alert.alert("Success", "Location captured successfully");
//     } catch (err) {
//       Alert.alert("Error", "Could not get location");
//     }
//   };

//   // Camera / Image
//   const takePhoto = async (
//     setFn: (uri: string | null) => void,
//     label: string
//   ) => {
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
//         setFn(result.assets[0].uri);
//       }
//     } catch (err) {
//       Alert.alert("Error", `Failed to take ${label} photo`);
//     }
//   };

//   // Upload to Cloudinary
//   const uploadImage = async (uri: string): Promise<string> => {
//     try {
//       const formData = new FormData();
//       formData.append("file", {
//         uri,
//         type: "image/jpeg",
//         name: "aggregator.jpg",
//       } as any);
//       formData.append("upload_preset", UPLOAD_PRESET);

//       const res = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();

//       if (!data.secure_url) throw new Error("Image upload failed");
//       return data.secure_url;
//     } catch (err) {
//       console.error("Cloudinary upload failed:", err);
//       throw err;
//     }
//   };

//   // Submit form
//   const submit = async () => {
//     if (!isFormValid()) {
//       Alert.alert(
//         "Incomplete Form",
//         "Please fill all required fields and add at least one crop."
//       );
//       return;
//     }

//     setLoading(true);

//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) throw new Error("User not found. Please login again.");

//       const user = JSON.parse(userStr);

//       const selfieUrl = await uploadImage(selfie!);
//       const storeUrl = await uploadImage(storeImage!);

//       const payload = {
//         user: user._id,
//         ...form,
//         cropDetails: crops.filter((c) => c.cropName.trim()),
//         selfieImage: selfieUrl,
//         storeImage: storeUrl,
//         location: location
//           ? {
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }
//           : undefined,
//       };

//       const res = await apiFetch("/aggregators/onboard", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       Alert.alert("Success", "Aggregator onboarded successfully!");
//       router.replace("/(tabs)");
//     } catch (err: any) {
//       console.error("Submit error:", err);
//       Alert.alert(
//         "Error",
//         err.message || "Onboarding failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (key: string, value: string) =>
//     setForm((prev) => ({ ...prev, [key]: value }));

//   const updateCrop = (index: number, field: keyof Crop, value: string) => {
//     const newCrops = [...crops];
//     newCrops[index][field] = value;
//     setCrops(newCrops);
//   };

//   const addCrop = () =>
//     setCrops((prev) => [...prev, { cropName: "", capacity: "" }]);

//   const removeCrop = (index: number) => {
//     if (crops.length === 1) return;
//     setCrops((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Text style={styles.screenTitle}>Onboard Aggregator</Text>

//           {/* PERSONAL INFO */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Personal Details</Text>

//             <InputField
//               label="Full Name *"
//               value={form.name}
//               onChange={(v) => handleChange("name", v)}
//               placeholder="Enter full name"
//             />

//             <InputField
//               label="Mobile Number *"
//               value={form.mobileNumber}
//               onChange={(v) => handleChange("mobileNumber", v)}
//               placeholder="10-digit number"
//               keyboardType="phone-pad"
//             />

//             <InputField
//               label="GST Number"
//               value={form.gstNo}
//               onChange={(v) => handleChange("gstNo", v)}
//               placeholder="GSTIN (optional)"
//             />

//             <InputField
//               label="PAN Number"
//               value={form.panNo}
//               onChange={(v) => handleChange("panNo", v)}
//               placeholder="PAN (optional)"
//             />

//             <InputField
//               label="Aadhaar Number"
//               value={form.aadharNo}
//               onChange={(v) => handleChange("aadharNo", v)}
//               placeholder="Aadhaar (optional)"
//               keyboardType="numeric"
//             />
//           </View>

//           {/* LOCATION - Cascading Dropdowns */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Location</Text>

//             <Text style={styles.fieldLabel}>State *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.state}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     state: value,
//                     district: "",
//                     taluk: "",
//                     village: "",
//                   }))
//                 }
//                 enabled={!locationLoading.states}
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {locationLoading.states ? (
//                   <Picker.Item label="Loading states..." value="" />
//                 ) : (
//                   states.map((s) => <Picker.Item key={s} label={s} value={s} />)
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>District *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.district}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     district: value,
//                     taluk: "",
//                     village: "",
//                   }))
//                 }
//                 enabled={!!form.state && !locationLoading.districts}
//               >
//                 <Picker.Item label="Select District" value="" />
//                 {locationLoading.districts ? (
//                   <Picker.Item label="Loading districts..." value="" />
//                 ) : (
//                   districts.map((d) => (
//                     <Picker.Item key={d} label={d} value={d} />
//                   ))
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>Taluk *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.taluk}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     taluk: value,
//                     village: "",
//                   }))
//                 }
//                 enabled={!!form.district && !locationLoading.taluks}
//               >
//                 <Picker.Item label="Select Taluk" value="" />
//                 {locationLoading.taluks ? (
//                   <Picker.Item label="Loading taluks..." value="" />
//                 ) : (
//                   taluks.map((t) => <Picker.Item key={t} label={t} value={t} />)
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>Village *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.village}
//                 onValueChange={(value) =>
//                   setForm((p) => ({ ...p, village: value }))
//                 }
//                 enabled={!!form.taluk && !locationLoading.villages}
//               >
//                 <Picker.Item label="Select Village" value="" />
//                 {locationLoading.villages ? (
//                   <Picker.Item label="Loading villages..." value="" />
//                 ) : (
//                   villages.map((v) => (
//                     <Picker.Item key={v} label={v} value={v} />
//                   ))
//                 )}
//               </Picker>
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.locationBtn,
//                 location && styles.locationBtnCaptured,
//               ]}
//               onPress={getLocation}
//               disabled={loading}
//             >
//               <Ionicons
//                 name={location ? "checkmark-circle" : "location-outline"}
//                 size={20}
//                 color={location ? "#16a34a" : "#4d7c0f"}
//               />
//               <Text style={styles.btnText}>
//                 {location ? "Location Captured" : "Capture Current Location"}
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* BUSINESS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Business Details</Text>

//             <InputField
//               label="Products Dealing In *"
//               value={form.productDealing}
//               onChange={(v) => handleChange("productDealing", v)}
//               placeholder="e.g. Paddy, Maize, Tur dal..."
//             />

//             <InputField
//               label="Approx Monthly Capacity (Quintals) *"
//               value={form.capacityOfDealing}
//               onChange={(v) => handleChange("capacityOfDealing", v)}
//               keyboardType="numeric"
//             />

//             <InputField
//               label="Currently Supplying To"
//               value={form.currentlySupplyTo}
//               onChange={(v) => handleChange("currentlySupplyTo", v)}
//               placeholder="Company names or markets (optional)"
//             />

//             <InputField
//               label="Main Supply Locations"
//               value={form.supplyLocation}
//               onChange={(v) => handleChange("supplyLocation", v)}
//               placeholder="Districts / States (optional)"
//             />
//           </View>

//           {/* CROPS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Major Crops Handled</Text>

//             {crops.map((crop, index) => (
//               <View key={index} style={styles.cropRow}>
//                 <InputField
//                   label="Crop Name"
//                   value={crop.cropName}
//                   onChange={(v) => updateCrop(index, "cropName", v)}
//                   containerStyle={{ flex: 1 }}
//                 />

//                 <InputField
//                   label="Capacity (Quintals)"
//                   value={crop.capacity}
//                   onChange={(v) => updateCrop(index, "capacity", v)}
//                   keyboardType="numeric"
//                   containerStyle={{ flex: 1 }}
//                 />

//                 {crops.length > 1 && (
//                   <TouchableOpacity
//                     style={styles.removeCropBtn}
//                     onPress={() => removeCrop(index)}
//                   >
//                     <Ionicons name="trash-outline" size={20} color="#ef4444" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ))}

//             <TouchableOpacity style={styles.addCropBtn} onPress={addCrop}>
//               <Ionicons name="add-circle-outline" size={20} color="#4d7c0f" />
//               <Text style={styles.addCropText}>Add Another Crop</Text>
//             </TouchableOpacity>
//           </View>

//           {/* PHOTOS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Photos</Text>

//             <View style={styles.photoContainer}>
//               <Text style={styles.photoLabel}>Selfie *</Text>
//               {selfie ? (
//                 <Image source={{ uri: selfie }} style={styles.photoPreview} />
//               ) : (
//                 <View style={[styles.photoPreview, styles.photoPlaceholder]}>
//                   <Ionicons
//                     name="person-circle-outline"
//                     size={60}
//                     color="#cbd5e1"
//                   />
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.photoBtn}
//                 onPress={() => takePhoto(setSelfie, "selfie")}
//                 disabled={loading}
//               >
//                 <Ionicons name="camera-outline" size={20} color="#fff" />
//                 <Text style={styles.btnTextSmall}>Take Selfie</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.photoContainer}>
//               <Text style={styles.photoLabel}>Store / Shop Front *</Text>
//               {storeImage ? (
//                 <Image
//                   source={{ uri: storeImage }}
//                   style={styles.photoPreview}
//                 />
//               ) : (
//                 <View style={[styles.photoPreview, styles.photoPlaceholder]}>
//                   <Ionicons
//                     name="storefront-outline"
//                     size={60}
//                     color="#cbd5e1"
//                   />
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.photoBtn}
//                 onPress={() => takePhoto(setStoreImage, "store")}
//                 disabled={loading}
//               >
//                 <Ionicons name="camera-outline" size={20} color="#fff" />
//                 <Text style={styles.btnTextSmall}>Take Store Photo</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* SUBMIT */}
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               (!isFormValid() || loading) && styles.submitDisabled,
//             ]}
//             onPress={submit}
//             disabled={!isFormValid() || loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>Submit Aggregator</Text>
//             )}
//           </TouchableOpacity>

//           <View style={{ height: 60 }} />
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// // Reusable Input Component
// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder = "",
//   keyboardType = "default",
//   containerStyle = {},
// }: {
//   label: string;
//   value: string;
//   onChange: (val: string) => void;
//   placeholder?: string;
//   keyboardType?: "default" | "numeric" | "phone-pad";
//   containerStyle?: object;
// }) {
//   return (
//     <View style={[styles.inputContainer, containerStyle]}>
//       <Text style={styles.inputLabel}>
//         {label}{" "}
//         {label.includes("*") && <Text style={{ color: "#ef4444" }}>*</Text>}
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
//     marginBottom: 28,
//   },

//   section: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 16,
//   },

//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: "#475569",
//     marginBottom: 6,
//     fontWeight: "500",
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
//     overflow: "hidden",
//   },

//   locationBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#4d7c0f",
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//     marginTop: 16,
//   },
//   locationBtnCaptured: {
//     backgroundColor: "#16a34a",
//   },

//   cropRow: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 10,
//     marginBottom: 12,
//   },
//   removeCropBtn: {
//     padding: 12,
//     backgroundColor: "#fee2e2",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addCropBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "#4d7c0f",
//     borderStyle: "dashed",
//     borderRadius: 12,
//     gap: 8,
//   },
//   addCropText: {
//     color: "#4d7c0f",
//     fontWeight: "600",
//   },

//   photoContainer: {
//     marginBottom: 24,
//   },
//   photoLabel: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 8,
//   },
//   photoPreview: {
//     width: "100%",
//     height: 160,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   photoPlaceholder: {
//     backgroundColor: "#f1f5f9",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#e2e8f0",
//     borderStyle: "dashed",
//   },
//   photoBtn: {
//     flexDirection: "row",
//     backgroundColor: "#4d7c0f",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },

//   submitButton: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 20,
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

//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   btnTextSmall: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
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
// import React, { useState, useEffect, useCallback } from "react";
// import * as Location from "expo-location";
// import * as ImagePicker from "expo-image-picker";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
// import { apiFetch } from "../../services/api";
// import { Picker } from "@react-native-picker/picker";

// const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUD_NAME || "";
// const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUD_UPLOAD_PRESET || "";
// const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

// const API_BASE = "https://markhet-internal-ngfs.onrender.com";

// type CropDetail = {
//   cropName: string;
//   capacity: string;
// };

// export default function OnboardAggregator() {
//   const [form, setForm] = useState({
//     name: "",
//     mobileNumber: "",
//     gstNo: "",
//     panNo: "",
//     aadharNo: "",
//     state: "",
//     district: "",
//     taluk: "",
//     village: "",
//     productDealing: "",
//     capacityOfDealing: "",
//     currentlySupplyTo: "",
//     supplyLocation: "",
//   });

//   const [cropDetails, setCropDetails] = useState<CropDetail[]>([
//     { cropName: "", capacity: "" },
//   ]);

//   const [gps, setGps] = useState<{
//     latitude: number;
//     longitude: number;
//   } | null>(null);
//   const [selfieUri, setSelfieUri] = useState<string | null>(null);
//   const [storeUri, setStoreUri] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Location dropdown data
//   const [states, setStates] = useState<string[]>([]);
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [taluks, setTaluks] = useState<string[]>([]);
//   const [villages, setVillages] = useState<string[]>([]);

//   const [locLoading, setLocLoading] = useState({
//     states: false,
//     districts: false,
//     taluks: false,
//     villages: false,
//   });

//   const isValidForm = () =>
//     form.name.trim() &&
//     form.mobileNumber.trim().length === 10 &&
//     form.state.trim() &&
//     form.district.trim() &&
//     form.taluk.trim() &&
//     form.village.trim() &&
//     form.productDealing.trim() &&
//     !!selfieUri &&
//     !!storeUri &&
//     !!gps &&
//     cropDetails.some((c) => c.cropName.trim() && c.capacity.trim());

//   // Fetch states on mount
//   useEffect(() => {
//     const fetchStates = async () => {
//       setLocLoading((prev) => ({ ...prev, states: true }));
//       try {
//         const response = await fetch(`${API_BASE}/newlocations/states`);
//         if (!response?.ok)
//           throw new Error(`HTTP ${response?.status || "no response"}`);

//         const data = await response.json();
//         const stateList = Array.isArray(data.data) ? data.data : data || [];
//         setStates(stateList);
//       } catch (err: any) {
//         console.error("States fetch failed:", err);
//         Alert.alert("Error", "Failed to load states. Check your internet.");
//         setStates([]);
//       } finally {
//         setLocLoading((prev) => ({ ...prev, states: false }));
//       }
//     };

//     fetchStates();
//   }, []);

//   // Districts when state changes
//   useEffect(() => {
//     if (!form.state) {
//       setDistricts([]);
//       setTaluks([]);
//       setVillages([]);
//       setForm((p) => ({ ...p, district: "", taluk: "", village: "" }));
//       return;
//     }

//     const fetchDistricts = async () => {
//       setLocLoading((prev) => ({ ...prev, districts: true }));
//       try {
//         const url = `${API_BASE}/newlocations/districts?state=${encodeURIComponent(
//           form.state
//         )}`;
//         const response = await fetch(url);
//         if (!response?.ok)
//           throw new Error(`HTTP ${response?.status || "no response"}`);

//         const data = await response.json();
//         setDistricts(Array.isArray(data.data) ? data.data : data || []);
//       } catch (err: any) {
//         console.error("Districts fetch failed:", err);
//         setDistricts([]);
//       } finally {
//         setLocLoading((prev) => ({ ...prev, districts: false }));
//       }
//     };

//     fetchDistricts();
//   }, [form.state]);

//   // Taluks when district changes
//   useEffect(() => {
//     if (!form.district) {
//       setTaluks([]);
//       setVillages([]);
//       setForm((p) => ({ ...p, taluk: "", village: "" }));
//       return;
//     }

//     const fetchTaluks = async () => {
//       setLocLoading((prev) => ({ ...prev, taluks: true }));
//       try {
//         const url = `${API_BASE}/newlocations/taluks?state=${encodeURIComponent(
//           form.state
//         )}&district=${encodeURIComponent(form.district)}`;
//         const response = await fetch(url);
//         if (!response?.ok)
//           throw new Error(`HTTP ${response?.status || "no response"}`);

//         const data = await response.json();
//         setTaluks(Array.isArray(data.data) ? data.data : data || []);
//       } catch (err: any) {
//         console.error("Taluks fetch failed:", err);
//         setTaluks([]);
//       } finally {
//         setLocLoading((prev) => ({ ...prev, taluks: false }));
//       }
//     };

//     fetchTaluks();
//   }, [form.district]);

//   // Villages when taluk changes
//   useEffect(() => {
//     if (!form.taluk) {
//       setVillages([]);
//       setForm((p) => ({ ...p, village: "" }));
//       return;
//     }

//     const fetchVillages = async () => {
//       setLocLoading((prev) => ({ ...prev, villages: true }));
//       try {
//         const url = `${API_BASE}/newlocations/villages?state=${encodeURIComponent(
//           form.state
//         )}&district=${encodeURIComponent(
//           form.district
//         )}&taluk=${encodeURIComponent(form.taluk)}`;
//         const response = await fetch(url);
//         if (!response?.ok)
//           throw new Error(`HTTP ${response?.status || "no response"}`);

//         const data = await response.json();
//         setVillages(Array.isArray(data.data) ? data.data : data || []);
//       } catch (err: any) {
//         console.error("Villages fetch failed:", err);
//         setVillages([]);
//       } finally {
//         setLocLoading((prev) => ({ ...prev, villages: false }));
//       }
//     };

//     fetchVillages();
//   }, [form.taluk]);

//   // Capture GPS location
//   const captureGps = async () => {
//     try {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Required", "Location access is needed.");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       setGps(loc.coords);
//       Alert.alert("Success", "Location captured successfully");
//     } catch (err) {
//       Alert.alert("Error", "Could not get location");
//     }
//   };

//   // Take photo with camera
//   const takePhoto = async (
//     setter: React.Dispatch<React.SetStateAction<string | null>>,
//     label: string
//   ) => {
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

//       if (!result.canceled && result.assets?.[0]?.uri) {
//         setter(result.assets[0].uri);
//       }
//     } catch (err) {
//       Alert.alert("Error", `Failed to take ${label} photo`);
//     }
//   };

//   // Upload image to Cloudinary
//   const uploadToCloud = async (uri: string): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       type: "image/jpeg",
//       name: "photo.jpg",
//     } as any);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     const res = await fetch(CLOUDINARY_URL, {
//       method: "POST",
//       body: formData,
//     });

//     if (!res.ok)
//       throw new Error(`Cloudinary upload failed: HTTP ${res.status}`);

//     const json = await res.json();
//     if (!json?.secure_url) throw new Error("No secure_url in response");

//     return json.secure_url;
//   };

//   // Submit form to backend
//   const submitAggregator = async () => {
//     if (!isValidForm()) {
//       Alert.alert(
//         "Incomplete Form",
//         "Please fill all required fields and add at least one crop."
//       );
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const userStr = await AsyncStorage.getItem("user");
//       if (!userStr) throw new Error("User not found. Please login again.");

//       const user = JSON.parse(userStr);

//       const selfieUrl = selfieUri ? await uploadToCloud(selfieUri) : undefined;
//       const storeUrl = storeUri ? await uploadToCloud(storeUri) : undefined;

//       const payload = {
//         name: form.name.trim(),
//         mobileNumber: form.mobileNumber.trim(),
//         gstNo: form.gstNo.trim() || undefined,
//         panNo: form.panNo.trim() || undefined,
//         aadharNo: form.aadharNo.trim() || undefined,
//         state: form.state.trim(),
//         district: form.district.trim(),
//         taluk: form.taluk.trim(),
//         village: form.village.trim(),
//         productDealing: form.productDealing.trim(),
//         capacityOfDealing: form.capacityOfDealing.trim(),
//         currentlySupplyTo: form.currentlySupplyTo.trim() || undefined,
//         supplyLocation: form.supplyLocation.trim() || undefined,
//         cropDetails: cropDetails.filter(
//           (c) => c.cropName.trim() && c.capacity.trim()
//         ),
//         selfieImage: selfieUrl,
//         storeImage: storeUrl,
//         location: gps
//           ? { latitude: gps.latitude, longitude: gps.longitude }
//           : undefined,
//         user: user._id,
//       };

//       const response = await apiFetch("/aggregators/onboard", {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });

//       Alert.alert(
//         "Success",
//         response.message || "Aggregator onboarded successfully!",
//         [{ text: "OK", onPress: () => router.replace("/(tabs)") }]
//       );
//     } catch (err: any) {
//       console.error("Onboard error:", err);
//       Alert.alert(
//         "Error",
//         err.message || "Failed to onboard aggregator. Please try again."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleChange = useCallback((key: string, value: string) => {
//     console.log(`[INPUT] Field "${key}" changed to: "${value}"`);
//     setForm((prev) => ({ ...prev, [key]: value }));
//   }, []);

//   const handleCropUpdate = (
//     index: number,
//     field: keyof CropDetail,
//     value: string
//   ) => {
//     setCropDetails((prev) => {
//       const updated = [...prev];
//       updated[index] = { ...updated[index], [field]: value };
//       return updated;
//     });
//   };

//   const addCrop = () =>
//     setCropDetails((prev) => [...prev, { cropName: "", capacity: "" }]);

//   const removeCrop = (index: number) => {
//     if (cropDetails.length <= 1) return;
//     setCropDetails((prev) => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 140} // Higher offset to give more breathing room on Android
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           keyboardDismissMode="interactive"
//         >
//           <Text style={styles.screenTitle}>Onboard Aggregator</Text>
//           {/* PERSONAL DETAILS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Personal Details</Text>

//             <InputField
//               label="Full Name *"
//               value={form.name}
//               onChange={(v) => handleChange("name", v)}
//               placeholder="Enter full name"
//             />

//             <InputField
//               label="Mobile Number *"
//               value={form.mobileNumber}
//               onChange={(v) => handleChange("mobileNumber", v)}
//               placeholder="10-digit number"
//               keyboardType="phone-pad"
//               maxLength={10}
//               returnKeyType="done"
//             />

//             <InputField
//               label="GST Number"
//               value={form.gstNo}
//               onChange={(v) => handleChange("gstNo", v)}
//               placeholder="GSTIN (optional)"
//               returnKeyType="done"
//             />

//             <InputField
//               label="PAN Number"
//               value={form.panNo}
//               onChange={(v) => handleChange("panNo", v)}
//               placeholder="PAN (optional)"
//               returnKeyType="done"
//             />

//             <InputField
//               label="Aadhaar Number"
//               value={form.aadharNo}
//               onChange={(v) => handleChange("aadharNo", v)}
//               placeholder="Aadhaar (optional)"
//               keyboardType="numeric"
//               maxLength={12}
//               returnKeyType="done"
//             />
//           </View>
//           {/* LOCATION */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Location</Text>

//             <Text style={styles.fieldLabel}>State *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.state}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     state: value,
//                     district: "",
//                     taluk: "",
//                     village: "",
//                   }))
//                 }
//                 enabled={!locLoading.states}
//               >
//                 <Picker.Item label="Select State" value="" />
//                 {locLoading.states ? (
//                   <Picker.Item label="Loading states..." value="" />
//                 ) : (
//                   states.map((s) => <Picker.Item key={s} label={s} value={s} />)
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>District *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.district}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     district: value,
//                     taluk: "",
//                     village: "",
//                   }))
//                 }
//                 enabled={!!form.state && !locLoading.districts}
//               >
//                 <Picker.Item label="Select District" value="" />
//                 {locLoading.districts ? (
//                   <Picker.Item label="Loading districts..." value="" />
//                 ) : (
//                   districts.map((d) => (
//                     <Picker.Item key={d} label={d} value={d} />
//                   ))
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>Taluk *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.taluk}
//                 onValueChange={(value) =>
//                   setForm((p) => ({
//                     ...p,
//                     taluk: value,
//                     village: "",
//                   }))
//                 }
//                 enabled={!!form.district && !locLoading.taluks}
//               >
//                 <Picker.Item label="Select Taluk" value="" />
//                 {locLoading.taluks ? (
//                   <Picker.Item label="Loading taluks..." value="" />
//                 ) : (
//                   taluks.map((t) => <Picker.Item key={t} label={t} value={t} />)
//                 )}
//               </Picker>
//             </View>

//             <Text style={styles.fieldLabel}>Village *</Text>
//             <View style={styles.pickerContainer}>
//               <Picker
//                 selectedValue={form.village}
//                 onValueChange={(value) => handleChange("village", value)}
//                 enabled={!!form.taluk && !locLoading.villages}
//               >
//                 <Picker.Item label="Select Village" value="" />
//                 {locLoading.villages ? (
//                   <Picker.Item label="Loading villages..." value="" />
//                 ) : (
//                   villages.map((v) => (
//                     <Picker.Item key={v} label={v} value={v} />
//                   ))
//                 )}
//               </Picker>
//             </View>

//             <TouchableOpacity
//               style={[styles.locationBtn, gps && styles.locationBtnCaptured]}
//               onPress={captureGps}
//               disabled={submitting}
//             >
//               <Ionicons
//                 name={gps ? "checkmark-circle" : "location-outline"}
//                 size={20}
//                 color={gps ? "#16a34a" : "#4d7c0f"}
//               />
//               <Text style={styles.btnText}>
//                 {gps ? "Location Captured" : "Capture Current Location"}
//               </Text>
//             </TouchableOpacity>
//           </View>
//           {/* BUSINESS DETAILS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Business Details</Text>

//             <InputField
//               label="Products Dealing In *"
//               value={form.productDealing}
//               onChange={(v) => handleChange("productDealing", v)}
//               placeholder="e.g. Coconut, Paddy..."
//               returnKeyType="done"
//             />

//             <InputField
//               label="Approx Monthly Capacity (Tons) *"
//               value={form.capacityOfDealing}
//               onChange={(v) => handleChange("capacityOfDealing", v)}
//               placeholder="e.g. 10 Tons"
//               keyboardType="numeric"
//               returnKeyType="done"
//               blurOnSubmit={true} // Critical: helps avoid layout crash on Android
//               multiline={false}
//             />

//             <InputField
//               label="Currently Supplying To"
//               value={form.currentlySupplyTo}
//               onChange={(v) => handleChange("currentlySupplyTo", v)}
//               placeholder="Local Market, companies..."
//               returnKeyType="done"
//               blurOnSubmit={true}
//             />

//             <InputField
//               label="Main Supply Locations"
//               value={form.supplyLocation}
//               onChange={(v) => handleChange("supplyLocation", v)}
//               placeholder="Tumkur, Bangalore, etc."
//               returnKeyType="done"
//               blurOnSubmit={true}
//             />
//           </View>
//           {/* CROPS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Major Crops Handled</Text>

//             {cropDetails.map((crop, index) => (
//               <View key={index} style={styles.cropRow}>
//                 <InputField
//                   label="Crop Name"
//                   value={crop.cropName}
//                   onChange={(v) => handleCropUpdate(index, "cropName", v)}
//                   containerStyle={{ flex: 1 }}
//                   returnKeyType="done"
//                 />

//                 <InputField
//                   label="Capacity"
//                   value={crop.capacity}
//                   onChange={(v) => handleCropUpdate(index, "capacity", v)}
//                   keyboardType="numeric"
//                   containerStyle={{ flex: 1 }}
//                   returnKeyType="done"
//                   blurOnSubmit={true}
//                 />

//                 {cropDetails.length > 1 && (
//                   <TouchableOpacity
//                     style={styles.removeCropBtn}
//                     onPress={() => removeCrop(index)}
//                   >
//                     <Ionicons name="trash-outline" size={20} color="#ef4444" />
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ))}

//             <TouchableOpacity style={styles.addCropBtn} onPress={addCrop}>
//               <Ionicons name="add-circle-outline" size={20} color="#4d7c0f" />
//               <Text style={styles.addCropText}>Add Another Crop</Text>
//             </TouchableOpacity>
//           </View>
//           {/* PHOTOS */}
//           <View style={styles.section}>
//             <Text style={styles.sectionHeader}>Photos</Text>

//             <View style={styles.photoContainer}>
//               <Text style={styles.photoLabel}>Selfie *</Text>
//               {selfieUri ? (
//                 <Image
//                   source={{ uri: selfieUri }}
//                   style={styles.photoPreview}
//                 />
//               ) : (
//                 <View style={[styles.photoPreview, styles.photoPlaceholder]}>
//                   <Ionicons
//                     name="person-circle-outline"
//                     size={60}
//                     color="#cbd5e1"
//                   />
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.photoBtn}
//                 onPress={() => takePhoto(setSelfieUri, "selfie")}
//                 disabled={submitting}
//               >
//                 <Ionicons name="camera-outline" size={20} color="#fff" />
//                 <Text style={styles.btnTextSmall}>Take Selfie</Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.photoContainer}>
//               <Text style={styles.photoLabel}>Store / Shop Front *</Text>
//               {storeUri ? (
//                 <Image source={{ uri: storeUri }} style={styles.photoPreview} />
//               ) : (
//                 <View style={[styles.photoPreview, styles.photoPlaceholder]}>
//                   <Ionicons
//                     name="storefront-outline"
//                     size={60}
//                     color="#cbd5e1"
//                   />
//                 </View>
//               )}
//               <TouchableOpacity
//                 style={styles.photoBtn}
//                 onPress={() => takePhoto(setStoreUri, "store")}
//                 disabled={submitting}
//               >
//                 <Ionicons name="camera-outline" size={20} color="#fff" />
//                 <Text style={styles.btnTextSmall}>Take Store Photo</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//           {/* SUBMIT */}
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               (!isValidForm() || submitting) && styles.submitDisabled,
//             ]}
//             onPress={submitAggregator}
//             disabled={!isValidForm() || submitting}
//           >
//             {submitting ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.submitText}>Submit Aggregator</Text>
//             )}
//           </TouchableOpacity>
//           <View style={{ height: 140 }} /> {/* Extra padding at bottom */}
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder = "",
//   keyboardType = "default",
//   containerStyle = {},
//   maxLength,
//   returnKeyType = "default",
//   blurOnSubmit = false,
// }: {
//   label: string;
//   value: string;
//   onChange: (text: string) => void;
//   placeholder?: string;
//   keyboardType?: "default" | "numeric" | "phone-pad";
//   containerStyle?: object;
//   maxLength?: number;
//   returnKeyType?: "done" | "default" | "next";
//   blurOnSubmit?: boolean;
// }) {
//   return (
//     <View style={[styles.inputContainer, containerStyle]}>
//       <Text style={styles.inputLabel}>
//         {label}{" "}
//         {label.includes("*") && <Text style={{ color: "#ef4444" }}>*</Text>}
//       </Text>
//       <TextInput
//         style={styles.input}
//         value={value}
//         onChangeText={onChange}
//         placeholder={placeholder}
//         placeholderTextColor="#94a3b8"
//         keyboardType={keyboardType}
//         maxLength={maxLength}
//         returnKeyType={returnKeyType}
//         blurOnSubmit={blurOnSubmit}
//         multiline={false}
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
//     paddingBottom: 180, // Even more bottom padding to help Android
//   },
//   screenTitle: {
//     fontSize: 26,
//     fontWeight: "700",
//     color: "#166534",
//     textAlign: "center",
//     marginBottom: 28,
//   },
//   fieldLabel: {
//     fontSize: 14,
//     color: "#475569",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   section: {
//     backgroundColor: "#ffffff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sectionHeader: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#1e293b",
//     marginBottom: 16,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 14,
//     color: "#475569",
//     marginBottom: 6,
//     fontWeight: "500",
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
//     overflow: "hidden",
//   },
//   locationBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#4d7c0f",
//     paddingVertical: 14,
//     borderRadius: 12,
//     gap: 10,
//     marginTop: 16,
//   },
//   locationBtnCaptured: {
//     backgroundColor: "#16a34a",
//   },
//   cropRow: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     gap: 10,
//     marginBottom: 12,
//   },
//   removeCropBtn: {
//     padding: 12,
//     backgroundColor: "#fee2e2",
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   addCropBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderWidth: 1,
//     borderColor: "#4d7c0f",
//     borderStyle: "dashed",
//     borderRadius: 12,
//     gap: 8,
//   },
//   addCropText: {
//     color: "#4d7c0f",
//     fontWeight: "600",
//   },
//   photoContainer: {
//     marginBottom: 24,
//   },
//   photoLabel: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 8,
//   },
//   photoPreview: {
//     width: "100%",
//     height: 160,
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   photoPlaceholder: {
//     backgroundColor: "#f1f5f9",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#e2e8f0",
//     borderStyle: "dashed",
//   },
//   photoBtn: {
//     flexDirection: "row",
//     backgroundColor: "#4d7c0f",
//     paddingVertical: 12,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   submitButton: {
//     backgroundColor: "#16a34a",
//     paddingVertical: 16,
//     borderRadius: 14,
//     alignItems: "center",
//     marginTop: 20,
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
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 15,
//   },
//   btnTextSmall: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });
