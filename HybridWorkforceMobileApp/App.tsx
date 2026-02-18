/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import AdminNavigator from './src/navigation/AdminNavigator';
import ManagerNavigator from './src/navigation/ManagerNavigator';
import EmployeeNavigator from './src/navigation/EmployeeNavigator';
import { RootStackParamList } from './src/types/navigation';
import { UserRole } from './src/services/authService';

const Stack = createNativeStackNavigator<RootStackParamList>();

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function getNavigatorByRole(role: UserRole) {
  switch (role) {
    case 'HR_ADMIN':
    case 'SYS_ADMIN':
      return AdminNavigator;
    case 'MANAGER':
      return ManagerNavigator;
    case 'EMPLOYEE':
    default:
      return EmployeeNavigator;
  }
}

function RootNavigator() {
  const { status, user } = useAuth();

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  if (status === 'authenticated' && user) {
    const RoleNavigator = getNavigatorByRole(user.role);
    return <RoleNavigator />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
});
