import api from './api';
import { getCurrentLocation, LocationData } from '../utils/locationService';

// Types
export interface Location {
  lat: number;
  lng: number;
}

export interface CheckInRequest {
  source: 'MOBILE';
  timestamp: string;
  location: Location;
  deviceId: string;
  accuracy?: number;
}

export interface CheckOutRequest {
  timestamp: string;
}

export interface AttendanceResponse {
  id: string;
  userId: string;
  checkInTime?: string;
  checkOutTime?: string;
  location?: Location;
  accuracy?: number;
  status: string;
}

export interface CheckInResult extends AttendanceResponse {
  coordinates?: LocationData;
}

// ============================================================
// MOCK IMPLEMENTATION - Remove when backend is ready
// ============================================================
const MOCK_ENABLED = true;

let mockAttendanceState: CheckInResult | null = null;

const mockCheckIn = async (
  location: Location,
  accuracy?: number
): Promise<CheckInResult> => {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  const now = Date.now();
  // create a LocationData object similar to what getCurrentLocation returns
  const coords: LocationData = {
    latitude: location.lat,
    longitude: location.lng,
    accuracy: accuracy || 0,
    timestamp: now,
  };

  mockAttendanceState = {
    id: 'att-' + now,
    userId: '1',
    checkInTime: new Date(now).toISOString(),
    location,
    accuracy,
    status: 'CHECKED_IN',
    coordinates: coords,
  };

  return mockAttendanceState;
};

const mockCheckOut = async (): Promise<AttendanceResponse> => {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));

  if (!mockAttendanceState) {
    throw new Error('Not checked in');
  }

  const result: CheckInResult = {
    ...mockAttendanceState,
    checkOutTime: new Date().toISOString(),
    status: 'CHECKED_OUT',
  };

  mockAttendanceState = null;
  return result;
};
// ============================================================
// END MOCK IMPLEMENTATION
// ============================================================

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

  const location: Location = {
    lat: locationData.latitude,
    lng: locationData.longitude,
  };

  if (MOCK_ENABLED) {
    return mockCheckIn(location, locationData.accuracy);
  }

  const requestBody: CheckInRequest = {
    source: 'MOBILE',
    timestamp: new Date().toISOString(),
    location,
    deviceId: 'ANDROID-EMULATOR',
    accuracy: locationData.accuracy,
  };

  const response = await api.post<AttendanceResponse>(
    '/attendance/check-in',
    requestBody
  );

  return {
    ...response.data,
    coordinates: locationData,
  };
};

/**
 * Check out from attendance
 * POST /attendance/check-out
 */
export const checkOut = async (): Promise<AttendanceResponse> => {
  if (MOCK_ENABLED) {
    return mockCheckOut();
  }

  const requestBody: CheckOutRequest = {
    timestamp: new Date().toISOString(),
  };

  const response = await api.post<AttendanceResponse>(
    '/attendance/check-out',
    requestBody
  );
  return response.data;
};
