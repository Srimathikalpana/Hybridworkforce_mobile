import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkIn,
  checkOut,
  CheckInResult,
  getTodaySession,
  AttendanceSession,
} from '../services/attendanceService';
import {
  LocationData,
  getLocationErrorMessage,
  getCurrentLocationSafe,
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
  currentLocation: LocationData | null;
  handleCheckIn: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
  refreshLocation: () => Promise<void>;
}

export function useAttendance(): UseAttendanceReturn {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);

  // persist key independent of auth tokens
  const STORAGE_KEY = 'attendance_state';

  // load saved state once on mount
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const saved: {isCheckedIn: boolean; attendanceData: AttendanceData | null} =
            JSON.parse(json);
          setIsCheckedIn(saved.isCheckedIn);
          setAttendanceData(saved.attendanceData);
        }
      } catch (e) {
        console.warn('Failed to restore attendance state', e);
      }
    })();
  }, []);

  // also try to hydrate from backend "today" session
  useEffect(() => {
    (async () => {
      try {
        const session = await getTodaySession();
        if (!session) return;
        const checkedIn = !!session.checkInTime && !session.checkOutTime;
        const hydrated: AttendanceData = {
          checkInTime: session.checkInTime,
          checkOutTime: session.checkOutTime || undefined,
        };
        setIsCheckedIn(checkedIn);
        setAttendanceData(hydrated);
        await persistState(checkedIn, hydrated);
      } catch {
        // ignore; offline or token issues handled elsewhere
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper to persist current state
  const persistState = async (
    checkedIn: boolean,
    data: AttendanceData | null
  ) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ isCheckedIn: checkedIn, attendanceData: data })
      );
    } catch (e) {
      console.warn('Failed to persist attendance state', e);
    }
  };

  const handleCheckIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result: CheckInResult = await checkIn();
      const session: AttendanceSession = result.session;
      const locationData = result.coordinates;

      const newData: AttendanceData = {
        checkInTime: session.checkInTime,
        location: locationData,
      };
      setAttendanceData(newData);
      setIsCheckedIn(true);

      // persist so logout or app restart won't forget
      await persistState(true, newData);
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
      setAttendanceData((prev) => {
        const updated = {
          ...prev,
          checkOutTime: result.checkOutTime || undefined,
        } as AttendanceData;
        // persist updated record (includes checkout time)
        persistState(false, updated);
        return updated;
      });

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

  const refreshLocation = useCallback(async () => {
    setError(null);
    const location = await getCurrentLocationSafe();
    setCurrentLocation(location);
  }, []);

  return {
    isCheckedIn,
    loading,
    error,
    attendanceData,
    currentLocation,
    handleCheckIn,
    handleCheckOut,
    refreshLocation,
  };
}
