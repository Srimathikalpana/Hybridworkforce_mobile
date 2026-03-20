import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Conversation, getConversations } from '../services/chatService';

export default function ChatListScreen() {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Conversation[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const conversations = await getConversations();
      setItems(conversations);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it._id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => {
            const title =
              item.name ||
              (item.type === 'direct'
                ? item.participants.map((p) => p.name).join(', ')
                : item.type);
            return (
              <Pressable
                onPress={() => navigation.navigate('ChatRoom', { conversationId: item._id, title })}
                style={styles.row}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.rowTitle} numberOfLines={1}>
                    {title}
                  </Text>
                  <Text style={styles.rowMeta}>
                    {item.unreadCount ? `${item.unreadCount} unread` : ' '}
                  </Text>
                </View>
                <Text style={styles.chev}>›</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.subtitle}>No conversations yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  subtitle: { marginTop: 8, color: '#64748b' },
  error: { marginTop: 10, color: '#b91c1c' },
  center: { flex: 1, justifyContent: 'center' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  rowTitle: { fontSize: 16, fontWeight: '600', color: '#0f172a' },
  rowMeta: { marginTop: 2, color: '#64748b', fontSize: 12 },
  chev: { color: '#94a3b8', fontSize: 24, paddingLeft: 8 },
});

