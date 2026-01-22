// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// if (!API_URL) {
//   throw new Error("EXPO_PUBLIC_API_URL is not defined");
// }

// export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
//   try {
//     const res = await fetch(`${API_URL}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...(options.headers || {}),
//       },
//       ...options,
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       throw err;
//     }

//     return res.json();
//   } catch (e) {
//     throw e;
//   }
// };

import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  const accessToken = await AsyncStorage.getItem("accessToken");

  const headers: any = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API Error");
  }

  return data;
};
