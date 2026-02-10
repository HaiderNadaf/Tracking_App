// app/(tabs)/onboarded-farmers.tsx

// import React, { useState, useEffect, useCallback } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   Image,
//   Alert,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useRouter } from "expo-router";
// import { apiFetch } from "../../services/api"; // ← your api helper with token

// const { width } = Dimensions.get("window");

// type Farmer = {
//   _id: string;
//   name: string;
//   phone: string;
//   village?: string;
//   taluk?: string;
//   district?: string;
//   state?: string;
//   landSize?: number;
//   photo?: string;
//   createdAt: string;
//   crops?: Array<{ name: string; price?: string }>;
//   // add more fields if you want to show them
// };

// export default function OnboardedFarmersScreen() {
//   const router = useRouter();

//   const [farmers, setFarmers] = useState<Farmer[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [hasMore, setHasMore] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const getCurrentUserId = async (): Promise<string | null> => {
//     try {
//       const userJson = await AsyncStorage.getItem("user");
//       if (!userJson) return null;
//       const user = JSON.parse(userJson);
//       return user?._id || user?.id || null;
//     } catch {
//       return null;
//     }
//   };

//   const fetchFarmers = useCallback(
//     async (pageNum: number, isRefresh = false) => {
//       if (loading && !isRefresh) return;
//       if (pageNum > totalPages && !isRefresh) return;

//       setLoading(true);
//       setError(null);

//       try {
//         const userId = await getCurrentUserId();
//         if (!userId) {
//           Alert.alert("Session Expired", "Please login again.", [
//             { text: "OK", onPress: () => router.replace("/(auth)/login") },
//           ]);
//           return;
//         }

//         const url = `/api/farmer/onboarded/${userId}?page=${pageNum}&limit=10`;

//         const response = await apiFetch(url, {
//           method: "GET",
//         });

//         if (!response.success) {
//           throw new Error(response.message || "Failed to load farmers");
//         }

//         const newFarmers = response.data || [];

//         setFarmers((prev) =>
//           isRefresh ? newFarmers : [...prev, ...newFarmers],
//         );

//         setTotalPages(response.pagination?.totalPages || 1);
//         setHasMore(pageNum < (response.pagination?.totalPages || 1));
//         setPage(pageNum);
//       } catch (err: any) {
//         console.error("Fetch onboarded farmers error:", err);
//         setError(err.message || "Something went wrong");
//       } finally {
//         setLoading(false);
//         setRefreshing(false);
//       }
//     },
//     [loading, totalPages, router],
//   );

//   // Initial load
//   useEffect(() => {
//     fetchFarmers(1, true);
//   }, []);

//   // Pull to refresh
//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setFarmers([]);
//     setPage(1);
//     setHasMore(true);
//     fetchFarmers(1, true);
//   }, [fetchFarmers]);

//   // Load more (infinite scroll)
//   const loadMore = () => {
//     if (!loading && hasMore) {
//       fetchFarmers(page + 1);
//     }
//   };

//   const renderFarmerCard = ({ item }: { item: Farmer }) => (
//     <TouchableOpacity
//       style={styles.card}
//       activeOpacity={0.8}
//       onPress={() => {
//         // Optional: navigate to detail screen
//         // router.push({ pathname: '/farmer-detail', params: { id: item._id } });
//         Alert.alert("Farmer", `${item.name}\n${item.phone}`);
//       }}
//     >
//       <View style={styles.cardContent}>
//         {item.photo ? (
//           <Image source={{ uri: item.photo }} style={styles.avatar} />
//         ) : (
//           <View style={[styles.avatar, styles.placeholderAvatar]}>
//             <Text style={styles.placeholderText}>
//               {item.name?.charAt(0)?.toUpperCase() || "?"}
//             </Text>
//           </View>
//         )}

//         <View style={styles.info}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.phone}>{item.phone}</Text>

//           {(item.village || item.taluk || item.district) && (
//             <Text style={styles.location} numberOfLines={1}>
//               {item.village ? `${item.village}, ` : ""}
//               {item.taluk ? `${item.taluk}, ` : ""}
//               {item.district || item.state || ""}
//             </Text>
//           )}

//           {item.landSize ? (
//             <Text style={styles.land}>
//               Land: {item.landSize} acre{item.landSize > 1 ? "s" : ""}
//             </Text>
//           ) : null}

//           {item.crops && item.crops.length > 0 && (
//             <Text style={styles.crops} numberOfLines={1}>
//               Crops: {item.crops.map((c) => c.name).join(", ")}
//             </Text>
//           )}

//           <Text style={styles.date}>
//             {new Date(item.createdAt).toLocaleDateString("en-IN", {
//               day: "numeric",
//               month: "short",
//               year: "numeric",
//             })}
//           </Text>
//         </View>
//       </View>
//     </TouchableOpacity>
//   );

//   const ListEmpty = () => (
//     <View style={styles.emptyContainer}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#3b82f6" />
//       ) : (
//         <>
//           <Text style={styles.emptyText}>No farmers onboarded yet</Text>
//           <Text style={styles.emptySubText}>
//             Farmers you onboard will appear here
//           </Text>
//         </>
//       )}
//     </View>
//   );

//   return (
//     <SafeAreaView style={styles.safeArea} edges={["top"]}>
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>My Onboarded Farmers</Text>
//       </View>

//       <FlatList
//         data={farmers}
//         renderItem={renderFarmerCard}
//         keyExtractor={(item) => item._id}
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         onEndReached={loadMore}
//         onEndReachedThreshold={0.4}
//         ListFooterComponent={
//           loading && !refreshing ? (
//             <View style={styles.footerLoader}>
//               <ActivityIndicator size="small" color="#3b82f6" />
//               <Text style={styles.loadingText}>Loading more...</Text>
//             </View>
//           ) : null
//         }
//         ListEmptyComponent={<ListEmpty />}
//         showsVerticalScrollIndicator={false}
//       />

//       {error && (
//         <View style={styles.errorBanner}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() => fetchFarmers(1, true)}
//           >
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#f8fafc",
//   },
//   header: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     backgroundColor: "#ffffff",
//     borderBottomWidth: 1,
//     borderBottomColor: "#e2e8f0",
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#1e293b",
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     marginBottom: 12,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatar: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     marginRight: 16,
//   },
//   placeholderAvatar: {
//     backgroundColor: "#e2e8f0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   placeholderText: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#64748b",
//   },
//   info: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: "#1e293b",
//     marginBottom: 4,
//   },
//   phone: {
//     fontSize: 15,
//     color: "#64748b",
//     marginBottom: 4,
//   },
//   location: {
//     fontSize: 14,
//     color: "#6b7280",
//     marginBottom: 4,
//   },
//   land: {
//     fontSize: 14,
//     color: "#059669",
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   crops: {
//     fontSize: 14,
//     color: "#4b5563",
//     marginBottom: 6,
//   },
//   date: {
//     fontSize: 13,
//     color: "#9ca3af",
//   },
//   footerLoader: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   loadingText: {
//     marginLeft: 12,
//     color: "#64748b",
//     fontSize: 14,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingVertical: 80,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#475569",
//     marginBottom: 8,
//   },
//   emptySubText: {
//     fontSize: 15,
//     color: "#94a3b8",
//     textAlign: "center",
//   },
//   errorBanner: {
//     position: "absolute",
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: "#fee2e2",
//     padding: 16,
//     borderRadius: 12,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   errorText: {
//     color: "#b91c1c",
//     flex: 1,
//   },
//   retryButton: {
//     backgroundColor: "#dc2626",
//     paddingVertical: 8,
//     paddingHorizontal: 16,
//     borderRadius: 8,
//   },
//   retryText: {
//     color: "white",
//     fontWeight: "600",
//   },
// });

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Modal,
  ScrollView,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { apiFetch } from "../../services/api";
import { Picker } from "@react-native-picker/picker";

const { width } = Dimensions.get("window");

type Crop = {
  name: string;
  price?: string;
  additionalInfo?: string;
};

type Farmer = {
  _id: string;
  name: string;
  phone: string;
  village?: string;
  taluk?: string;
  district?: string;
  state?: string;
  landSize?: number;
  photo?: string;
  createdAt: string;
  crops?: Crop[];
  additionalCrops?: string;
  inputSupplier?: string;
  additionalInfo?: string;
  payment?: { type: "cash" | "credit"; additionalInfo?: string };
  droneSprayingConsent?: { value: boolean; additionalInfo?: string };
  agronomistCareConsent?: { value: boolean; additionalInfo?: string };
};

export default function OnboardedFarmersScreen() {
  const router = useRouter();

  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [editForm, setEditForm] = useState<Partial<Farmer>>({});
  const [saving, setSaving] = useState(false);

  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const userJson = await AsyncStorage.getItem("user");
      if (!userJson) return null;
      const user = JSON.parse(userJson);
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  };

  // const fetchFarmers = useCallback(
  //   async (pageNum: number, isRefresh = false) => {
  //     if (loading && !isRefresh) return;
  //     if (pageNum > totalPages && !isRefresh) return;

  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const userId = await getCurrentUserId();
  //       if (!userId) {
  //         Alert.alert("Session Expired", "Please login again.", [
  //           { text: "OK", onPress: () => router.replace("/(auth)/login") },
  //         ]);
  //         return;
  //       }

  //       const url = `/api/farmer/onboarded/${userId}?page=${pageNum}&limit=3`;

  //       const response = await apiFetch(url, { method: "GET" });

  //       if (!response.success) {
  //         throw new Error(response.message || "Failed to load farmers");
  //       }

  //       const newFarmers = response.data || [];

  //       setFarmers((prev) =>
  //         isRefresh ? newFarmers : [...prev, ...newFarmers],
  //       );

  //       setTotalPages(response.pagination?.totalPages || 1);
  //       setHasMore(pageNum < (response.pagination?.totalPages || 1));
  //       setPage(pageNum);
  //     } catch (err: any) {
  //       console.error("Fetch onboarded farmers error:", err);
  //       setError(err.message || "Something went wrong");
  //     } finally {
  //       setLoading(false);
  //       setRefreshing(false);
  //     }
  //   },
  //   [loading, totalPages, router],
  // );

  const fetchFarmers = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (loading && !isRefresh) return;
      if (pageNum > totalPages && !isRefresh) return;

      setLoading(true);
      setError(null);

      try {
        const userId = await getCurrentUserId();
        if (!userId) {
          Alert.alert("Session Expired", "Please login again.", [
            { text: "OK", onPress: () => router.replace("/(auth)/login") },
          ]);
          return;
        }

        const url = `/api/farmer/onboarded/${userId}?page=${pageNum}&limit=5`;

        const response = await apiFetch(url, { method: "GET" });

        if (!response.success) {
          throw new Error(response.message || "Failed to load farmers");
        }

        const newFarmers = response.data || [];

        setFarmers((prev) =>
          isRefresh ? newFarmers : [...prev, ...newFarmers],
        );

        setTotalPages(response.pagination?.totalPages || 1);
        setHasMore(pageNum < (response.pagination?.totalPages || 1));
        setPage(pageNum);
      } catch (err: any) {
        console.error("Fetch onboarded farmers error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [totalPages, router], // ← FIXED: removed 'loading'
  );
  useEffect(() => {
    fetchFarmers(1, true);
  }, [fetchFarmers]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setFarmers([]);
    setPage(1);
    setHasMore(true);
    fetchFarmers(1, true);
  }, [fetchFarmers]);

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchFarmers(page + 1);
    }
  };

  // Open edit modal with pre-filled data
  const openEditModal = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setEditForm({
      name: farmer.name || "",
      phone: farmer.phone || "",
      crops: farmer.crops?.length
        ? [...farmer.crops]
        : [{ name: "", price: "", additionalInfo: "" }],
      additionalCrops: farmer.additionalCrops || "",
      state: farmer.state || "",
      district: farmer.district || "",
      taluk: farmer.taluk || "",
      village: farmer.village || "",
      landSize: farmer.landSize ? String(farmer.landSize) : "",
      inputSupplier: farmer.inputSupplier || "",
      additionalInfo: farmer.additionalInfo || "",
      payment: farmer.payment || { type: "cash" },
      droneSprayingConsent: farmer.droneSprayingConsent || {
        value: false,
        additionalInfo: "",
      },
      agronomistCareConsent: farmer.agronomistCareConsent || {
        value: false,
        additionalInfo: "",
      },
    });
    setEditModalVisible(true);
  };

  // Crop helpers for edit form
  const addCrop = () => {
    setEditForm((prev) => ({
      ...prev,
      crops: [
        ...(prev.crops || []),
        { name: "", price: "", additionalInfo: "" },
      ],
    }));
  };

  const removeCrop = (index: number) => {
    if ((editForm.crops?.length || 0) <= 1) {
      Alert.alert("Minimum one crop required");
      return;
    }
    setEditForm((prev) => ({
      ...prev,
      crops: prev.crops?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateCrop = (index: number, field: keyof Crop, value: string) => {
    setEditForm((prev) => {
      const newCrops = [...(prev.crops || [])];
      newCrops[index] = { ...newCrops[index], [field]: value };
      return { ...prev, crops: newCrops };
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedFarmer) return;
    setSaving(true);

    try {
      const payload: any = {
        name: editForm.name?.trim(),
        phone: editForm.phone?.trim().replace(/\D/g, ""),
        crops: editForm.crops
          ?.filter((c) => c.name.trim())
          .map((c) => ({
            name: c.name.trim(),
            price: c.price?.trim() || undefined,
            additionalInfo: c.additionalInfo?.trim() || undefined,
          })),
        additionalCrops: editForm.additionalCrops?.trim() || undefined,
        state: editForm.state?.trim() || undefined,
        district: editForm.district?.trim() || undefined,
        taluk: editForm.taluk?.trim() || undefined,
        village: editForm.village?.trim() || undefined,
        landSize: editForm.landSize ? Number(editForm.landSize) : undefined,
        inputSupplier: editForm.inputSupplier?.trim() || undefined,
        additionalInfo: editForm.additionalInfo?.trim() || undefined,
        payment: {
          type: editForm.payment?.type || "cash",
          additionalInfo: editForm.payment?.additionalInfo?.trim() || undefined,
        },
        droneSprayingConsent: {
          value: !!editForm.droneSprayingConsent?.value,
          additionalInfo:
            editForm.droneSprayingConsent?.additionalInfo?.trim() || undefined,
        },
        agronomistCareConsent: {
          value: !!editForm.agronomistCareConsent?.value,
          additionalInfo:
            editForm.agronomistCareConsent?.additionalInfo?.trim() || undefined,
        },
      };

      const res = await apiFetch(`/api/farmer/${selectedFarmer._id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (!res?.success) {
        throw new Error(res?.message || "Update failed");
      }

      Alert.alert("Success", "Farmer updated successfully!");
      setEditModalVisible(false);

      // Refresh list
      fetchFarmers(page, true);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update farmer");
    } finally {
      setSaving(false);
    }
  };

  const renderFarmerCard = ({ item }: { item: Farmer }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.cardContent}
        activeOpacity={0.8}
        onPress={() =>
          Alert.alert("Farmer Details", `${item.name}\n${item.phone}`)
        }
      >
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar]}>
            <Text style={styles.placeholderText}>
              {item.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>

          {(item.village || item.taluk || item.district) && (
            <Text style={styles.location} numberOfLines={1}>
              {item.village ? `${item.village}, ` : ""}
              {item.taluk ? `${item.taluk}, ` : ""}
              {item.district || item.state || ""}
            </Text>
          )}

          {item.landSize ? (
            <Text style={styles.land}>
              Land: {item.landSize} acre{item.landSize > 1 ? "s" : ""}
            </Text>
          ) : null}

          {item.crops && item.crops.length > 0 && (
            <Text style={styles.crops} numberOfLines={1}>
              Crops: {item.crops.map((c) => c.name).join(", ")}
            </Text>
          )}

          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => openEditModal(item)}
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" />
      ) : (
        <>
          <Text style={styles.emptyText}>No farmers onboarded yet</Text>
          <Text style={styles.emptySubText}>
            Farmers you onboard will appear here
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Onboarded Farmers</Text>
      </View>

      <FlatList
        data={farmers}
        renderItem={renderFarmerCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          loading && !refreshing ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={styles.loadingText}>Loading more...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={<ListEmpty />}
        showsVerticalScrollIndicator={false}
      />

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchFarmers(1, true)}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ================== EDIT MODAL ================== */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalKeyboardView}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Farmer</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll}>
                <TextInput
                  style={styles.input}
                  placeholder="Name *"
                  value={editForm.name}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, name: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Phone *"
                  value={editForm.phone}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, phone: text })
                  }
                  keyboardType="phone-pad"
                  maxLength={15}
                />

                {/* Crops */}
                <Text style={styles.sectionTitle}>Crops</Text>
                {editForm.crops?.map((crop, idx) => (
                  <View key={idx} style={styles.cropBlock}>
                    <View style={styles.cropHeader}>
                      <Text>Crop {idx + 1}</Text>
                      {editForm.crops!.length > 1 && (
                        <TouchableOpacity onPress={() => removeCrop(idx)}>
                          <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={crop.name}
                        onValueChange={(val) => updateCrop(idx, "name", val)}
                      >
                        <Picker.Item label="Select crop" value="" />
                        {[
                          "Banana",
                          "Turmeric",
                          "Tomato",
                          "Ginger",
                          "Chilli",
                          "Arecanut",
                          "Coconut",
                          "Other",
                        ].map((c) => (
                          <Picker.Item key={c} label={c} value={c} />
                        ))}
                      </Picker>
                    </View>

                    <TextInput
                      style={styles.input}
                      placeholder="Price (₹)"
                      value={crop.price}
                      onChangeText={(v) => updateCrop(idx, "price", v)}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Notes"
                      value={crop.additionalInfo}
                      onChangeText={(v) => updateCrop(idx, "additionalInfo", v)}
                    />
                  </View>
                ))}

                <TouchableOpacity style={styles.addButton} onPress={addCrop}>
                  <Text style={styles.addButtonText}>+ Add Crop</Text>
                </TouchableOpacity>

                {/* Other fields */}
                <Text style={styles.sectionTitle}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  value={editForm.state}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, state: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="District"
                  value={editForm.district}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, district: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Taluk"
                  value={editForm.taluk}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, taluk: text })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholder="Village"
                  value={editForm.village}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, village: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Land Size (acres)"
                  value={editForm.landSize ? String(editForm.landSize) : ""}
                  onChangeText={(text) =>
                    setEditForm({
                      ...editForm,
                      landSize: text ? Number(text) : undefined,
                    })
                  }
                  keyboardType="numeric"
                />

                <TextInput
                  style={styles.input}
                  placeholder="Input Supplier"
                  value={editForm.inputSupplier}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, inputSupplier: text })
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Additional Info"
                  value={editForm.additionalInfo}
                  onChangeText={(text) =>
                    setEditForm({ ...editForm, additionalInfo: text })
                  }
                  multiline
                  numberOfLines={3}
                />

                {/* Payment */}
                <Text style={styles.sectionTitle}>Payment</Text>
                <View style={styles.row}>
                  <Text>Type:</Text>
                  <Picker
                    selectedValue={editForm.payment?.type || "cash"}
                    onValueChange={(v) =>
                      setEditForm({
                        ...editForm,
                        payment: {
                          ...editForm.payment,
                          type: v as "cash" | "credit",
                        },
                      })
                    }
                    style={{ flex: 1 }}
                  >
                    <Picker.Item label="Cash" value="cash" />
                    <Picker.Item label="Credit" value="credit" />
                  </Picker>
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Payment Notes"
                  value={editForm.payment?.additionalInfo || ""}
                  onChangeText={(text) =>
                    setEditForm({
                      ...editForm,
                      payment: { ...editForm.payment, additionalInfo: text },
                    })
                  }
                />

                {/* Consents */}
                <View style={styles.consentRow}>
                  <Text>Drone Spraying Consent</Text>
                  <Switch
                    value={editForm.droneSprayingConsent?.value || false}
                    onValueChange={(val) =>
                      setEditForm({
                        ...editForm,
                        droneSprayingConsent: {
                          ...editForm.droneSprayingConsent,
                          value: val,
                        },
                      })
                    }
                  />
                </View>
                {editForm.droneSprayingConsent?.value && (
                  <TextInput
                    style={styles.input}
                    placeholder="Drone Notes"
                    value={editForm.droneSprayingConsent?.additionalInfo || ""}
                    onChangeText={(text) =>
                      setEditForm({
                        ...editForm,
                        droneSprayingConsent: {
                          ...editForm.droneSprayingConsent,
                          additionalInfo: text,
                        },
                      })
                    }
                  />
                )}

                <View style={styles.consentRow}>
                  <Text>Agronomist Care Consent</Text>
                  <Switch
                    value={editForm.agronomistCareConsent?.value || false}
                    onValueChange={(val) =>
                      setEditForm({
                        ...editForm,
                        agronomistCareConsent: {
                          ...editForm.agronomistCareConsent,
                          value: val,
                        },
                      })
                    }
                  />
                </View>
                {editForm.agronomistCareConsent?.value && (
                  <TextInput
                    style={styles.input}
                    placeholder="Agronomist Notes"
                    value={editForm.agronomistCareConsent?.additionalInfo || ""}
                    onChangeText={(text) =>
                      setEditForm({
                        ...editForm,
                        agronomistCareConsent: {
                          ...editForm.agronomistCareConsent,
                          additionalInfo: text,
                        },
                      })
                    }
                  />
                )}

                <TouchableOpacity
                  style={[styles.saveButton, saving && styles.disabled]}
                  onPress={handleSaveEdit}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#1e293b" },
  listContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardContent: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  placeholderAvatar: {
    backgroundColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { fontSize: 24, fontWeight: "600", color: "#64748b" },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: "600", color: "#1e293b", marginBottom: 4 },
  phone: { fontSize: 15, color: "#64748b", marginBottom: 4 },
  location: { fontSize: 14, color: "#6b7280", marginBottom: 4 },
  land: { fontSize: 14, color: "#059669", fontWeight: "500", marginBottom: 4 },
  crops: { fontSize: 14, color: "#4b5563", marginBottom: 6 },
  date: { fontSize: 13, color: "#9ca3af" },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#3b82f6",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  editButtonText: { color: "white", fontSize: 14, fontWeight: "600" },
  footerLoader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: { marginLeft: 12, color: "#64748b", fontSize: 14 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  emptySubText: { fontSize: 15, color: "#94a3b8", textAlign: "center" },
  errorBanner: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#fee2e2",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errorText: { color: "#b91c1c", flex: 1 },
  retryButton: {
    backgroundColor: "#dc2626",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryText: { color: "white", fontWeight: "600" },

  // Modal Styles
  modalKeyboardView: { flex: 1 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    width: "90%",
    maxHeight: "85%",
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#1e293b" },
  closeButton: { fontSize: 24, color: "#64748b" },
  modalScroll: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  cropBlock: {
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  removeText: { color: "#ef4444", fontWeight: "500" },
  addButton: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 12,
  },
  addButtonText: { color: "white", fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  consentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
  },
  saveButton: {
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
  },
  disabled: { backgroundColor: "#6ee7b7" },
  buttonText: { color: "white", fontWeight: "600", fontSize: 16 },
});
