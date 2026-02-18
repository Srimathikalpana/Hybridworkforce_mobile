import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCard from '../components/common/DashboardCard';

export type EmployeeStackParamList = {
  EmployeeHome: undefined;
};

const Stack = createNativeStackNavigator<EmployeeStackParamList>();

function EmployeeHomeScreen() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Employee Dashboard"
      userName={user?.name || 'Employee'}
      role="Employee"
    >
      <DashboardCard
        title="Check In / Check Out"
        description="Record your attendance for today"
        onPress={() => console.log('Check In / Check Out pressed')}
      />
      <DashboardCard
        title="Update Status"
        description="Update your current work status"
        onPress={() => console.log('Update Status pressed')}
      />
      <DashboardCard
        title="Apply Leave"
        description="Submit a new leave request"
        onPress={() => console.log('Apply Leave pressed')}
      />
      <DashboardCard
        title="My Attendance"
        description="View your attendance history"
        onPress={() => console.log('My Attendance pressed')}
      />
    </DashboardLayout>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
    </Stack.Navigator>
  );
}
