import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useAttendance } from '../hooks/useAttendance';

/**
 * Format ISO timestamp to readable time format
 */
const formatTime = (isoString: string | undefined): string => {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '--:--';
  }
};

/**
 * Format coordinates for display
 */
const formatCoordinates = (
  latitude: number | undefined,
  longitude: number | undefined
): string => {
  if (!latitude || !longitude) return 'No location data';
  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
};

/**
 * Format accuracy in meters
 */
const formatAccuracy = (accuracy: number | undefined): string => {
  if (!accuracy) return 'N/A';
  return `±${Math.round(accuracy)}m`;
};

export default function AttendanceScreen() {
  const {
    isCheckedIn,
    loading,
    error,
    attendanceData,
    currentLocation,
    handleCheckIn,
    handleCheckOut,
    refreshLocation,
  } = useAttendance();
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.content}>
            {/* Status Icon */}
            <View
              style={[
                styles.statusIcon,
                isCheckedIn
                  ? styles.statusCheckedIn
                  : styles.statusCheckedOut,
              ]}
            >
              <Text style={styles.statusEmoji}>
                {isCheckedIn ? '✓' : '○'}
              </Text>
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>
              {isCheckedIn ? 'You are checked in' : 'You are not checked in'}
            </Text>

            {/* Attendance Details */}
            {isCheckedIn && attendanceData && (
              <View style={styles.detailsContainer}>
                {/* Check-in Time */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Check-in Time</Text>
                  <Text style={styles.detailValue}>
                    {formatTime(attendanceData.checkInTime)}
                  </Text>
                </View>

                {/* GPS Coordinates */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location (GPS)</Text>
                  <Text style={styles.detailValue}>
                    {formatCoordinates(
                      attendanceData.location?.latitude,
                      attendanceData.location?.longitude
                    )}
                  </Text>
                </View>

                {/* Accuracy */}
                {attendanceData.location && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Accuracy</Text>
                    <Text style={styles.detailValue}>
                      {formatAccuracy(attendanceData.location.accuracy)}
                    </Text>
                  </View>
                )}

                {/* Check-out Time (if checked out) */}
                {attendanceData.checkOutTime && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Check-out Time</Text>
                    <Text style={styles.detailValue}>
                      {formatTime(attendanceData.checkOutTime)}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Current Location Display */}
            {!isCheckedIn && (
              <View style={styles.currentLocationContainer}>
                <Text style={styles.currentLocationTitle}>Current Location</Text>

                {currentLocation ? (
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationText}>
                      {formatCoordinates(currentLocation.latitude, currentLocation.longitude)}
                    </Text>
                    <Text style={styles.accuracyText}>
                      Accuracy: {formatAccuracy(currentLocation.accuracy)}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.noLocationText}>Location not available</Text>
                )}

                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={refreshLocation}
                  disabled={loading}
                  activeOpacity={0.8}
                >
                  <Text style={styles.refreshButtonText}>Refresh Location</Text>
                </TouchableOpacity>
              </View>
            )}

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
                ? 'Your GPS location is automatically captured and recorded with your check-in. Tap the button above to record your check-out time.'
                : 'Tap the button above to record your check-in time. Your GPS location will be automatically captured.'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
    maxWidth: 350,
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
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1.2,
    textAlign: 'right',
    fontFamily: 'monospace',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#c62828',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
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
  currentLocationContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1976d2',
  },
  currentLocationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  locationDetails: {
    width: '100%',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#333',
    fontFamily: 'monospace',
    marginBottom: 8,
  },
  accuracyText: {
    fontSize: 13,
    color: '#666',
  },
  noLocationText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
  },
  refreshButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
