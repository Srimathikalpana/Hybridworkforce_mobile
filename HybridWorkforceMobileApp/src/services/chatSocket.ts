import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/env';

let socket: Socket | null = null;

export function getChatSocket() {
  return socket;
}

export function connectChatSocket(token: string) {
  if (socket && socket.connected) return socket;

  if (!SOCKET_URL) {
    throw new Error('EXPO_PUBLIC_API_URL is required for Socket.IO connection.');
  }

  socket = io(SOCKET_URL, {
    transports: ['websocket'],
    auth: { token },
  });

  return socket;
}

export function disconnectChatSocket() {
  if (!socket) return;
  socket.disconnect();
  socket = null;
}

