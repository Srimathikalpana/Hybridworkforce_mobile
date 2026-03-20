import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import DashboardCard from '../components/common/DashboardCard';
import { getDashboard } from '../services/dashboardService';
import { useNavigation } from '@react-navigation/native';

export default function DashboardScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboard(user.role);
      setDashboard(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = dashboard?.stats;
  const loginTime = stats?.loginTime ? new Date(stats.loginTime).toLocaleTimeString() : '—';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>{user ? `${user.name} • ${user.role}` : ''}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.grid}>
        <DashboardCard
          title="Today"
          description={`Login: ${loginTime} • Mode: ${stats?.workMode || '—'}`}
          onPress={() => navigation.navigate('AttendanceHistory')}
        />

        <DashboardCard
          title="Attendance"
          description="Check-in, check-out, and history"
          onPress={() => navigation.navigate('AttendanceHistory')}
        />

        <DashboardCard
          title="Leave"
          description="Apply leave and track status"
          onPress={() => navigation.navigate('Main', { screen: 'Leave' })}
        />

        <DashboardCard
          title="WFH"
          description="Apply WFH and track status"
          onPress={() => navigation.navigate('Main', { screen: 'WFH' })}
        />

        <DashboardCard
          title="Chat"
          description="Open conversations"
          onPress={() => navigation.navigate('Main', { screen: 'Chat' })}
        />

        <DashboardCard
          title="Notifications"
          description="Broadcast messages"
          onPress={() => navigation.navigate('Main', { screen: 'Notifications' })}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f7fb' },
  content: { padding: 16, paddingBottom: 32 },
  header: { marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  subtitle: { marginTop: 4, fontSize: 14, color: '#64748b' },
  error: { marginTop: 8, color: '#b91c1c' },
  grid: { gap: 12 },
});

