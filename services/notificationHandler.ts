// import * as Notifications from "expo-notifications";
// import * as Location from "expo-location";

// const API = process.env.EXPO_PUBLIC_API_URL!;

// type AvailabilityData = {
//   type: string;
//   sessionId: string;
// };

// export function registerAvailabilityHandler() {
//   return Notifications.addNotificationResponseReceivedListener(async (res) => {
//     try {
//       const action = res.actionIdentifier; // YES | NO
//       const data = res.notification.request.content.data as AvailabilityData;

//       if (data?.type !== "AVAILABILITY") return;

//       console.log("🔔 Availability action:", action);
//       console.log("📦 Notification data:", data);

//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("❌ Location permission denied");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({
//         accuracy: Location.Accuracy.High,
//       });

//       await fetch(`${API}/api/availability/respond`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           sessionId: data.sessionId,
//           available: action === "YES",
//           lat: loc.coords.latitude,
//           lng: loc.coords.longitude,
//         }),
//       });

//       console.log("✅ Availability sent to backend");
//     } catch (e) {
//       console.error("❌ Availability response failed", e);
//     }
//   });
// }

import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

const API = process.env.EXPO_PUBLIC_API_URL!;

type AvailabilityData = {
  type: "AVAILABILITY";
  sessionId: string;
};

export function registerAvailabilityHandler() {
  return Notifications.addNotificationResponseReceivedListener(async (res) => {
    try {
      const action = res.actionIdentifier;
      const data = res.notification.request.content.data as AvailabilityData;

      if (data?.type !== "AVAILABILITY") return;

      if (action !== "YES" && action !== "NO") return;

      console.log("🔔 Availability:", action, data.sessionId);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      await fetch(`${API}/api/availability/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: data.sessionId,
          available: action === "YES",
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        }),
      });

      console.log("✅ Availability saved");
    } catch (err) {
      console.error("❌ Availability handler error", err);
    }
  });
}
