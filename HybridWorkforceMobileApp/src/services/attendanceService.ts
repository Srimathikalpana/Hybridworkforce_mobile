import api from './api';

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
}

export interface CheckOutRequest {
  timestamp: string;
}

export interface AttendanceResponse {
  id: string;
  userId: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
}

// ============================================================
// MOCK IMPLEMENTATION - Remove when backend is ready
// ============================================================
const MOCK_ENABLED = true;

let mockAttendanceState: AttendanceResponse | null = null;

const mockCheckIn = async (): Promise<AttendanceResponse> => {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));
  
  mockAttendanceState = {
    id: 'att-' + Date.now(),
    userId: '1',
    checkInTime: new Date().toISOString(),
    status: 'CHECKED_IN',
  };
  
  return mockAttendanceState;
};

const mockCheckOut = async (): Promise<AttendanceResponse> => {
  await new Promise((resolve) => setTimeout(() => resolve(undefined), 500));
  
  if (!mockAttendanceState) {
    throw new Error('Not checked in');
  }
  
  mockAttendanceState = {
    ...mockAttendanceState,
    checkOutTime: new Date().toISOString(),
    status: 'CHECKED_OUT',
  };
  
  return mockAttendanceState;
};
// ============================================================
// END MOCK IMPLEMENTATION
// ============================================================

/**
 * Check in for attendance
 * POST /attendance/check-in
 */
export const checkIn = async (
  location: Location = { lat: 0, lng: 0 }
): Promise<AttendanceResponse> => {
  if (MOCK_ENABLED) {
    return mockCheckIn();
  }

  const requestBody: CheckInRequest = {
    source: 'MOBILE',
    timestamp: new Date().toISOString(),
    location,
    deviceId: 'ANDROID-EMULATOR',
  };

  const response = await api.post<AttendanceResponse>(
    '/attendance/check-in',
    requestBody
  );
  return response.data;
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
