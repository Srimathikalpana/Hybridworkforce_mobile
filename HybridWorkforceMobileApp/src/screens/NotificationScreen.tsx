import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Broadcast, getBroadcasts } from '../services/notificationService';
import { getReadBroadcastIds, markBroadcastRead } from '../utils/notificationReadState';

export default function NotificationScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Broadcast[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [broadcasts, reads] = await Promise.all([getBroadcasts(), getReadBroadcastIds()]);
      setItems(broadcasts);
      setReadIds(reads);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load broadcasts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
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
            const isRead = readIds.has(item._id);
            const when = item.createdAt ? new Date(item.createdAt).toLocaleString() : '';
            return (
              <Pressable
                onPress={async () => {
                  const next = await markBroadcastRead(item._id);
                  setReadIds(new Set(next));
                }}
                style={[styles.card, !isRead && styles.cardUnread]}
              >
                <Text style={styles.cardMeta}>
                  {item.senderId?.name ? `${item.senderId.name} • ` : ''}
                  {when}
                </Text>
                <Text style={styles.cardMessage}>{item.message}</Text>
                <Text style={styles.cardStatus}>{isRead ? 'Read' : 'Tap to mark read'}</Text>
              </Pressable>
            );
          }}
          ListEmptyComponent={<Text style={styles.subtitle}>No broadcasts.</Text>}
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
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
  },
  cardUnread: {
    borderColor: '#60a5fa',
    backgroundColor: '#eff6ff',
  },
  cardMeta: { fontSize: 12, color: '#64748b' },
  cardMessage: { marginTop: 8, fontSize: 15, color: '#0f172a' },
  cardStatus: { marginTop: 10, fontSize: 12, color: '#475569' },
});

