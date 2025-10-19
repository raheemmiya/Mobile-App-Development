import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../services/db';

const KEY = 'session:user';

export async function saveUserSession(user: User): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(user));
}

export async function loadUserSession(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function clearUserSession(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}


