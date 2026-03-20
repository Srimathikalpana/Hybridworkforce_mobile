import { Platform } from "react-native";

/**
 * API Configuration
 *
 * This file handles API URL detection for different environments:
 * - Android Emulator: http://10.0.2.2:5000 (special alias to localhost)
 * - iOS Simulator: http://localhost:5000
 * - Real Device: http://<LOCAL_IP>:5000 (must be configured)
 * - Web/Production: deployed backend URL
 */

// ============================================================================
// IMPORTANT: Configure these variables based on your setup
// ============================================================================

/**
 * Configuration values
 *
 * BACKEND_PORT: The port your Express backend is running on (default: 5000)
 * LOCAL_IP: Your laptop's local IP address (e.g., 192.168.1.100)
 *           Get it by running: ipconfig (Windows) or ifconfig (Mac/Linux)
 *           Look for "IPv4 Address" on your network adapter
 * DEPLOYED_BACKEND_URL: Your production backend URL (e.g., https://api.yourdomain.com)
 */

const BACKEND_PORT = 5000;
const LOCAL_IP = "192.168.1.25"; // CHANGE THIS to your laptop's IP address
const DEPLOYED_BACKEND_URL = process.env.EXPO_PUBLIC_DEPLOYED_API_URL || "";

// ============================================================================
// Auto-detection logic (do not modify unless needed)
// ============================================================================

/**
 * Determine the correct API base URL based on the platform and environment
 */
import Constants from "expo-constants";

export const getBaseURL = (): string => {
  // 🔥 ALWAYS use LOCAL IP for real device
  return `http://${LOCAL_IP}:${BACKEND_PORT}/api`;
};

/**
 * Get the Socket.IO URL (for real-time features)
 * This connects to the backend root (without /api)
 */
export const getSocketURL = (): string => {
  const baseURL = getBaseURL();
  return baseURL.replace(/\/api\/?$/, "");
};

/**
 * API Configuration object
 */
export const API_CONFIG = {
  BASE_URL: getBaseURL(),
  SOCKET_URL: getSocketURL(),
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ============================================================================
// For Debugging: Log the current API configuration
// ============================================================================

if (__DEV__) {
  console.log("📱 API Configuration:");
  console.log(`   Platform: ${Platform.OS}`);
  console.log(`   Backend Port: ${BACKEND_PORT}`);
  console.log(`   Local IP: ${LOCAL_IP}`);
  console.log(`   API URL: ${API_CONFIG.BASE_URL}`);
  console.log(`   Socket URL: ${API_CONFIG.SOCKET_URL}`);
}

export default API_CONFIG;
