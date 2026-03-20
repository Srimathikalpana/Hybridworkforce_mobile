import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { changePassword, getUserById, updateUser } from '../services/userService';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canEditIdentity = useMemo(
    () => user?.role === 'HR_ADMIN' || user?.role === 'SYS_ADMIN',
    [user?.role]
  );

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const fresh = await getUserById(user.id);
      setProfile(fresh);
      setName(fresh.name || '');
      setEmail(fresh.email || '');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const onSave = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      if (!canEditIdentity) {
        Alert.alert('Not allowed', 'Only HR Admin/System Admin can edit profile details.');
        return;
      }
      const updated = await updateUser(user.id, { name: name.trim(), email: email.trim() });
      setProfile(updated);
      Alert.alert('Saved', 'Profile updated successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  }, [canEditIdentity, email, name, user?.id]);

  const onChangePassword = useCallback(async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Missing', 'Please enter current and new password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Updated', 'Password updated successfully.');
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }, [currentPassword, newPassword]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Text style={styles.section}>Account</Text>
      <Text style={styles.row}>Role: {profile?.role || '—'}</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        editable={canEditIdentity && !loading}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        editable={canEditIdentity && !loading}
      />

      <Button title="Save Profile" onPress={onSave} disabled={!canEditIdentity || loading} />

      <View style={{ height: 18 }} />

      <Text style={styles.section}>Change Password</Text>
      <TextInput
        style={styles.input}
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="Current password"
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="New password"
        secureTextEntry
        editable={!loading}
      />
      <Button title="Update Password" onPress={onChangePassword} disabled={loading} />

      <View style={{ height: 16 }} />
      <Button title="Logout" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  row: { marginTop: 10, color: '#334155' },
  error: { marginTop: 10, color: '#b91c1c' },
  section: { marginTop: 14, fontWeight: '700', color: '#0f172a' },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});

