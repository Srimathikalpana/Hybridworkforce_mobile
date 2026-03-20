export const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Socket.IO connects to the backend server root (no `/api` prefix).
export const SOCKET_URL = API_URL
  ? API_URL.replace(/\/api\/?$/, '')
  : undefined;

