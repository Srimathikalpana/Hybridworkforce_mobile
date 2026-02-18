import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useAttendance } from '../hooks/useAttendance';

export default function AttendanceScreen() {
  const { isCheckedIn, loading, error, handleCheckIn, handleCheckOut } =
    useAttendance();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onCheckIn = async () => {
    setSuccessMessage(null);
    await handleCheckIn();
    if (!error) {
      setSuccessMessage('Successfully checked in!');
    }
  };

  const onCheckOut = async () => {
    setSuccessMessage(null);
    await handleCheckOut();
    if (!error) {
      setSuccessMessage('Successfully checked out!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Status Icon */}
          <View
            style={[
              styles.statusIcon,
              isCheckedIn ? styles.statusCheckedIn : styles.statusCheckedOut,
            ]}
          >
            <Text style={styles.statusEmoji}>{isCheckedIn ? '✓' : '○'}</Text>
          </View>

          {/* Status Text */}
          <Text style={styles.statusText}>
            {isCheckedIn ? 'You are checked in' : 'You are not checked in'}
          </Text>

          {/* Success Message */}
          {successMessage && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Action Button */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1976d2" />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          ) : isCheckedIn ? (
            <TouchableOpacity
              style={[styles.button, styles.checkOutButton]}
              onPress={onCheckOut}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Check Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.checkInButton]}
              onPress={onCheckIn}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Check In</Text>
            </TouchableOpacity>
          )}

          {/* Info Text */}
          <Text style={styles.infoText}>
            {isCheckedIn
              ? 'Tap the button above to record your check-out time'
              : 'Tap the button above to record your check-in time'}
          </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  statusIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusCheckedIn: {
    backgroundColor: '#e8f5e9',
    borderWidth: 3,
    borderColor: '#4caf50',
  },
  statusCheckedOut: {
    backgroundColor: '#fafafa',
    borderWidth: 3,
    borderColor: '#9e9e9e',
  },
  statusEmoji: {
    fontSize: 40,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  successText: {
    color: '#2e7d32',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInButton: {
    backgroundColor: '#1976d2',
  },
  checkOutButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
