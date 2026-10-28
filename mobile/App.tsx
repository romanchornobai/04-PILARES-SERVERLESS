import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TextInput
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import type { Zone, ZoneStatus } from './src/types';
import {
  getZones,
  getZone,
  createZone,
  replaceZone,
  updateZoneStatus,
  deleteZone
} from './src/api';

type TabType = 'LISTADO' | 'DETALLE' | 'NUEVO' | 'EDITAR';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('LISTADO');
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [detailResult, setDetailResult] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [actionResponse, setActionResponse] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCapacity, setFormCapacity] = useState('2000');
  const [formStatus, setFormStatus] = useState<ZoneStatus>('OPEN');

  const loadAllZones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getZones();
      setZones(data);
      if (!selectedZone && data.length > 0) {
        setSelectedZone(data[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllZones();
  }, []);

  const handleSelectZone = (zone: Zone) => {
    setSelectedZone(zone);
    setFormName(zone.name);
    setFormCapacity(String(zone.capacity));
    setFormStatus(zone.status);
  };

  const handleFetchDetail = async (id: string) => {
    setBusy(true);
    setError(null);
    setLastAction(`GET /zones/${id}`);
    try {
      const data = await getZone(id);
      setSelectedZone(data);
      setDetailResult(JSON.stringify(data, null, 2));
      setActiveTab('DETALLE');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener detalle');
    } finally {
      setBusy(false);
    }
  };

  const handleCreate = async () => {
    if (!formName.trim()) {
      setError('El nombre del espacio es obligatorio');
      return;
    }
    const cap = parseInt(formCapacity, 10);
    if (isNaN(cap) || cap <= 0) {
      setError('La capacidad debe ser un número entero mayor a 0');
      return;
    }

    setBusy(true);
    setError(null);
    setLastAction('POST /zones');
    try {
      const res = await createZone({
        name: formName.trim(),
        capacity: cap,
        status: formStatus
      });
      setActionResponse(JSON.stringify(res, null, 2));
      setActiveTab('LISTADO');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear zona');
    } finally {
      setBusy(false);
    }
  };

  const handleReplace = async () => {
    if (!selectedZone) return;
    const cap = parseInt(formCapacity, 10);
    setBusy(true);
    setError(null);
    setLastAction(`PUT /zones/${selectedZone.id}`);
    try {
      const res = await replaceZone(selectedZone.id, {
        name: formName.trim() || selectedZone.name,
        capacity: isNaN(cap) ? selectedZone.capacity : cap,
        status: formStatus
      });
      setActionResponse(JSON.stringify(res, null, 2));
      setActiveTab('LISTADO');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en PUT');
    } finally {
      setBusy(false);
    }
  };

  const handlePatchStatus = async (status: ZoneStatus) => {
    if (!selectedZone) return;
    setBusy(true);
    setError(null);
    setLastAction(`PATCH /zones/${selectedZone.id} -> ${status}`);
    try {
      const res = await updateZoneStatus(selectedZone.id, status);
      setActionResponse(JSON.stringify(res, null, 2));
      setSelectedZone((prev) => (prev ? { ...prev, status } : null));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en PATCH');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedZone) return;
    setBusy(true);
    setError(null);
    setLastAction(`DELETE /zones/${selectedZone.id}`);
    try {
      const res = await deleteZone(selectedZone.id);
      setActionResponse(JSON.stringify(res, null, 2));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error en DELETE');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header de la Aplicación */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.brandTitle}>VENUE CONTROL</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <Text style={styles.headerSubtitle}>
            FESTIVAL OPERATIONS · CONTROL DE ESPACIOS
          </Text>
        </View>

        {/* Barra de Navegación / Vistas */}
        <View style={styles.tabBar}>
          {(['LISTADO', 'DETALLE', 'NUEVO', 'EDITAR'] as TabType[]).map((tab) => (
            <Pressable
              key={tab}
              style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
              onPress={() => {
                setActiveTab(tab);
                setError(null);
              }}
            >
              <Text
                style={[styles.tabButtonText, activeTab === tab && styles.tabButtonTextActive]}
              >
                {tab}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Indicador de proceso asíncrono */}
        {busy && (
          <View style={styles.busyRow}>
            <ActivityIndicator size="small" color="#10b981" />
            <Text style={styles.busyText}>Procesando llamada HTTP ({lastAction})...</Text>
          </View>
        )}

        {/* Alerta de Error */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Error en la operación</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {/* Mensaje / Respuesta de la API */}
        {actionResponse && (
          <View style={styles.responseBox}>
            <View style={styles.responseBoxHeader}>
              <Text style={styles.responseTitle}>Respuesta del Servidor ({lastAction}):</Text>
              <Pressable onPress={() => setActionResponse(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>
            <Text style={styles.responseCode}>{actionResponse}</Text>
          </View>
        )}

        {/* VISTA 1: LISTADO */}
        {activeTab === 'LISTADO' && (
          <View style={styles.contentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Zonas del Recinto ({zones.length})</Text>
              <Pressable
                disabled={busy || loading}
                style={[styles.smallBtn, (busy || loading) && styles.btnDisabled]}
                onPress={loadAllZones}
              >
                <Text style={styles.smallBtnText}>↻ Recargar</Text>
              </Pressable>
            </View>

            {loading ? (
              <View style={styles.centerBox}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Cargando espacios desde AWS...</Text>
              </View>
            ) : (
              <View style={styles.zoneGrid}>
                {zones.map((zone) => {
                  const isSelected = selectedZone?.id === zone.id;
                  return (
                    <View
                      key={zone.id}
                      style={[styles.zoneCard, isSelected && styles.zoneCardSelected]}
                    >
                      <View style={styles.cardTop}>
                        <Text style={styles.zoneId}>{zone.id}</Text>
                        <View
                          style={[
                            styles.statusPill,
                            zone.status === 'OPEN'
                              ? styles.statusOpen
                              : zone.status === 'FULL'
                              ? styles.statusFull
                              : styles.statusClosed
                          ]}
                        >
                          <Text style={styles.statusPillText}>{zone.status}</Text>
                        </View>
                      </View>

                      <Text style={styles.zoneName}>{zone.name}</Text>
                      <Text style={styles.zoneCap}>
                        {zone.capacity.toLocaleString()} PERSONAS
                      </Text>

                      <View style={styles.cardActionsRow}>
                        <Pressable
                          style={[styles.cardBtn, isSelected && styles.cardBtnActive]}
                          onPress={() => handleSelectZone(zone)}
                        >
                          <Text style={styles.cardBtnText}>
                            {isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                          </Text>
                        </Pressable>
                        <Pressable
                          style={styles.cardBtnSecondary}
                          onPress={() => handleFetchDetail(zone.id)}
                        >
                          <Text style={styles.cardBtnSecondaryText}>Ver Detalle</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Acciones directas sobre la zona seleccionada */}
            {selectedZone && (
              <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>
                  Acciones sobre {selectedZone.id} ({selectedZone.name})
                </Text>
                <View style={styles.quickButtons}>
                  <Pressable
                    disabled={busy}
                    style={[styles.statusBtn, styles.statusBtnOpen]}
                    onPress={() => handlePatchStatus('OPEN')}
                  >
                    <Text style={styles.statusBtnText}>PATCH OPEN</Text>
                  </Pressable>
                  <Pressable
                    disabled={busy}
                    style={[styles.statusBtn, styles.statusBtnFull]}
                    onPress={() => handlePatchStatus('FULL')}
                  >
                    <Text style={styles.statusBtnText}>PATCH FULL</Text>
                  </Pressable>
                  <Pressable
                    disabled={busy}
                    style={[styles.statusBtn, styles.statusBtnClosed]}
                    onPress={() => handlePatchStatus('CLOSED')}
                  >
                    <Text style={styles.statusBtnText}>PATCH CLOSED</Text>
                  </Pressable>
                  <Pressable
                    disabled={busy}
                    style={[styles.statusBtn, styles.statusBtnDelete]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.statusBtnText}>DELETE</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        {/* VISTA 2: DETALLE */}
        {activeTab === 'DETALLE' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>
              Detalle de Espacio {selectedZone ? selectedZone.id : ''}
            </Text>
            {selectedZone ? (
              <View style={styles.detailCard}>
                <Text style={styles.detailId}>{selectedZone.id}</Text>
                <Text style={styles.detailName}>{selectedZone.name}</Text>
                <Text style={styles.detailItem}>
                  Capacidad máxima: <Text style={styles.bold}>{selectedZone.capacity}</Text>
                </Text>
                <Text style={styles.detailItem}>
                  Estado operativo: <Text style={styles.bold}>{selectedZone.status}</Text>
                </Text>
                {detailResult && (
                  <View style={styles.rawJsonBox}>
                    <Text style={styles.rawJsonLabel}>Payload GET /zones/{'{id}'}:</Text>
                    <Text style={styles.rawJsonText}>{detailResult}</Text>
                  </View>
                )}
              </View>
            ) : (
              <Text style={styles.emptyNotice}>No hay ninguna zona seleccionada.</Text>
            )}
          </View>
        )}

        {/* VISTA 3: NUEVO */}
        {activeTab === 'NUEVO' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Crear Nuevo Espacio (POST /zones)</Text>
            <View style={styles.formContainer}>
              <Text style={styles.inputLabel}>Nombre de la Zona</Text>
              <TextInput
                style={styles.textInput}
                value={formName}
                onChangeText={setFormName}
                placeholder="Ej. VIP Lounge, Escenario Norte..."
                placeholderTextColor="#64748b"
              />

              <Text style={styles.inputLabel}>Aforo / Capacidad</Text>
              <TextInput
                style={styles.textInput}
                value={formCapacity}
                onChangeText={setFormCapacity}
                keyboardType="numeric"
                placeholder="Ej. 1500"
                placeholderTextColor="#64748b"
              />

              <Text style={styles.inputLabel}>Estado Inicial</Text>
              <View style={styles.statusSelectRow}>
                {(['OPEN', 'FULL', 'CLOSED'] as ZoneStatus[]).map((st) => (
                  <Pressable
                    key={st}
                    style={[styles.statusSelectBtn, formStatus === st && styles.statusSelectBtnActive]}
                    onPress={() => setFormStatus(st)}
                  >
                    <Text
                      style={[styles.statusSelectText, formStatus === st && styles.statusSelectTextActive]}
                    >
                      {st}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable
                disabled={busy}
                style={[styles.submitButton, busy && styles.btnDisabled]}
                onPress={handleCreate}
              >
                <Text style={styles.submitButtonText}>＋ Crear Espacio (POST)</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* VISTA 4: EDITAR */}
        {activeTab === 'EDITAR' && (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>
              Sustituir Espacio Completo (PUT /zones/{selectedZone?.id ?? ''})
            </Text>
            {selectedZone ? (
              <View style={styles.formContainer}>
                <Text style={styles.inputLabel}>Nombre Actualizado</Text>
                <TextInput
                  style={styles.textInput}
                  value={formName}
                  onChangeText={setFormName}
                  placeholderTextColor="#64748b"
                />

                <Text style={styles.inputLabel}>Capacidad Actualizada</Text>
                <TextInput
                  style={styles.textInput}
                  value={formCapacity}
                  onChangeText={setFormCapacity}
                  keyboardType="numeric"
                  placeholderTextColor="#64748b"
                />

                <Text style={styles.inputLabel}>Estado Actualizado</Text>
                <View style={styles.statusSelectRow}>
                  {(['OPEN', 'FULL', 'CLOSED'] as ZoneStatus[]).map((st) => (
                    <Pressable
                      key={st}
                      style={[styles.statusSelectBtn, formStatus === st && styles.statusSelectBtnActive]}
                      onPress={() => setFormStatus(st)}
                    >
                      <Text
                        style={[styles.statusSelectText, formStatus === st && styles.statusSelectTextActive]}
                      >
                        {st}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable
                  disabled={busy}
                  style={[styles.submitButton, styles.putSubmit, busy && styles.btnDisabled]}
                  onPress={handleReplace}
                >
                  <Text style={styles.submitButtonText}>Guardar Cambios (PUT)</Text>
                </Pressable>
              </View>
            ) : (
              <Text style={styles.emptyNotice}>Selecciona una zona antes de editar.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0f1d'
  },
  scroll: {
    padding: 20,
    alignItems: 'center'
  },
  header: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 20
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f8fafc',
    letterSpacing: 1
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981'
  },
  liveText: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '800'
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.5
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 4,
    marginBottom: 20
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6
  },
  tabButtonActive: {
    backgroundColor: '#0f172a'
  },
  tabButtonText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12
  },
  tabButtonTextActive: {
    color: '#38bdf8'
  },
  busyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14
  },
  busyText: {
    color: '#34d399',
    fontSize: 13,
    fontWeight: '600'
  },
  errorBox: {
    backgroundColor: '#450a0a',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    maxWidth: 600,
    marginBottom: 16
  },
  errorTitle: {
    color: '#fca5a5',
    fontWeight: 'bold',
    fontSize: 13
  },
  errorMessage: {
    color: '#fee2e2',
    fontSize: 12,
    marginTop: 2
  },
  responseBox: {
    backgroundColor: '#064e3b',
    borderColor: '#10b981',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    width: '100%',
    maxWidth: 600,
    marginBottom: 16
  },
  responseBoxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  responseTitle: {
    color: '#a7f3d0',
    fontSize: 12,
    fontWeight: '800'
  },
  closeBtn: {
    color: '#a7f3d0',
    fontSize: 14,
    fontWeight: 'bold'
  },
  responseCode: {
    color: '#ecfdf5',
    fontFamily: 'monospace',
    fontSize: 11
  },
  contentSection: {
    width: '100%',
    maxWidth: 600
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f1f5f9'
  },
  smallBtn: {
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6
  },
  smallBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700'
  },
  centerBox: {
    marginVertical: 40,
    alignItems: 'center'
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 13
  },
  zoneGrid: {
    gap: 12
  },
  zoneCard: {
    backgroundColor: '#111827',
    borderWidth: 1,
    borderColor: '#1f2937',
    borderRadius: 10,
    padding: 16
  },
  zoneCardSelected: {
    borderColor: '#38bdf8',
    backgroundColor: '#162032'
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  zoneId: {
    fontSize: 12,
    color: '#38bdf8',
    fontWeight: '800'
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  statusOpen: { backgroundColor: '#064e3b' },
  statusFull: { backgroundColor: '#78350f' },
  statusClosed: { backgroundColor: '#7f1d1d' },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#f8fafc'
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f9fafb',
    marginBottom: 4
  },
  zoneCap: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 12,
    letterSpacing: 0.5
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8
  },
  cardBtn: {
    flex: 1,
    backgroundColor: '#1f2937',
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  cardBtnActive: {
    backgroundColor: '#0284c7'
  },
  cardBtnText: {
    color: '#f8fafc',
    fontSize: 12,
    fontWeight: '700'
  },
  cardBtnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 6,
    alignItems: 'center'
  },
  cardBtnSecondaryText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600'
  },
  quickActionsContainer: {
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    padding: 14
  },
  quickActionsTitle: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 10
  },
  quickButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  statusBtn: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center'
  },
  statusBtnOpen: { backgroundColor: '#059669' },
  statusBtnFull: { backgroundColor: '#d97706' },
  statusBtnClosed: { backgroundColor: '#dc2626' },
  statusBtnDelete: { backgroundColor: '#475569' },
  statusBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800'
  },
  detailCard: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  detailId: {
    fontSize: 14,
    color: '#38bdf8',
    fontWeight: '800',
    marginBottom: 4
  },
  detailName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 12
  },
  detailItem: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 6
  },
  bold: {
    color: '#f1f5f9',
    fontWeight: 'bold'
  },
  rawJsonBox: {
    marginTop: 16,
    backgroundColor: '#090d16',
    borderRadius: 6,
    padding: 12
  },
  rawJsonLabel: {
    fontSize: 11,
    color: '#38bdf8',
    fontWeight: '700',
    marginBottom: 6
  },
  rawJsonText: {
    fontFamily: 'monospace',
    color: '#cbd5e1',
    fontSize: 12
  },
  formContainer: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  inputLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
    marginBottom: 6
  },
  textInput: {
    backgroundColor: '#1f2937',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f8fafc',
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#374151'
  },
  statusSelectRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18
  },
  statusSelectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151'
  },
  statusSelectBtnActive: {
    backgroundColor: '#0284c7',
    borderColor: '#38bdf8'
  },
  statusSelectText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12
  },
  statusSelectTextActive: {
    color: '#ffffff'
  },
  submitButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center'
  },
  putSubmit: {
    backgroundColor: '#2563eb'
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14
  },
  btnDisabled: {
    opacity: 0.5
  },
  emptyNotice: {
    color: '#64748b',
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14
  }
});
