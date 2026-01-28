// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//   );
// }
// import "../tasks/background-location"; // ✅ this actually runs the file

// import { Stack } from "expo-router";
// import "../services/backgroundTracking";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="(tabs)" />
//       <Stack.Screen name="register" />
//       <Stack.Screen name="login" />
//       <Stack.Screen name="role/[type]" />
//     </Stack>
//   );
// }
import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import { registerAvailabilityHandler } from "../services/notificationHandler";

export default function RootLayout() {
  useEffect(() => {
    Notifications.setNotificationCategoryAsync("AVAILABILITY_ACTION", [
      {
        identifier: "YES",
        buttonTitle: "✅ Available",
        options: { opensAppToForeground: true },
      },
      {
        identifier: "NO",
        buttonTitle: "❌ Not Available",
        options: { opensAppToForeground: true },
      },
    ]);

    const sub = registerAvailabilityHandler();

    return () => sub.remove();
  }, []);

  return <Slot />;
}
