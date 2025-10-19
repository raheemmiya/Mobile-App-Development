import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

type Props = {
  onSubmit: (title: string, description: string, price: number) => void;
};

export default function DestinationForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  return (
    <View style={{ gap: 8 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={{ borderWidth: 1, padding: 8 }} />
      <TextInput placeholder="Price" keyboardType="numeric" value={price} onChangeText={setPrice} style={{ borderWidth: 1, padding: 8 }} />
      <Button title="Add Destination" onPress={() => onSubmit(title, description, Number(price) || 0)} />
    </View>
  );
}


