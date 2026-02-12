import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type AdminStackParamList = {
  AdminHome: undefined;
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

function AdminHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin Home</Text>
    </View>
  );
}

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
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
