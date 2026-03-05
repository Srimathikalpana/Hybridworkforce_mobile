import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';
import { Platform } from 'react-native';

/**
 * Location Permission Service
 * Handles requesting and checking location permissions for both Android and iOS
 */

export type PermissionResult = 'granted' | 'denied' | 'unavailable' | 'blocked';

/**
 * Get the appropriate location permission for the platform
 */
const getLocationPermission = (): Permission => {
  if (Platform.OS === 'ios') {
    return PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;
  } else {
    return PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
  }
};

/**
 * Convert permission status to a more readable format
 */
const mapPermissionStatus = (status: PermissionStatus): PermissionResult => {
  switch (status) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.BLOCKED:
      return 'blocked';
    case RESULTS.UNAVAILABLE:
      return 'unavailable';
    default:
      return 'unavailable';
  }
};

/**
 * Check current location permission status
 */
export const checkLocationPermission = async (): Promise<PermissionResult> => {
  try {
    const permission = getLocationPermission();
    const status = await check(permission);
    return mapPermissionStatus(status);
  } catch (error) {
    console.error('Error checking location permission:', error);
    return 'unavailable';
  }
};

/**
 * Request location permission from user
 * Returns the permission result (granted, denied, blocked, unavailable)
 */
export const requestLocationPermission = async (): Promise<
  PermissionResult
> => {
  try {
    const permission = getLocationPermission();

    // First check current status
    const currentStatus = await check(permission);

    // If already granted, return granted
    if (currentStatus === RESULTS.GRANTED) {
      return 'granted';
    }

    // If blocked, return blocked (user needs to manually enable in settings)
    if (currentStatus === RESULTS.BLOCKED) {
      return 'blocked';
    }

    // Request permission
    const result = await request(permission);
    return mapPermissionStatus(result);
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return 'unavailable';
  }
};

/**
 * Get user-friendly error message for permission result
 */
export const getPermissionErrorMessage = (result: PermissionResult): string => {
  switch (result) {
    case 'denied':
      return 'Location permission denied. Please try again.';
    case 'blocked':
      return 'Location permission is blocked. Please enable it in Settings.';
    case 'unavailable':
      return 'Location service is unavailable on this device.';
    default:
      return 'Unknown permission error.';
  }
};

/**
 * Check if permission is granted
 */
export const isLocationPermissionGranted = async (): Promise<boolean> => {
  const result = await checkLocationPermission();
  return result === 'granted';
};
