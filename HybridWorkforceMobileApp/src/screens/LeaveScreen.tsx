import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useLeave } from '../hooks/useLeave';
import { LeaveType, LeaveRequest } from '../types/leave';

export default function LeaveScreen() {
  const { leaves, loading, error, submitLeave, fetchLeaves } = useLeave();

  const [type, setType] = useState<LeaveType>('leave');
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

    // simple date validation
    if (fromDate && toDate && fromDate > toDate) {
      setValidationError('Start date must be before or equal to end date');
      return;
    }

    try {
      await submitLeave({ type, fromDate, toDate, reason });
      setSuccessMessage('Leave request submitted successfully');
      // clear form
      setFromDate('');
      setToDate('');
      setReason('');
    } catch {
      // error state is managed by hook; nothing to do here
    }
  };

  const renderItem = ({ item }: { item: LeaveRequest }) => {
    let badgeColor = '#ffc107'; // pending
    if (item.status === 'approved') badgeColor = '#4caf50';
    if (item.status === 'rejected') badgeColor = '#f44336';

    return (
      <View style={styles.leaveItem}>
        <Text style={styles.leaveType}>{item.type.toUpperCase()}</Text>
        <Text style={styles.leaveDates}>
          {item.fromDate} → {item.toDate}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}> 
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
        <Text style={styles.leaveReason}>{item.reason}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Apply for Leave / WFH</Text>

        {/* Type selector buttons */}
        <View style={styles.typeRow}>
          {(['leave', 'wfh'] as LeaveType[]).map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.typeButton,
                type === opt && styles.typeButtonSelected,
              ]}
              onPress={() => setType(opt)}
              activeOpacity={0.7}
            >
              <Text
                style={
                  type === opt
                    ? styles.typeButtonTextSelected
                    : styles.typeButtonText
                }
              >
                {opt.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        )}

        {successMessage && (
          <Text style={styles.success}>{successMessage}</Text>
        )}
        {validationError && (
          <Text style={styles.error}>{validationError}</Text>
        )}
        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>My Requests</Text>
          <FlatList
            data={leaves}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            ListEmptyComponent={() => (
              <Text style={styles.empty}>No leave requests yet</Text>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#666',
    marginHorizontal: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#1976d2',
    borderColor: '#1976d2',
  },
  typeButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  reasonInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  spinner: {
    marginVertical: 16,
  },
  success: {
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 8,
  },
  error: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  leaveItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  leaveType: {
    fontWeight: '600',
  },
  leaveDates: {
    fontSize: 12,
    color: '#555',
  },
  leaveReason: {
    marginTop: 4,
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    textTransform: 'capitalize',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
});
