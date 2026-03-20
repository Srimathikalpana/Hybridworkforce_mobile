import api from './api';
import { getCurrentLocation, LocationData } from '../utils/locationService';

// Types
export interface AttendanceSession {
  id: string;
  userId: string;
  userName?: string;
  date: string;
  checkInTime: string;
  checkOutTime: string | null;
  lastActivity: string;
  status: string;
  activeDuration?: number;
  totalHours?: number;
}

/**
 * Check in for attendance with GPS location
 * 
 * Fetches current GPS coordinates and sends check-in request
 * POST /attendance/check-in
 * 
 * @throws LocationError - If GPS is unavailable or permission denied
 * @throws AxiosError - If API request fails
 */
export const checkIn = async (): Promise<CheckInResult> => {
  // Fetch current GPS coordinates
  const locationData = await getCurrentLocation();

  // Backend currently doesn't persist location, but we still tag the request
  // and return coordinates for UI/local storage.
  const { data } = await api.post<{ session: AttendanceSession }>(
    '/attendance/check-in',
    {
      source: 'MOBILE',
      timestamp: new Date().toISOString(),
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
      },
    }
  );

  return { session: data.session, coordinates: locationData };
};

/**
 * Check out from attendance
 * POST /attendance/check-out
 */
export const checkOut = async (): Promise<AttendanceSession> => {
  const locationData = await getCurrentLocation();
  const { data } = await api.post<{ session: AttendanceSession }>(
    '/attendance/check-out',
    {
      timestamp: new Date().toISOString(),
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy,
      },
    }
  );
  return data.session;
};

export interface CheckInResult {
  session: AttendanceSession;
  coordinates: LocationData;
}

export async function getTodaySession(): Promise<AttendanceSession | null> {
  const { data } = await api.get<{ session: AttendanceSession | null }>('/attendance/today');
  return data.session;
}

export async function getAttendanceHistory(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}): Promise<{ history: AttendanceSession[]; count: number }> {
  const { data } = await api.get<{ history: AttendanceSession[]; count: number }>('/attendance/history', {
    params,
  });
  return data;
}
