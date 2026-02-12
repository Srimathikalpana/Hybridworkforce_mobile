import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ManagerStackParamList = {
  ManagerHome: undefined;
};

const Stack = createNativeStackNavigator<ManagerStackParamList>();

function ManagerHomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Manager Home</Text>
    </View>
  );
}

export default function ManagerNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />
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
