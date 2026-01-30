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

// import AsyncStorage from "@react-native-async-storage/async-storage";

// const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// export const apiFetch = async (url: string, options: RequestInit = {}) => {
//   const accessToken = await AsyncStorage.getItem("accessToken");

//   const headers: any = {
//     "Content-Type": "application/json",
//     ...(options.headers || {}),
//   };

//   if (accessToken) {
//     headers.Authorization = `Bearer ${accessToken}`;
//   }

//   const res = await fetch(`${BASE_URL}${url}`, {
//     ...options,
//     headers,
//   });

//   const data = await res.json();

//   if (!res.ok) {
//     throw new Error(data.message || "API Error");
//   }

//   return data;
// };

import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const apiFetch = async (
  url: string,
  options: RequestInit = {},
  retry = true,
): Promise<any> => {
  const accessToken = await AsyncStorage.getItem("accessToken");
  const isAuthRoute = url.includes("/api/auth");

  const makeRequest = async (token?: string | null) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    return fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });
  };

  let res = await makeRequest(accessToken);

  /* 🔁 Refresh only once, never for auth routes */
  if (res.status === 401 && retry && !isAuthRoute) {
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    if (!refreshToken) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
      throw new Error("Session expired. Please login again.");
    }

    const refreshRes = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken", "user"]);
      throw new Error("Session expired. Please login again.");
    }

    const refreshData = await refreshRes.json();
    const newAccessToken = refreshData?.accessToken;

    if (!newAccessToken) {
      throw new Error("Invalid refresh response");
    }

    await AsyncStorage.setItem("accessToken", newAccessToken);

    return apiFetch(url, options, false);
  }

  /* 🛡 Safe response parsing */
  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {}

  if (!res.ok) {
    throw new Error(data?.message || "API request failed");
  }

  return data;
};
