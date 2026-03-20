import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLeave } from '../hooks/useLeave';
import { LeaveRequest } from '../types/leave';

export default function WFHScreen() {
  const { leaves, loading, error, submitLeave, fetchLeaves } = useLeave();

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleSubmit = async () => {
    setSuccessMessage(null);
    setValidationError(null);

    if (fromDate && toDate && fromDate > toDate) {
      setValidationError('Start date must be before or equal to end date');
      return;
    }

    try {
      await submitLeave({ type: 'wfh', fromDate, toDate, reason });
      setSuccessMessage('WFH request submitted successfully');
      setFromDate('');
      setToDate('');
      setReason('');
    } catch {
      // error handled by hook
    }
  };

  const renderItem = ({ item }: { item: LeaveRequest }) => {
    let badgeColor = '#ffc107';
    if (item.status === 'approved') badgeColor = '#4caf50';
    if (item.status === 'rejected') badgeColor = '#f44336';

    return (
      <View style={styles.item}>
        <Text style={styles.itemTitle}>
          {item.fromDate} → {item.toDate}
        </Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
        <Text style={styles.itemReason}>{item.reason}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Apply WFH</Text>

        <TextInput
          style={styles.input}
          placeholder="From date (YYYY-MM-DD)"
          value={fromDate}
          onChangeText={setFromDate}
        />
        <TextInput
          style={styles.input}
          placeholder="To date (YYYY-MM-DD)"
          value={toDate}
          onChangeText={setToDate}
        />
        <TextInput
          style={[styles.input, styles.reasonInput]}
          placeholder="Reason"
          value={reason}
          onChangeText={setReason}
          multiline
        />

        {loading ? (
          <ActivityIndicator size="large" color="#333" style={styles.spinner} />
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        )}

        {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
        {validationError ? <Text style={styles.error}>{validationError}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>My Requests</Text>
          <FlatList
            data={leaves.filter((l) => l.type === 'wfh')}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={<Text style={styles.empty}>No WFH requests yet</Text>}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reasonInput: { height: 80, textAlignVertical: 'top' },
  submitButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  spinner: { marginVertical: 16 },
  success: { color: '#2e7d32', textAlign: 'center', marginBottom: 8 },
  error: { color: '#c62828', textAlign: 'center', marginBottom: 8 },
  listContainer: { flex: 1, marginTop: 20 },
  listTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  empty: { textAlign: 'center', color: '#777', marginTop: 20 },
  item: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  itemTitle: { fontWeight: '700' },
  itemReason: { marginTop: 4, color: '#333' },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 6,
  },
  badgeText: { fontSize: 10, color: '#fff', textTransform: 'capitalize' },
});

