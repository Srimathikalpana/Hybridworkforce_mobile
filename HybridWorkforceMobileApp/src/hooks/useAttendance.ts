import { useState, useCallback } from 'react';
import { checkIn, checkOut, CheckInResult } from '../services/attendanceService';
import {
  LocationData,
  getLocationErrorMessage,
} from '../utils/locationService';

interface AttendanceData {
  checkInTime?: string;
  checkOutTime?: string;
  location?: LocationData;
}

interface UseAttendanceReturn {
  isCheckedIn: boolean;
  loading: boolean;
  error: string | null;
  attendanceData: AttendanceData | null;
  handleCheckIn: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

export function useAttendance(): UseAttendanceReturn {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );

  const handleCheckIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result: CheckInResult = await checkIn();

      // Use coordinates if available, otherwise fall back to raw location field
      const locationData =
        result.coordinates ||
        (result.location
          ? {
              latitude: result.location.lat,
              longitude: result.location.lng,
              accuracy: result.accuracy || 0,
              timestamp: Date.now(),
            }
          : undefined);

      setAttendanceData({
        checkInTime: result.checkInTime,
        location: locationData,
      });

      setIsCheckedIn(true);
    } catch (err: any) {
      // Handle location errors specifically
      if (err.code) {
        // This is a location error from locationService
        const errorMessage = getLocationErrorMessage(err);
        setError(errorMessage);
      } else if (err.response?.data?.message) {
        // API error
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Check-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCheckOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await checkOut();

      // Update check-out time
      setAttendanceData((prev) => ({
        ...prev,
        checkOutTime: result.checkOutTime,
      }));

      setIsCheckedIn(false);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Check-out failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isCheckedIn,
    loading,
    error,
    attendanceData,
    handleCheckIn,
    handleCheckOut,
  };
}
