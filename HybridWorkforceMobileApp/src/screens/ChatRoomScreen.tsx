import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ChatMessage, getMessages } from '../services/chatService';
import { connectChatSocket, disconnectChatSocket } from '../services/chatSocket';
import { getToken } from '../utils/authStorage';
import { useAuth } from '../context/AuthContext';

export default function ChatRoomScreen() {
  const route = useRoute<any>();
  const conversationId = route.params?.conversationId;
  const { user } = useAuth();

  const listRef = useRef<FlatList<ChatMessage> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');

  const load = useCallback(async () => {
    if (!conversationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMessages(conversationId);
      setMessages(data);
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }));
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const token = await getToken();
      if (!token || !mounted || !conversationId) return;

      const socket = connectChatSocket(token);

      const onReceive = (payload: any) => {
        if (payload?.conversationId !== conversationId) return;
        const msg: ChatMessage | undefined = payload?.message;
        if (!msg) return;
        setMessages((prev) => [...prev, msg]);
        requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
      };

      socket.on('receive_message', onReceive);

      return () => {
        socket.off('receive_message', onReceive);
      };
    })();

    return () => {
      mounted = false;
      // keep socket alive for the whole app later; for now keep simple.
      disconnectChatSocket();
    };
  }, [conversationId]);

  const onSend = useCallback(async () => {
    const content = text.trim();
    if (!content || !conversationId) return;
    setText('');
    setError(null);

    const token = await getToken();
    if (!token) {
      setError('Not authenticated');
      return;
    }

    const socket = connectChatSocket(token);
    socket.emit('send_message', { conversationId, content });
  }, [conversationId, text]);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isMine = item.senderId?._id === user?.id;
      return (
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
          <Text style={styles.sender}>{isMine ? 'You' : item.senderId?.name || 'User'}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.time}>
            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : ''}
          </Text>
        </View>
      );
    },
    [user?.id]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && messages.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          ref={(r) => {
            listRef.current = r;
          }}
          data={messages}
          keyExtractor={(m) => m._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12 }}
        />
      )}

      <View style={styles.composer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message…"
          style={styles.input}
          multiline
        />
        <Pressable onPress={onSend} style={styles.send} disabled={!text.trim()}>
          <Text style={styles.sendText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#b91c1c', padding: 12 },
  bubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: '#dbeafe' },
  bubbleTheirs: { alignSelf: 'flex-start', backgroundColor: '#f1f5f9' },
  sender: { fontSize: 12, color: '#475569', marginBottom: 4 },
  content: { fontSize: 15, color: '#0f172a' },
  time: { marginTop: 6, fontSize: 11, color: '#64748b', alignSelf: 'flex-end' },
  composer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'flex-end',
    gap: 10,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  send: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#2563eb',
  },
  sendText: { color: '#fff', fontWeight: '700' },
});

