import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import DashboardCard from '../components/common/DashboardCard';
import AttendanceScreen from '../screens/AttendanceScreen';
import StatusScreen from '../screens/StatusScreen';
import LeaveScreen from '../screens/LeaveScreen';

export type EmployeeStackParamList = {
  EmployeeHome: undefined;
  Attendance: undefined;
  Status: undefined;
  Leave: undefined;
};

const Stack = createNativeStackNavigator<EmployeeStackParamList>();

type EmployeeHomeProps = NativeStackScreenProps<EmployeeStackParamList, 'EmployeeHome'>;

function EmployeeHomeScreen({ navigation }: EmployeeHomeProps) {
  const { user } = useAuth();

  const handleAttendancePress = () => {
    console.log('Attendance card pressed, navigating...');
    navigation.navigate('Attendance');
  };

  return (
    <DashboardLayout
      title="Employee Dashboard"
      userName={user?.name || 'Employee'}
      role="Employee"
    >
      <DashboardCard
        title="Check In / Check Out"
        description="Record your attendance for today"
        onPress={handleAttendancePress}
      />
      <DashboardCard
        title="Update Status"
        description="Update your current work status"
        onPress={() => navigation.navigate('Status')}
      />
      <DashboardCard
        title="Apply Leave"
        description="Submit a new leave request"
        onPress={() => navigation.navigate('Leave')}
      />
      <DashboardCard
        title="My Attendance"
        description="View your attendance history"
        onPress={() => {}}
      />
    </DashboardLayout>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
      <Stack.Screen
        name="Attendance"
        component={AttendanceScreen}
        options={{
          headerShown: true,
          title: 'Attendance',
        }}
      />
      <Stack.Screen
        name="Status"
        component={StatusScreen}
        options={{
          headerShown: true,
          title: 'Update Status',
        }}
      />
      <Stack.Screen
        name="Leave"
        component={LeaveScreen}
        options={{
          headerShown: true,
          title: 'Apply Leave',
        }}
      />
    </Stack.Navigator>
  );
}
