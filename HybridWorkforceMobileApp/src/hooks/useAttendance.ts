import { useState, useCallback } from 'react';
import { checkIn, checkOut } from '../services/attendanceService';

interface UseAttendanceReturn {
  isCheckedIn: boolean;
  loading: boolean;
  error: string | null;
  handleCheckIn: () => Promise<void>;
  handleCheckOut: () => Promise<void>;
}

export function useAttendance(): UseAttendanceReturn {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await checkIn({ lat: 0, lng: 0 });
      setIsCheckedIn(true);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Check-in failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCheckOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await checkOut();
      setIsCheckedIn(false);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Check-out failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    isCheckedIn,
    loading,
    error,
    handleCheckIn,
    handleCheckOut,
  };
}
