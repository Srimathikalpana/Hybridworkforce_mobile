import 'react-native-gesture-handler/jestSetup';

// Minimal AsyncStorage in-memory mock (no Node `require`).
const __store = {};
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(async (key, value) => {
    __store[key] = value;
  }),
  getItem: jest.fn(async (key) => {
    return Object.prototype.hasOwnProperty.call(__store, key) ? __store[key] : null;
  }),
  removeItem: jest.fn(async (key) => {
    delete __store[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(__store).forEach((k) => delete __store[k]);
  }),
}));

// Lightweight react-native-reanimated mock for Jest.
jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: {},
  useSharedValue: (initial) => ({ value: initial }),
  useAnimatedStyle: () => ({}),
  useAnimatedProps: () => ({}),
  withTiming: (value) => value,
  runOnJS: (fn) => fn,
  interpolate: (x) => x,
  Extrapolation: { CLAMP: 'clamp' },
  Easing: {},
}));

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(async () => ({ status: 'granted' })),
  getCurrentPositionAsync: jest.fn(async () => ({
    coords: { latitude: 0, longitude: 0, accuracy: 0 },
    timestamp: Date.now(),
  })),
  Accuracy: { High: 3 },
}));

