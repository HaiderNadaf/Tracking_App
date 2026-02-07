// // import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// // import { Stack } from 'expo-router';
// // import { StatusBar } from 'expo-status-bar';
// // import 'react-native-reanimated';

// // import { useColorScheme } from '@/hooks/use-color-scheme';

// // export const unstable_settings = {
// //   anchor: '(tabs)',
// // };

// // export default function RootLayout() {
// //   const colorScheme = useColorScheme();

// //   return (
// //     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
// //       <Stack>
// //         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
// //         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
// //       </Stack>
// //       <StatusBar style="auto" />
// //     </ThemeProvider>
// //   );
// // }
// // import "../tasks/background-location"; // ✅ this actually runs the file
// import { Stack } from "expo-router";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";
// import { router } from "expo-router";
// import "../services/backgroundTracking";

// export default function RootLayout() {
//   useEffect(() => {
//     const sub = Notifications.addNotificationResponseReceivedListener((res) => {
//       const data = res.notification.request.content.data;

//       if (data?.type === "AVAILABILITY") {
//         // 🔥 Navigate user to Home (or Availability screen)
//         router.replace("/(tabs)");
//       }
//     });

//     // Handle killed-state
//     Notifications.getLastNotificationResponseAsync().then((res) => {
//       if (res?.notification?.request?.content?.data?.type === "AVAILABILITY") {
//         router.replace("/(tabs)");
//       }
//     });

//     return () => sub.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="role/[type]" />
//     </Stack>
//   );
// }

// import "../services/backgroundTracking";

// import { Stack, router } from "expo-router";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function RootLayout() {
//   useEffect(() => {
//     const handleResponse = async (
//       res: Notifications.NotificationResponse,
//     ) => {
//       const data = res.notification.request.content.data;
//       if (!data?.type) return;

//       console.log("🔔 Notification tapped:", data.type);

//       // ✅ GET ROLE FROM LOGIN STORAGE
//       const role = await AsyncStorage.getItem("userRole");

//       switch (data.type) {
//         case "AVAILABILITY":
//           router.replace("/(tabs)");
//           break;

//         case "TASK_ASSIGNED":
//           if (role) {
//             router.push(`/role/${role}`);
//           } else {
//             console.log("⚠️ Role missing, redirecting home");
//             router.replace("/(tabs)");
//           }
//           break;

//         default:
//           break;
//       }
//     };

//     // foreground / background
//     const sub =
//       Notifications.addNotificationResponseReceivedListener(handleResponse);

//     // killed-state
//     Notifications.getLastNotificationResponseAsync().then((res) => {
//       if (res) handleResponse(res);
//     });

//     return () => sub.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="tasks" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="role/[type]" />
//     </Stack>
//   );
// }

// import { Stack, router } from "expo-router";
// import { useEffect } from "react";
// import * as Notifications from "expo-notifications";

// export default function RootLayout() {
//   useEffect(() => {
//     const handleResponse = (res: Notifications.NotificationResponse) => {
//       const data = res.notification.request.content.data;

//       if (!data?.type) return;

//       console.log("🔔 Notification tapped:", data.type);

//       switch (data.type) {
//         case "AVAILABILITY":
//           router.replace("/(tabs)");
//           break;

//         case "TASK_ASSIGNED":
//           router.push(`/role/${data.role}`); // or `/tasks/${data.taskId}`
//           break;

//         default:
//           break;
//       }
//     };

//     // foreground / background
//     const sub =
//       Notifications.addNotificationResponseReceivedListener(handleResponse);

//     // killed-state
//     Notifications.getLastNotificationResponseAsync().then((res) => {
//       if (res) handleResponse(res);
//     });

//     return () => sub.remove();
//   }, []);

//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="tasks" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="role/[type]" />
//     </Stack>
//   );
// }

import { Stack, router } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";

export default function RootLayout() {
  useEffect(() => {
    // 🔄 OTA UPDATE CHECK
    const checkForOTAUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync(); // reload to apply update
        }
      } catch (err) {
        console.log("OTA update check failed:", err);
      }
    };

    checkForOTAUpdate();

    // 🔔 NOTIFICATION HANDLER
    const handleResponse = (res: Notifications.NotificationResponse) => {
      const data = res.notification.request.content.data;

      if (!data?.type) return;

      console.log("🔔 Notification tapped:", data.type);

      switch (data.type) {
        case "AVAILABILITY":
          router.replace("/(tabs)");
          break;

        case "TASK_ASSIGNED":
          router.push(`/role/${data.role}`);
          break;

        default:
          break;
      }
    };

    // Foreground / background
    const sub =
      Notifications.addNotificationResponseReceivedListener(handleResponse);

    // Killed-state
    Notifications.getLastNotificationResponseAsync().then((res) => {
      if (res) handleResponse(res);
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="tasks" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="role/[type]" />
    </Stack>
  );
}
