import React, { useState } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { FestivalEvent } from './src/types';

const INITIAL_EVENTS: FestivalEvent[] = [
  { id: 'EVT-101', artist: 'Neon Waves', space: 'Main Stage', time: '22:30', status: 'CONFIRMED' },
  { id: 'EVT-102', artist: 'Midnight Session', space: 'Club Stage', time: '23:45', status: 'CONFIRMED' }
];

export default function App() {
  const [events] = useState<FestivalEvent[]>(INITIAL_EVENTS);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Festival Control</Text>
      <Text style={styles.subtitle}>
        {selected ? `Selección: ${selected}` : 'Ningún evento seleccionado'}
      </Text>

      <View style={styles.list}>
        {events.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardId}>{item.id}</Text>
            <Text style={styles.cardArtist}>{item.artist}</Text>
            <Text style={styles.cardDetails}>{item.space} · {item.time}</Text>
            <Text style={styles.cardStatus}>{item.status}</Text>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => setSelected(item.id)}
            >
              <Text style={styles.buttonText}>Seleccionar {item.id}</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginTop: 20,
    marginBottom: 6
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 20
  },
  list: {
    width: '100%',
    maxWidth: 420,
    gap: 16
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155'
  },
  cardId: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: 'bold',
    marginBottom: 4
  },
  cardArtist: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 4
  },
  cardDetails: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 4
  },
  cardStatus: {
    fontSize: 12,
    color: '#4ade80',
    fontWeight: '600',
    marginBottom: 12
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    alignItems: 'center'
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  }
});
