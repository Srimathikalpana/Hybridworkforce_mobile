import api from './api';
import { User } from './authService';

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get<{ user: User }>('/users/' + id);
  return data.user;
}

export async function updateUser(id: string, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User> {
  const { data } = await api.put<{ user: User }>('/users/' + id, updates);
  return data.user;
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const { data } = await api.put<{ message: string }>('/users/change-password', {
    currentPassword,
    newPassword,
  });
  return data;
}

