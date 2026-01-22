// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";

// export default function RolePage() {
//   const { type } = useLocalSearchParams<{ type: string }>();

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Role: {type}</Text>

//       {/* ✅ ONBOARD */}
//       <TouchableOpacity
//         style={styles.btn}
//         onPress={() => router.push("/meet/onbaord-aggregator")}
//       >
//         <Text style={styles.btnText}>Onboard Aggregator</Text>
//       </TouchableOpacity>

//       {/* ✅ MEET */}
//       <TouchableOpacity
//         style={[styles.btn, { backgroundColor: "#2563eb" }]}
//         onPress={() => router.push("/meet/start")}
//       >
//         <Text style={styles.btnText}>Meet Aggregator</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "#f8fafc",
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 18,
//     fontWeight: "600",
//     marginBottom: 30,
//   },
//   btn: {
//     backgroundColor: "#22c55e",
//     padding: 18,
//     borderRadius: 14,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   btnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//   },
// });

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

export default function RolePage() {
  const { type } = useLocalSearchParams<{ type: string }>();

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    setCurrentDate(date.toLocaleDateString("en-IN", options));
  }, []);

  const roleDisplayName =
    type === "field"
      ? "Field Guy"
      : type === "agronomist"
      ? "Agronomist"
      : type?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) ||
        "Role";

  const isFieldGuy = type === "field";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header – consistent with your main home */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <View style={styles.avatar}>
                <Image
                  source={require("../../assets/images/field_avatar.png")} // ← adjust path
                  style={styles.avatarImage}
                />
              </View>
              <View>
                <Text style={styles.greeting}>{roleDisplayName}</Text>
                <Text style={styles.date}>{currentDate}</Text>
              </View>
            </View>

            <View style={styles.brandChip}>
              <Image
                source={require("../../assets/images/oneroot_backside2.png")}
                style={styles.BrandImg}
              />
            </View>
          </View>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>What would you like to do?</Text>

          {/* Onboard Aggregator Card */}
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/meet/onbaord-aggregator")}
            activeOpacity={0.78}
          >
            <View style={[styles.iconCircle, { backgroundColor: "#4d7c0f15" }]}>
              <Ionicons name="people-outline" size={28} color="#4d7c0f" />
            </View>

            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Onboard Aggregator</Text>
              <Text style={styles.cardSubtitle}>
                Register new aggregators and add them to the network
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>

          {/* Meet Aggregator Card */}
          <TouchableOpacity
            style={[
              styles.actionCard,
              isFieldGuy ? {} : { borderColor: "#2563eb", borderWidth: 1.5 },
            ]}
            onPress={() => router.push("/meet/start")}
            activeOpacity={0.78}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isFieldGuy ? "#2563eb15" : "#2563eb25",
                },
              ]}
            >
              <Ionicons
                name="videocam-outline"
                size={28}
                color={isFieldGuy ? "#2563eb" : "#1e40af"}
              />
            </View>

            <View style={styles.cardTextContainer}>
              <Text
                style={[styles.cardTitle, !isFieldGuy && { color: "#1e40af" }]}
              >
                Meet Aggregator
              </Text>
              <Text style={styles.cardSubtitle}>
                Start video call or schedule meeting with aggregator
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={24} color="#64748b" />
          </TouchableOpacity>

          {/* Optional: future actions can be added here as more cards */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f0fdf4",
  },
  scrollContainer: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#bbf7d0",
  },
  avatarImage: {
    width: "108%",
    height: "108%",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#166534",
  },
  date: {
    color: "#64748b",
    fontSize: 14,
  },
  brandChip: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
  },
  BrandImg: {
    width: 80,
    height: 30,
    resizeMode: "contain",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 20,
  },

  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#64748b",
    lineHeight: 20,
  },
});
