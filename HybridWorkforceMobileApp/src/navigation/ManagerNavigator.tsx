import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCard from '../components/common/DashboardCard';

export type ManagerStackParamList = {
  ManagerHome: undefined;
};

const Stack = createNativeStackNavigator<ManagerStackParamList>();

function ManagerHomeScreen() {
  const { user } = useAuth();

  return (
    <DashboardLayout
      title="Manager Dashboard"
      userName={user?.name || 'Manager'}
      role="Manager"
    >
      <DashboardCard
        title="Team Status"
        description="View real-time status of your team members"
        onPress={() => console.log('Team Status pressed')}
      />
      <DashboardCard
        title="Pending Leaves"
        description="Review and approve leave requests"
        onPress={() => console.log('Pending Leaves pressed')}
      />
      <DashboardCard
        title="Attendance Overview"
        description="Monitor team attendance and patterns"
        onPress={() => console.log('Attendance Overview pressed')}
      />
      <DashboardCard
        title="Send Broadcast"
        description="Send announcements to your team"
        onPress={() => console.log('Send Broadcast pressed')}
      />
    </DashboardLayout>
  );
}

export default function ManagerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
    </Stack.Navigator>
  );
}
