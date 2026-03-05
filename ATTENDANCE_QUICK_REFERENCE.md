# Quick Reference: Attendance + GPS Module

## File Structure

```
src/
├── services/
│   ├── api.ts                          # Axios instance with JWT interceptor
│   └── attendanceService.ts ⭐         # Check-in/out with GPS
├── hooks/
│   └── useAttendance.ts ⭐             # State management hook
├── screens/
│   └── AttendanceScreen.tsx ⭐         # UI component with location display
├── utils/
│   ├── locationService.ts ⭐           # GPS coordinate fetching
│   ├── permissionsService.ts ⭐        # Location permission handling
│   └── authStorage.ts                 # Token storage
└── context/
    └── AuthContext.tsx                # Authentication context

⭐ = New or Modified for GPS functionality
```

## Quick Integration Path

### 1. Location Permission Request
```typescript
// Automatic, happens in locationService
// User sees permission prompt on first check-in
import { requestLocationPermission } from './utils/permissionsService';

const result = await requestLocationPermission();
// Returns: 'granted' | 'denied' | 'blocked' | 'unavailable'
```

### 2. Get Current Location
```typescript
import { getCurrentLocation } from './utils/locationService';

try {
  const location = await getCurrentLocation();
  console.log(location);
  // { latitude: 37.7749, longitude: -122.4194, accuracy: 12.5, timestamp: 1234567890 }
} catch (error) {
  console.error(error.code, error.message);
  // error.code: 'PERMISSION_DENIED' | 'GPS_UNAVAILABLE' | 'TIMEOUT'
}
```

### 3. Check In with GPS
```typescript
import { checkIn, checkOut } from './services/attendanceService';

try {
  // Automatically gets GPS, requests permission if needed
  const result = await checkIn();
  console.log(result);
  // {
  //   id: 'att-123',
  //   userId: '1',
  //   checkInTime: '2026-03-05T10:30:00Z',
  //   location: { lat: 37.7749, lng: -122.4194 },
  //   accuracy: 12.5,
  //   status: 'CHECKED_IN',
  //   coordinates: { latitude: 37.7749, longitude: -122.4194, ... }
  // }
} catch (error) {
  console.error(error);
}
```

### 4. Use in Screen Component
```typescript
import { useAttendance } from './hooks/useAttendance';

export default function AttendanceScreen() {
  const {
    isCheckedIn,           // boolean
    loading,               // boolean
    error,                 // string | null
    attendanceData,        // { checkInTime, checkOutTime, location }
    handleCheckIn,         // async function
    handleCheckOut         // async function
  } = useAttendance();

  return (
    <View>
      <Text>{isCheckedIn ? 'Checked In' : 'Not Checked In'}</Text>
      
      {attendanceData?.location && (
        <Text>
          {attendanceData.location.latitude.toFixed(6)},
          {attendanceData.location.longitude.toFixed(6)}
        </Text>
      )}

      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <Button
        onPress={isCheckedIn ? handleCheckOut : handleCheckIn}
        title={isCheckedIn ? 'Check Out' : 'Check In'}
        disabled={loading}
      />
    </View>
  );
}
```

## Type Definitions

```typescript
// Location Result
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;      // in meters
  timestamp: number;     // milliseconds since epoch
}

// Check-in Result
interface CheckInResult {
  id: string;
  userId: string;
  checkInTime?: string;  // ISO string
  checkOutTime?: string;
  location: Location;    // { lat, lng }
  accuracy?: number;
  status: string;        // 'CHECKED_IN' | 'CHECKED_OUT'
  coordinates?: LocationData;
}

// Attendance Data in Hook
interface AttendanceData {
  checkInTime?: string;
  checkOutTime?: string;
  location?: LocationData;
}
```

## Error Codes

| Code | Meaning | User Action |
|------|---------|-------------|
| `PERMISSION_DENIED` | Permission declined | Tap "Try Again" |
| `PERMISSION_BLOCKED` | Permission disabled in settings | Enable in Settings |
| `GPS_UNAVAILABLE` | GPS not working | Enable GPS in Settings |
| `TIMEOUT` | GPS took too long | Move to open area, retry |
| `API_ERROR` | Backend error | Retry in few moments |

## Configuration

### Base API URL
**File**: `src/services/api.ts` (line ~5)
```typescript
const BASE_URL = 'http://10.0.2.2:3000/api'; // Emulator
// Change for real device:
// const BASE_URL = 'http://192.168.1.100:3000/api'; // Your IP
```

### Mock Mode
**File**: `src/services/attendanceService.ts` (line ~32)
```typescript
const MOCK_ENABLED = true;  // Set to false for production
```

### GPS Timeout
**File**: `src/utils/locationService.ts` (line ~69)
```typescript
timeoutId = setTimeout(() => {...}, 10000);  // 10 seconds
```

## Request/Response Example

### Request Body
```json
{
  "source": "MOBILE",
  "timestamp": "2026-03-05T10:30:00.000Z",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "deviceId": "ANDROID-EMULATOR",
  "accuracy": 12.5
}
```

### Response Body
```json
{
  "id": "att-1234567890",
  "userId": "1",
  "checkInTime": "2026-03-05T10:30:00.000Z",
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "accuracy": 12.5,
  "status": "CHECKED_IN"
}
```

## Dependencies

Install with:
```bash
npm install react-native-geolocation-service react-native-permissions
```

**Packages Added**:
- `react-native-geolocation-service@^5.3.1` - GPS
- `react-native-permissions@^4.1.5` - Permissions

## Android Manifest (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

## iOS Info.plist

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs your location for attendance tracking.</string>
```

## Common Tasks

### Display GPS Coordinates
```typescript
const { attendanceData } = useAttendance();

if (attendanceData?.location) {
  const lat = attendanceData.location.latitude.toFixed(6);
  const lng = attendanceData.location.longitude.toFixed(6);
  return <Text>{lat}, {lng}</Text>;
}
```

### Check Accuracy
```typescript
const accuracy = attendanceData?.location?.accuracy;
if (accuracy && accuracy > 50) {
  console.warn('Low GPS accuracy:', accuracy);
}
```

### Display Time
```typescript
const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString();
};

<Text>{formatTime(attendanceData?.checkInTime)}</Text>
```

### Retry Check-in
```typescript
const { error, handleCheckIn } = useAttendance();

return (
  <View>
    {error && (
      <TouchableOpacity onPress={handleCheckIn}>
        <Text>Try Again</Text>
      </TouchableOpacity>
    )}
  </View>
);
```

## Testing

### Mock Check-in
```typescript
// Enable mock mode in attendanceService.ts
const MOCK_ENABLED = true;

// Then check-in works without real GPS
const result = await checkIn();
// Returns mock data with coordinates (0, 0)
```

### Real Device Testing
```typescript
// Disable mock mode
const MOCK_ENABLED = false;

// Real GPS data is captured
const result = await checkIn();
// Returns real coordinates
```

## Debugging

### Check Permission Status
```typescript
import { checkLocationPermission } from './utils/permissionsService';

const status = await checkLocationPermission();
console.log('Permission status:', status);
// Output: 'granted' | 'denied' | 'blocked' | 'unavailable'
```

### Verify Token is Being Sent
```typescript
// Add to api.ts request interceptor for debugging
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  console.log('Token:', token?.substring(0, 20) + '...');
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

### Check Location Data
```typescript
const { attendanceData } = useAttendance();
console.log('Attendance Data:', JSON.stringify(attendanceData, null, 2));
```

## Production Checklist

- [ ] Set `MOCK_ENABLED = false`
- [ ] Update `BASE_URL` to production API
- [ ] Add platform-specific permissions
- [ ] Test on real Android device
- [ ] Test on real iOS device
- [ ] Test offline scenarios
- [ ] Test permission denial scenarios
- [ ] Test GPS unavailable scenarios
- [ ] Verify token is attached to requests
- [ ] Test with real backend
- [ ] Add error logging/analytics
- [ ] Set appropriate timeouts
- [ ] Document API errors from backend

---

**For full documentation**: See `ATTENDANCE_GPS_INTEGRATION.md`
