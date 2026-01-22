// import { Tabs, router } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { View, ActivityIndicator } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { apiFetch } from "../../services/api";

// export default function TabLayout() {
//   const [checking, setChecking] = useState(true);

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       console.log("🔐 Tabs auth check...");

//       const userStr = await AsyncStorage.getItem("user");
//       console.log("👤 Local user:", userStr);

//       if (!userStr) {
//         console.log("🚫 No user in storage → register");
//         router.replace("/(auth)/register");
//         return;
//       }

//       const user = JSON.parse(userStr);

//       console.log("🌐 Verifying with backend:", user._id);

//       // ✅ BACKEND VERIFY
//       const verify = await apiFetch(`/users/verify/${user._id}`);

//       console.log("✅ Verify response:", verify);

//       if (!verify.valid) {
//         console.log("❌ User deleted from DB → logout");

//         await AsyncStorage.removeItem("user");
//         router.replace("/(auth)/register");
//         return;
//       }

//       console.log("✅ User verified — allow tabs");
//     } catch (e) {
//       console.error("❌ Auth verify failed:", e);
//       await AsyncStorage.removeItem("user");
//       router.replace("/(auth)/register");
//     } finally {
//       setChecking(false);
//     }
//   };

//   if (checking) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     // <Tabs screenOptions={{ headerShown: false }}>
//     <Tabs
//       screenOptions={{
//         headerShown: false, // ← This hides the header for ALL tab screens
//         tabBarActiveTintColor: "#4d7c0f", // optional: match your green theme
//         tabBarInactiveTintColor: "#64748b",
//         tabBarStyle: {
//           backgroundColor: "#ffffff",
//           borderTopColor: "#e2e8f0",
//           borderTopWidth: 1,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "Home",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="home" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="pending"
//         options={{
//           title: "Pending",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="clipboard-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* ✅ PROFILE TAB */}
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: "Profile",
//           tabBarIcon: ({ color, size }) => (
//             <Ionicons name="person" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "../../services/api";

export default function TabLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) throw new Error("No token");

      await apiFetch("/api/users/me"); // protected route
    } catch (e) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
      router.replace("/(auth)/login");
    } finally {
      setChecking(false);
    }
  };

  if (checking) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pending"
        options={{
          title: "Pending",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
