import api from './api';

export interface Conversation {
  _id: string;
  type: string;
  name?: string;
  participants: Array<{ _id: string; name: string; email: string; role: string }>;
  updatedAt: string;
  unreadCount?: number;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: { _id: string; name: string; email: string; role: string };
  content: string;
  createdAt: string;
  editedAt?: string;
}

export async function getConversations(): Promise<Conversation[]> {
  const { data } = await api.get<{ conversations: Conversation[] }>('/chat/conversations');
  return data.conversations;
}

export async function getMessages(conversationId: string, params?: { limit?: number; before?: string }) {
  const { data } = await api.get<{ messages: ChatMessage[] }>('/chat/messages/' + conversationId, {
    params,
  });
  return data.messages;
}

export async function sendMessage(conversationId: string, content: string) {
  const { data } = await api.post<{ message: ChatMessage }>('/chat/message', { conversationId, content });
  return data.message;
}

