import * as Location from 'expo-location';

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
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw {
        code: 'PERMISSION_DENIED',
        message: 'Location permission denied. Please enable it in Settings.',
      };
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? 0,
      timestamp: position.timestamp ?? Date.now(),
    };
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
 * Get current GPS coordinates with permission handling (non-throwing version)
 * Returns null if location cannot be obtained
 */
export const getCurrentLocationSafe = async (): Promise<LocationData | null> => {
  try {
    return await getCurrentLocation();
  } catch (error) {
    console.warn('Failed to get location safely:', error);
    return null;
  }
};
