import * as Location from "expo-location";
import { LOCATION_TASK } from "./backgroundTracking";

export async function startBackgroundTracking() {
  const { status: fg } = await Location.requestForegroundPermissionsAsync();
  if (fg !== "granted") throw new Error("Foreground location denied");

  const { status: bg } = await Location.requestBackgroundPermissionsAsync();
  if (bg !== "granted") throw new Error("Background location denied");

  const already = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (already) {
    console.log("⚠️ BG tracking already running");
    return;
  }

  await Location.startLocationUpdatesAsync(LOCATION_TASK, {
    accuracy: Location.Accuracy.Balanced,
    distanceInterval: 50,
    timeInterval: 5 * 60 * 1000,
    showsBackgroundLocationIndicator: true,
    foregroundService: {
      notificationTitle: "Field tracking active",
      notificationBody: "Location is being tracked for field work",
    },
  });

  console.log("✅ Background tracking started");
}

export async function stopBackgroundTracking() {
  const started = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
  if (started) {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK);
    console.log("🛑 Background tracking stopped");
  }
}
