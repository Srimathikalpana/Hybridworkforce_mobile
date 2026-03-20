import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError, AxiosInstance } from "axios";
import { API_TIMEOUT, API_URL } from "../config/env";

/**
 * Axios instance for API calls
 *
 * Features:
 * - Auto-configured BASE_URL based on platform
 * - Request timeout
 * - JWT token attachment via interceptor
 * - Error logging for debugging
 */

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Automatically attaches JWT token to all requests
 */
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("❌ Error retrieving token from AsyncStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("❌ Request config error:", error);
    return Promise.reject(error);
  },
);

/**
 * Response Interceptor
 * Handles errors and logs them for debugging
 */
api.interceptors.response.use(
  (response) => {
    // Success response - no modification needed
    return response;
  },
  (error: AxiosError) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status (4xx, 5xx)
      console.error(
        `❌ API Error (${error.response.status}):`,
        error.response.data,
      );
    } else if (error.request) {
      // Request made but no response received
      console.error("❌ No response from server:", error.request);
      console.error("⚠️  Make sure:");
      console.error("   1. Backend is running on http://<IP>:5000");
      console.error("   2. LOCAL_IP in src/config/api.ts is correctly set");
      console.error("   3. Device and backend are on the same network");
    } else {
      // Error in request setup
      console.error("❌ Request error:", error.message);
    }
    return Promise.reject(error);
  },
);

export default api;
