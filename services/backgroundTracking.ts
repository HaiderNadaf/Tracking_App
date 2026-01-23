// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiFetch } from "./api";

// export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

// TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
//   if (error) {
//     console.error("❌ BG TASK ERROR:", error);
//     return;
//   }

//   if (!data) return;

//   const { locations }: any = data;
//   const loc = locations[0];
//   if (!loc) return;

//   const session = await AsyncStorage.getItem("trackingSession");
//   if (!session) return;

//   const point = {
//     session,
//     lat: loc.coords.latitude,
//     lng: loc.coords.longitude,
//     time: new Date().toISOString(),
//   };

//   console.log("📍 BG POINT:", point);

//   try {
//     await apiFetch("/tracking/point", {
//       method: "POST",
//       body: JSON.stringify(point),
//     });
//   } catch (e) {
//     console.log("⚠️ Offline, saving locally");

//     const raw = (await AsyncStorage.getItem("offlinePoints")) || "[]";
//     const arr = JSON.parse(raw);
//     arr.push(point);
//     await AsyncStorage.setItem("offlinePoints", JSON.stringify(arr));
//   }
// });

// import * as TaskManager from "expo-task-manager";
// import * as Location from "expo-location";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiFetch } from "./api";

// export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

// TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
//   if (error) {
//     console.error("❌ BG TASK ERROR:", error);
//     return;
//   }

//   if (!data) return;

//   const { locations }: any = data;
//   const loc = locations[0];
//   if (!loc) return;

//   const session = await AsyncStorage.getItem("trackingSession");
//   if (!session) {
//     console.log("No session → skipping background point");
//     return;
//   }

//   const point = {
//     session,
//     lat: loc.coords.latitude,
//     lng: loc.coords.longitude,
//     time: new Date().toISOString(),
//   };

//   console.log("📍 BG POINT:", point);

//   try {
//     await apiFetch("/api/tracking/point", {
//       method: "POST",
//       body: JSON.stringify(point),
//     });
//   } catch (e) {
//     console.log("⚠️ Offline, saving locally");
//     const raw = (await AsyncStorage.getItem("offlinePoints")) || "[]";
//     const arr = JSON.parse(raw);
//     arr.push(point);
//     await AsyncStorage.setItem("offlinePoints", JSON.stringify(arr));
//   }
// });

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "./api";

export const LOCATION_TASK = "BACKGROUND_LOCATION_TASK";

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("❌ BG TASK ERROR:", error);
    return;
  }

  if (!data) return;

  const { locations }: any = data;
  const loc = locations?.[0];
  if (!loc) return;

  try {
    const sessionId = await AsyncStorage.getItem("trackingSession");
    if (!sessionId) {
      console.log("⚠️ No active session, skipping BG point");
      return;
    }

    const point = {
      sessionId,
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      timestamp: new Date(loc.timestamp).toISOString(),
    };

    console.log("📍 BG POINT:", point);

    await apiFetch("/api/tracking/auto-point", {
      method: "POST",
      body: JSON.stringify(point),
    });
  } catch (err) {
    console.log("⚠️ Network failed, saving offline");

    const raw = (await AsyncStorage.getItem("offlinePoints")) || "[]";
    const arr = JSON.parse(raw);

    arr.push({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      accuracy: loc.coords.accuracy,
      timestamp: new Date(loc.timestamp).toISOString(),
    });

    await AsyncStorage.setItem("offlinePoints", JSON.stringify(arr));
  }
});
