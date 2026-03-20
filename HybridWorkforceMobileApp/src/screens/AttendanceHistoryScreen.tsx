import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { AttendanceSession, getAttendanceHistory } from '../services/attendanceService';

export default function AttendanceHistoryScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<AttendanceSession[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendanceHistory({ limit: 30 });
      setItems(data.history);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance History</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading && items.length === 0 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
          contentContainerStyle={{ paddingVertical: 12 }}
          renderItem={({ item }) => {
            const date = new Date(item.date).toLocaleDateString();
            const inTime = item.checkInTime ? new Date(item.checkInTime).toLocaleTimeString() : '—';
            const outTime = item.checkOutTime ? new Date(item.checkOutTime).toLocaleTimeString() : '—';
            return (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{date}</Text>
                <Text style={styles.cardRow}>Check-in: {inTime}</Text>
                <Text style={styles.cardRow}>Check-out: {outTime}</Text>
                <Text style={styles.cardMeta}>
                  Status: {item.status} {item.totalHours ? `• Hours: ${item.totalHours}` : ''}
                </Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={{ paddingVertical: 24 }}>
              <Text style={styles.subtitle}>No attendance records found.</Text>
            </View>
          }
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
  loading: { flex: 1, justifyContent: 'center' },
  card: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  cardRow: { marginTop: 6, color: '#334155' },
  cardMeta: { marginTop: 8, color: '#64748b' },
});

