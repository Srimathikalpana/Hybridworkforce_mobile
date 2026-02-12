import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type EmployeeStackParamList = {
  EmployeeHome: undefined;
};

const Stack = createNativeStackNavigator<EmployeeStackParamList>();

function EmployeeHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Employee Home</Text>
    </View>
  );
}

export default function EmployeeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeHome" component={EmployeeHomeScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
