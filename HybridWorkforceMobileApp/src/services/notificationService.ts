import api from './api';

export interface Broadcast {
  _id: string;
  message: string;
  audience: string;
  teamId: string;
  senderId?: { _id: string; name: string; email?: string; role?: string };
  createdAt: string;
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  const { data } = await api.get<{ broadcasts: Broadcast[] }>('/broadcast');
  return data.broadcasts;
}

