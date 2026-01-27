import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushToken() {
  if (!Device.isDevice) {
    console.log("❌ Must use physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("❌ Notification permission denied");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  console.log("🔥 EXPO PUSH TOKEN:", token);

  return token; // ExponentPushToken[xxxxxxxx]
}
