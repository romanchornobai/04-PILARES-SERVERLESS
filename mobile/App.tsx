import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { FestivalEvent, EventInput, EventStatus } from './src/types';
import { getEvents, createEvent, replaceEvent, updateEvent, deleteEvent } from './src/api';

export default function App() {
  const [events, setEvents] = useState<FestivalEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>('EVT-101');
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const run = async (label: string, task: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    setLastAction(label);
    try {
      const res = await task();
      setResult(JSON.stringify(res, null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en la operación');
      setResult(null);
    } finally {
      setBusy(false);
    }
  };

  const handlePost = () => {
    const input: EventInput = {
      artist: 'Solar Echoes',
      space: 'Sunset Dome',
      time: '20:15',
      status: 'CONFIRMED'
    };
    run('POST /events', () => createEvent(input));
  };

  const handlePut = () => {
    const targetId = selected || 'EVT-101';
    const input: EventInput = {
      artist: 'Neon Waves (Edición Especial)',
      space: 'Main Stage',
      time: '23:00',
      status: 'CONFIRMED'
    };
    run(`PUT /events/${targetId}`, () => replaceEvent(targetId, input));
  };

  const handlePatch = (status: EventStatus = 'CANCELLED') => {
    const targetId = selected || 'EVT-101';
    run(`PATCH /events/${targetId}`, () => updateEvent(targetId, status));
  };

  const handleDelete = () => {
    const targetId = selected || 'EVT-101';
    run(`DELETE /events/${targetId}`, () => deleteEvent(targetId));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Festival Control</Text>
        <Text style={styles.subtitle}>
          {selected ? `Selección: ${selected}` : 'Ningún evento seleccionado'}
        </Text>

        <View style={styles.actionsBox}>
          <Text style={styles.sectionTitle}>Acciones sobre la API</Text>
          <View style={styles.actionButtonsRow}>
            <Pressable
              disabled={busy || loading}
              style={({ pressed }) => [styles.actionButton, styles.postButton, (busy || loading) && styles.buttonDisabled, pressed && styles.buttonPressed]}
              onPress={handlePost}
            >
              <Text style={styles.actionButtonText}>POST Nuevo</Text>
            </Pressable>

            <Pressable
              disabled={busy || loading}
              style={({ pressed }) => [styles.actionButton, styles.putButton, (busy || loading) && styles.buttonDisabled, pressed && styles.buttonPressed]}
              onPress={handlePut}
            >
              <Text style={styles.actionButtonText}>PUT {selected}</Text>
            </Pressable>

            <Pressable
              disabled={busy || loading}
              style={({ pressed }) => [styles.actionButton, styles.patchButton, (busy || loading) && styles.buttonDisabled, pressed && styles.buttonPressed]}
              onPress={() => handlePatch('CANCELLED')}
            >
              <Text style={styles.actionButtonText}>PATCH {selected}</Text>
            </Pressable>

            <Pressable
              disabled={busy || loading}
              style={({ pressed }) => [styles.actionButton, styles.deleteButton, (busy || loading) && styles.buttonDisabled, pressed && styles.buttonPressed]}
              onPress={handleDelete}
            >
              <Text style={styles.actionButtonText}>DELETE {selected}</Text>
            </Pressable>
          </View>

          <Pressable
            disabled={busy || loading}
            style={({ pressed }) => [styles.reloadButton, (busy || loading) && styles.buttonDisabled, pressed && styles.buttonPressed]}
            onPress={loadEvents}
          >
            <Text style={styles.reloadButtonText}>GET Recargar lista</Text>
          </Pressable>
        </View>

        {busy && (
          <View style={styles.busyRow}>
            <ActivityIndicator size="small" color="#fb7185" />
            <Text style={styles.busyText}>Enviando petición HTTP...</Text>
          </View>
        )}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultTitle}>Respuesta del servidor ({lastAction}):</Text>
            <Text style={styles.resultContent}>{result}</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Error en la operación</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#f43f5e" />
            <Text style={styles.loadingText}>Cargando eventos desde la API...</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {events.map((item) => (
              <View key={item.id} style={[styles.card, selected === item.id && styles.cardSelected]}>
                <Text style={styles.cardId}>{item.id}</Text>
                <Text style={styles.cardArtist}>{item.artist}</Text>
                <Text style={styles.cardDetails}>{item.space} · {item.time}</Text>
                <Text style={styles.cardStatus}>{item.status}</Text>
                <Pressable
                  style={({ pressed }) => [styles.selectButton, pressed && styles.buttonPressed]}
                  onPress={() => setSelected(item.id)}
                >
                  <Text style={styles.selectButtonText}>Seleccionar {item.id}</Text>
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
    padding: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 4
  },
  subtitle: {
    fontSize: 15,
    color: '#fb7185',
    marginBottom: 16
  },
  actionsBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#27272a'
  },
  sectionTitle: {
    color: '#e4e4e7',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12
  },
  actionButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  actionButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    flexGrow: 1
  },
  actionButtonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12
  },
  postButton: { backgroundColor: '#10b981' },
  putButton: { backgroundColor: '#3b82f6' },
  patchButton: { backgroundColor: '#f59e0b' },
  deleteButton: { backgroundColor: '#ef4444' },
  reloadButton: {
    backgroundColor: '#27272a',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3f3f46'
  },
  reloadButtonText: {
    color: '#e4e4e7',
    fontWeight: '600',
    fontSize: 13
  },
  buttonDisabled: {
    opacity: 0.4
  },
  buttonPressed: {
    opacity: 0.75
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14
  },
  busyText: {
    color: '#fb7185',
    fontSize: 13
  },
  resultBox: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#092b1e',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    marginBottom: 16
  },
  resultTitle: {
    color: '#6ee7b7',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6
  },
  resultContent: {
    color: '#ecfdf5',
    fontFamily: 'monospace',
    fontSize: 12
  },
  errorBox: {
    backgroundColor: '#3f1118',
    borderColor: '#e11d48',
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    width: '100%',
    maxWidth: 480,
    marginBottom: 16
  },
  errorTitle: {
    color: '#fca5a5',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4
  },
  errorMessage: {
    color: '#fecdd3',
    fontSize: 13
  },
  centerBox: {
    marginVertical: 30,
    alignItems: 'center'
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 14
  },
  list: {
    width: '100%',
    maxWidth: 480,
    gap: 14
  },
  card: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#27272a'
  },
  cardSelected: {
    borderColor: '#fb7185'
  },
  cardId: {
    fontSize: 12,
    color: '#fb7185',
    fontWeight: '700',
    marginBottom: 4
  },
  cardArtist: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4
  },
  cardDetails: {
    fontSize: 13,
    color: '#a1a1aa',
    marginBottom: 6
  },
  cardStatus: {
    fontSize: 12,
    color: '#34d399',
    fontWeight: '600',
    marginBottom: 12
  },
  selectButton: {
    backgroundColor: '#27272a',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  selectButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13
  }
});
