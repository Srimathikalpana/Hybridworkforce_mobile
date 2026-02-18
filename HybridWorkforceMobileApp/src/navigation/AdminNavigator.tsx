import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCard from '../components/common/DashboardCard';

export type AdminStackParamList = {
  AdminHome: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminHomeScreen() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Admin Dashboard"
      userName={user?.name || 'Admin'}
      role="HR Admin"
    >
      <DashboardCard
        title="User Management"
        description="Manage employees, roles and permissions"
        onPress={() => console.log('User Management pressed')}
      />
      <DashboardCard
        title="Devices"
        description="Monitor and manage registered devices"
        onPress={() => console.log('Devices pressed')}
      />
      <DashboardCard
        title="System Logs"
        description="View system activity and audit logs"
        onPress={() => console.log('System Logs pressed')}
      />
      <DashboardCard
        title="Location History"
        description="Track employee location history"
        onPress={() => console.log('Location History pressed')}
      />
    </DashboardLayout>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
    </Stack.Navigator>
  );
}
