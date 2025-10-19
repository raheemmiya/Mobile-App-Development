import React from 'react';
import { View, Text, Button } from 'react-native';
import type { Destination } from '../services/db';

type Props = {
  destination: Destination;
  canDelete: boolean;
  onDelete: (id: string) => void;
  onBook: (id: string) => void;
};

export default function DestinationItem({ destination, canDelete, onDelete, onBook }: Props) {
  return (
    <View style={{ borderWidth: 1, padding: 12, borderRadius: 6, marginBottom: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: '600' }}>{destination.title}</Text>
      <Text>{destination.description}</Text>
      <Text>${destination.price.toFixed(2)}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
        <Button title="Book" onPress={() => onBook(destination.id)} />
        {canDelete ? <Button title="Delete" color="#b00020" onPress={() => onDelete(destination.id)} /> : null}
      </View>
    </View>
  );
}


