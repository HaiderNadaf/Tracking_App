import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "./api";

export async function syncOfflinePoints() {
  try {
    const sessionId = await AsyncStorage.getItem("trackingSession");
    if (!sessionId) return;

    const raw = await AsyncStorage.getItem("offlinePoints");
    if (!raw) return;

    const points = JSON.parse(raw);
    if (!points.length) return;

    console.log("🔄 Syncing offline points:", points.length);

    for (const p of points) {
      await apiFetch("/api/tracking/auto-point", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          lat: p.latitude,
          lng: p.longitude,
          accuracy: p.accuracy,
          timestamp: p.timestamp,
        }),
      });
    }

    await AsyncStorage.removeItem("offlinePoints");
    console.log("✅ Offline points synced");
  } catch (err) {
    console.log("❌ Sync failed:", err);
  }
}
