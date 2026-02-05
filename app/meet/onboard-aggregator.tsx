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
import { KeyboardAvoidingView, Platform } from "react-native";

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

  const submit = async () => {
    // if (
    //   !name ||
    //   !mobileNumber ||
    //   !state ||
    //   !district ||
    //   !taluk ||
    //   !village ||
    //   !productDealing ||
    //   !selfie ||
    //   !storeImage ||
    //   !location
    // ) {
    //   Alert.alert("Fill all required fields");
    //   return;
    // }

    const missingFields: string[] = [];

    if (!name.trim()) missingFields.push("Name");
    if (!mobileNumber.trim()) missingFields.push("Mobile Number");
    if (!state) missingFields.push("State");
    if (!district) missingFields.push("District");
    if (!taluk) missingFields.push("Taluk");
    if (!village) missingFields.push("Village");
    if (!productDealing.trim()) missingFields.push("Product Dealing");
    if (!selfie) missingFields.push("Selfie Photo");
    if (!storeImage) missingFields.push("Store Photo");
    if (!location?.latitude || !location?.longitude)
      missingFields.push("Location");

    if (missingFields.length > 0) {
      Alert.alert(
        "Required Fields Missing",
        `Please fill:\n\n• ${missingFields.join("\n• ")}`,
      );
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

      const data = await apiFetch(`/api/aggregators/onboard`, {
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
      {/* <ScrollView style={styles.container}> */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Onboard Aggregator</Text>

          <TextInput
            style={styles.input}
            placeholder="Name *"
            placeholderTextColor="#94a3b8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mobile *"
            placeholderTextColor="#94a3b8"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.input}
            placeholder="GST No"
            placeholderTextColor="#94a3b8"
            value={gstNo}
            onChangeText={setGstNo}
          />
          <TextInput
            style={styles.input}
            placeholder="PAN No"
            placeholderTextColor="#94a3b8"
            value={panNo}
            onChangeText={setPanNo}
          />
          <TextInput
            style={styles.input}
            placeholder="Aadhar No"
            placeholderTextColor="#94a3b8"
            value={aadharNo}
            onChangeText={setAadharNo}
            keyboardType="numeric"
          />
          {/* 
          <Picker selectedValue={state} onValueChange={setState}>
            <Picker.Item label="Select State" value="" color="black" />
            {states.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>

          <Picker selectedValue={district} onValueChange={setDistrict}>
            <Picker.Item label="Select District" value="" color="black" />
            {districts.map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>

          <Picker selectedValue={taluk} onValueChange={setTaluk}>
            <Picker.Item label="Select Taluk" value="" color="black" />
            {taluks.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>

          <Picker selectedValue={village} onValueChange={setVillage}>
            <Picker.Item label="Select Village" value="" color="black" />
            {villages.map((v) => (
              <Picker.Item key={v} label={v} value={v} />
            ))}
          </Picker> */}

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={state}
              onValueChange={(val) => {
                setState(val);
                setDistrict("");
                setTaluk("");
                setVillage("");
              }}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="Select State" value="" color="black" />
              {states.map((s) => (
                <Picker.Item key={s} label={s} value={s} color="black" />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={district}
              onValueChange={(val) => {
                setDistrict(val);
                setTaluk("");
                setVillage("");
              }}
              enabled={!!state}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="Select District" value="" color="black" />
              {districts.map((d) => (
                <Picker.Item key={d} label={d} value={d} color="black" />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={taluk}
              onValueChange={(val) => {
                setTaluk(val);
                setVillage("");
              }}
              enabled={!!district}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="Select Taluk" value="" color="black" />
              {taluks.map((t) => (
                <Picker.Item key={t} label={t} value={t} color="black" />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerBox}>
            <Picker
              selectedValue={village}
              onValueChange={setVillage}
              enabled={!!taluk}
              style={styles.picker}
              dropdownIconColor="black"
            >
              <Picker.Item label="Select Village" value="" color="black" />
              {villages.map((v) => (
                <Picker.Item key={v} label={v} value={v} color="black" />
              ))}
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Product Dealing *"
            placeholderTextColor="#94a3b8"
            value={productDealing}
            onChangeText={setProductDealing}
          />
          <TextInput
            style={styles.input}
            placeholder="Capacity of Dealing"
            placeholderTextColor="#94a3b8"
            value={capacityOfDealing}
            onChangeText={setCapacityOfDealing}
          />
          <TextInput
            style={styles.input}
            placeholder="Currently Supply To"
            placeholderTextColor="#94a3b8"
            value={currentlySupplyTo}
            onChangeText={setCurrentlySupplyTo}
          />
          <TextInput
            style={styles.input}
            placeholder="Supply Location"
            placeholderTextColor="#94a3b8"
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
          {selfie ? (
            <Image source={{ uri: selfie }} style={styles.img} />
          ) : null}

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
          {/* </ScrollView> */}
        </ScrollView>
      </KeyboardAvoidingView>

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
    color: "black",
    marginBottom: 16,
  },
  pickerBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    justifyContent: "center",
  },

  picker: {
    color: "black",
    height: 50,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: "black",
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
