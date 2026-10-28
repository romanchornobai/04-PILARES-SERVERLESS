import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { FestivalEvent } from './src/types';
import { getEvents } from './src/api';

export default function App() {
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Festival Control</Text>
        <Text style={styles.subtitle}>
          {selected ? `Selección: ${selected}` : 'Ningún evento seleccionado'}
        </Text>

        <Pressable
          style={({ pressed }) => [styles.reloadButton, pressed && styles.reloadButtonPressed]}
          onPress={loadEvents}
        >
          <Text style={styles.reloadButtonText}>Recargar eventos</Text>
        </Pressable>

        {loading && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#f43f5e" />
            <Text style={styles.loadingText}>Cargando eventos desde la API...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Error de conexión</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {!loading && !error && (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0c'
  },
  scroll: {
    padding: 24,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 6,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 15,
    color: '#fb7185',
    marginBottom: 16
  },
  reloadButton: {
    backgroundColor: '#e11d48',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20
  },
  reloadButtonPressed: {
    backgroundColor: '#be123c'
  },
  reloadButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  },
  centerBox: {
    marginVertical: 40,
    alignItems: 'center'
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14
  },
  errorBox: {
    backgroundColor: '#3f1118',
    borderColor: '#e11d48',
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    width: '100%',
    maxWidth: 440,
    marginVertical: 20
  },
  errorTitle: {
    color: '#fca5a5',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4
  },
  errorMessage: {
    color: '#fecdd3',
    fontSize: 14
  },
  list: {
    width: '100%',
    maxWidth: 440,
    gap: 16
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#27272a'
  },
  cardId: {
    fontSize: 12,
    color: '#fb7185',
    fontWeight: '700',
    marginBottom: 4
  },
  cardArtist: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4
  },
  cardDetails: {
    fontSize: 14,
    color: '#a1a1aa',
    marginBottom: 6
  },
  cardStatus: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
    marginBottom: 14
  },
  button: {
    backgroundColor: '#27272a',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3f3f46'
  },
  buttonPressed: {
    backgroundColor: '#3f3f46'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14
  }
});
