import Geolocation from 'react-native-geolocation-service';
import {
  requestLocationPermission,
  checkLocationPermission,
  getPermissionErrorMessage,
} from './permissionsService';

/**
 * Location Service
 * Handles GPS location fetching with permission management
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData extends Coordinates {
  accuracy: number;
  timestamp: number;
}

export interface LocationError {
  code: string;
  message: string;
}

/**
 * Get current GPS coordinates with permission handling
 * 
 * Returns: { latitude, longitude, accuracy, timestamp }
 * Throws: LocationError with code and message
 */
export const getCurrentLocation = async (): Promise<LocationData> => {
  try {
    // First check if permission is already granted
    const permissionStatus = await checkLocationPermission();

    if (permissionStatus !== 'granted') {
      // Try to request permission
      const requestResult = await requestLocationPermission();

      if (requestResult !== 'granted') {
        throw {
          code: 'PERMISSION_' + requestResult.toUpperCase(),
          message: getPermissionErrorMessage(requestResult),
        };
      }
    }

    // Get current position with timeout
    return new Promise((resolve, reject) => {
      let timeoutId: number | null = null;

      // Set timeout for GPS request (10 seconds)
      timeoutId = setTimeout(() => {
        reject({
          code: 'TIMEOUT',
          message: 'GPS location request timed out. Please try again.',
        });
      }, 10000);

      Geolocation.getCurrentPosition(
        (position) => {
          if (timeoutId) clearTimeout(timeoutId);

          const { coords, timestamp } = position;
          const { latitude, longitude, accuracy } = coords;

          resolve({
            latitude,
            longitude,
            accuracy: accuracy || 0,
            timestamp: timestamp || Date.now(),
          });
        },
        (error) => {
          if (timeoutId) clearTimeout(timeoutId);

          // Map Geolocation errors to our error format
          let errorCode = 'UNKNOWN';
          let errorMessage = 'Failed to get GPS location';

          switch (error.code) {
            case 1:
              errorCode = 'PERMISSION_DENIED';
              errorMessage = 'Location permission denied by user';
              break;
            case 2:
              errorCode = 'GPS_UNAVAILABLE';
              errorMessage = 'GPS location service is unavailable';
              break;
            case 3:
              errorCode = 'TIMEOUT';
              errorMessage =
                'GPS location request timed out. Please try again.';
              break;
            case 4:
              errorCode = 'INVALID_SETTING';
              errorMessage =
                'Invalid GPS settings. Please check your device settings.';
              break;
          }

          reject({
            code: errorCode,
            message: errorMessage,
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  } catch (error: any) {
    throw {
      code: error.code || 'UNKNOWN',
      message: error.message || 'Failed to get GPS location',
    };
  }
};

/**
 * Get user-friendly error message for location error
 */
export const getLocationErrorMessage = (error: LocationError): string => {
  return error.message || 'Failed to get GPS location. Please try again.';
};

/**
 * Format coordinates for display
 */
export const formatCoordinates = (coords: Coordinates): string => {
  return `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
};

/**
 * Format coordinates for API request (short format)
 */
export const formatCoordinatesForApi = (coords: Coordinates): string => {
  return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
};
