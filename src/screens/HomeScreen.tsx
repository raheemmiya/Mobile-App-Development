import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import DestinationForm from '../components/DestinationForm';
import DestinationItem from '../components/DestinationItem';
import { addDestination, bookDestination, deleteDestination, Destination, listDestinations } from '../services/db';
import { clearUserSession, loadUserSession } from '../storage/session';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const session = await loadUserSession();
      if (!session) {
        navigation.replace('Login');
        return;
      }
      setUserId(session.id);
      const data = await listDestinations();
      setDestinations(data);
    })();
  }, [navigation]);

  const handleAdd = async (title: string, description: string, price: number) => {
    if (!userId) return;
    const created = await addDestination({ title, description, price, hostId: userId });
    setDestinations((prev) => [created, ...prev]);
  };

  const handleDelete = async (id: string) => {
    if (!userId) return;
    try {
      await deleteDestination(id, userId);
      setDestinations((prev) => prev.filter((d) => d.id !== id));
    } catch (e: any) {
      Alert.alert('Cannot delete', e.message ?? 'Unknown error');
    }
  };

  const handleBook = async (id: string) => {
    if (!userId) return;
    await bookDestination(id, userId);
    Alert.alert('Booked!', 'Destination has been booked.');
  };

  const logout = async () => {
    await clearUserSession();
    navigation.replace('Login');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Destinations</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="My Bookings" onPress={() => navigation.navigate('Bookings')} />
          <Button title="Logout" color="#b00020" onPress={logout} />
        </View>
      </View>
      <DestinationForm onSubmit={handleAdd} />
      <View style={{ height: 12 }} />
      <FlatList
        data={destinations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DestinationItem destination={item} canDelete={item.hostId === userId} onDelete={handleDelete} onBook={handleBook} />
        )}
        ListEmptyComponent={<Text>No destinations yet</Text>}
      />
    </View>
  );
}


