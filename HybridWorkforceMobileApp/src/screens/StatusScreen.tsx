import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useStatus } from "../hooks/useStatus";
import { Status } from "../services/statusService";

const STATUS_OPTIONS: Array<{ label: string; value: Status; color: string }> = [
  { label: "Available", value: "AVAILABLE", color: "#4CAF50" },
  { label: "Idle", value: "IDLE", color: "#FFC107" },
  { label: "Offline", value: "OFFLINE", color: "#F44336" },
];

export default function StatusScreen() {
  const { currentStatus, loading, error, changeStatus } = useStatus();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Your Status</Text>
      <View style={styles.buttonRow}>
        {STATUS_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.statusButton,
              {
                backgroundColor: option.color,
                borderWidth: currentStatus === option.value ? 4 : 0,
                borderColor: currentStatus === option.value ? "#333" : "transparent",
              },
            ]}
            disabled={loading}
            onPress={() => changeStatus(option.value)}
          >
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {loading && <ActivityIndicator size="large" color="#333" style={styles.spinner} />}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  statusButton: {
    width: 120,
    height: 120,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 12,
    elevation: 4,
  },
  buttonText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  spinner: {
    marginTop: 16,
  },
  error: {
    color: "#F44336",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
