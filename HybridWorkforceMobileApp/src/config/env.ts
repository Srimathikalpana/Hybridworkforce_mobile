import API_CONFIG from "./api";

/**
 * API URL - Auto-detected based on platform and environment
 *
 * The getBaseURL() function in src/config/api.ts handles:
 * - Android Emulator: 10.0.2.2 (special alias to localhost)
 * - iOS Simulator: localhost
 * - Real Device: your local IP or deployed URL
 */
export const API_URL = API_CONFIG.BASE_URL;

/** Socket.IO URL for real-time features */
export const SOCKET_URL = API_CONFIG.SOCKET_URL;

/** API timeout in milliseconds */
export const API_TIMEOUT = API_CONFIG.TIMEOUT;

/** Retry configuration */
export const API_RETRY_ATTEMPTS = API_CONFIG.RETRY_ATTEMPTS;
export const API_RETRY_DELAY = API_CONFIG.RETRY_DELAY;
