import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { deleteBooking, listUserBookings } from '../services/db';
import { loadUserSession } from '../storage/session';

type Props = NativeStackScreenProps<RootStackParamList, 'Bookings'>;

export default function BookingsScreen({ navigation }: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const session = await loadUserSession();
      if (!session) {
        navigation.replace('Login');
        return;
      }
      setUserId(session.id);
      const data = await listUserBookings(session.id);
      setBookings(data);
    })();
  }, [navigation]);

  const handleDelete = async (id: string) => {
    if (!userId) return;
    try {
      await deleteBooking(id, userId);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (e: any) {
      Alert.alert('Cannot delete booking', e.message ?? 'Unknown error');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 12 }}>My Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, padding: 12, borderRadius: 6, marginBottom: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600' }}>{item.destination?.title ?? 'Unknown destination'}</Text>
            <Text>Booked on: {new Date(item.createdAt).toLocaleString()}</Text>
            <Button title="Delete Booking" color="#b00020" onPress={() => handleDelete(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>No bookings yet</Text>}
      />
    </View>
  );
}


