import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { loadUserSession, saveUserSession } from '../storage/session';
import { loginUser } from '../services/db';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const existing = await loadUserSession();
      if (existing) {
        navigation.replace('Home');
      }
    })();
  }, [navigation]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const user = await loginUser(username.trim(), password);
      await saveUserSession(user);
      navigation.replace('Home');
    } catch (e: any) {
      Alert.alert('Login failed', e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>Login</Text>
      <TextInput placeholder="Username" autoCapitalize="none" value={username} onChangeText={setUsername} style={{ borderWidth: 1, padding: 8, marginBottom: 8 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, padding: 8, marginBottom: 16 }} />
      <Button title={loading ? 'Please wait...' : 'Login'} onPress={onLogin} disabled={loading} />
      <View style={{ height: 12 }} />
      <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}


