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
import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import "../services/backgroundTracking";

export default function RootLayout() {
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((res) => {
      const data = res.notification.request.content.data;

      if (data?.type === "AVAILABILITY") {
        // 🔥 Navigate user to Home (or Availability screen)
        router.replace("/(tabs)");
      }
    });

    // Handle killed-state
    Notifications.getLastNotificationResponseAsync().then((res) => {
      if (res?.notification?.request?.content?.data?.type === "AVAILABILITY") {
        router.replace("/(tabs)");
      }
    });

    return () => sub.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="register" />
      <Stack.Screen name="login" />
      <Stack.Screen name="role/[type]" />
    </Stack>
  );
}
