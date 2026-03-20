import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'broadcast_read_ids_v1';

export async function getReadBroadcastIds(): Promise<Set<string>> {
  const json = await AsyncStorage.getItem(KEY);
  if (!json) return new Set();
  try {
    const arr: string[] = JSON.parse(json);
    return new Set(arr);
  } catch {
    return new Set();
  }
}

export async function markBroadcastRead(id: string) {
  const set = await getReadBroadcastIds();
  set.add(id);
  await AsyncStorage.setItem(KEY, JSON.stringify([...set]));
  return set;
}

