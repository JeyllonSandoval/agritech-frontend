// ============================================================================
// USE TELEMETRY HOOK
// Centralized state management for telemetry data
// ============================================================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { telemetryService } from '../services/telemetryService';
import { useTelemetryAuth } from './useTelemetryAuth';
import {
  TelemetryState,
  DeviceInfo,
  RealtimeData,
  HistoricalResponse,
  WeatherData,
  DeviceInfoData,
  DeviceCharacteristicsData,
  Group,
  TelemetryStats,
  TelemetryAlert,
  TimeRange,
  TelemetryFilters,
  GroupRealtimeResponse
} from '../types/telemetry';

interface UseTelemetryOptions {
  autoPoll?: boolean;
  pollInterval?: number;
  deviceType?: string;
}

const DEFAULT_POLL_INTERVAL = 30000; // 30 seconds

export const useTelemetry = (options: UseTelemetryOptions = {}) => {
  const {
    autoPoll = true,
    pollInterval = DEFAULT_POLL_INTERVAL,
    deviceType
  } = options;

  // Get UserID from authentication
  const { userId, isLoading: authLoading, error: authError } = useTelemetryAuth();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [state, setState] = useState<TelemetryState>({
    devices: [],
    selectedDevice: null,
    realtimeData: null,
    historicalData: null,
    weatherData: null,
    deviceInfo: null,
    deviceCharacteristics: null,
    groups: [],
    selectedGroup: null,
    loading: false,
    error: null,
    polling: false,
    lastUpdate: null
  });

  const [stats, setStats] = useState<TelemetryStats>({
    totalDevices: 0,
    activeDevices: 0,
    totalGroups: 0,
    lastDataUpdate: '',
    averageTemperature: 0,
    averageHumidity: 0,
    totalAlerts: 0,
    criticalAlerts: 0
  });

  const [alerts, setAlerts] = useState<TelemetryAlert[]>([]);

  // ===================== NUEVO ESTADO PARA GRUPOS =====================
  const [groupDevices, setGroupDevices] = useState<string[]>([]);
  const [groupDevicesInfo, setGroupDevicesInfo] = useState<Record<string, DeviceInfoData>>({});
  const [groupDevicesCharacteristics, setGroupDevicesCharacteristics] = useState<Record<string, DeviceCharacteristicsData>>({});
  const [groupRealtimeData, setGroupRealtimeData] = useState<GroupRealtimeResponse>({});

  // ===================== NUEVO: ESTADO PARA CARGA AUTOMÁTICA =====================
  const [autoLoadComplete, setAutoLoadComplete] = useState(false);
  const [autoLoadProgress, setAutoLoadProgress] = useState({
    devices: false,
    groups: false,
    initialData: false
  });

  // ============================================================================
  // REFS FOR POLLING
  // ============================================================================

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================================================
  // STATE UPDATE HELPERS
  // ============================================================================

  const updateState = useCallback((updates: Partial<TelemetryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    updateState({ loading });
  }, [updateState]);

  const setError = useCallback((error: string | null) => {
    updateState({ error });
  }, [updateState]);

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  const fetchDevices = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const filters: TelemetryFilters = { userId };
      if (deviceType) filters.deviceType = deviceType;

      const response = await telemetryService.getDevices(filters);
      
      if (response.success && response.data) {
        updateState({ 
          devices: response.data,
          error: null 
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalDevices: response.data!.length,
          activeDevices: response.data!.filter(d => d.status === 'active').length
        }));
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch devices'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, deviceType, setLoading, setError, updateState]);

  const selectDevice = useCallback((device: DeviceInfo | null) => {
    updateState({ selectedDevice: device });
  }, [updateState]);

  const fetchDeviceInfo = useCallback(async (deviceId: string) => {
    try {
      const response = await telemetryService.getDeviceInfo(deviceId);
      if (response.success && response.data) {
        updateState({ deviceInfo: response.data });
      }
    } catch (error) {
      console.error('Error fetching device info:', error);
    }
  }, [updateState]);

  const fetchDeviceCharacteristics = useCallback(async (deviceId: string) => {
    try {
      const response = await telemetryService.getDeviceCharacteristics(deviceId);
      if (response.success && response.data) {
        updateState({ deviceCharacteristics: response.data });
      }
    } catch (error) {
      console.error('Error fetching device characteristics:', error);
    }
  }, [updateState]);

  const fetchRealtimeData = useCallback(async (deviceId: string) => {
    try {
      const response = await telemetryService.getRealtimeData(deviceId);
      if (response.success && response.data) {
        updateState({ 
          realtimeData: response.data,
          lastUpdate: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  }, [updateState]);

  const fetchHistoricalData = useCallback(async (deviceId: string, startTime: string, endTime: string) => {
    try {
      const response = await telemetryService.getHistoricalData(deviceId, startTime, endTime);
      if (response.success && response.data) {
        updateState({ historicalData: response.data });
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  }, [updateState]);

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await telemetryService.getCurrentWeather(lat, lon);
      if (response.success && response.data) {
        updateState({ weatherData: response.data });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  }, [updateState]);

  // ============================================================================
  // GROUP MANAGEMENT
  // ============================================================================

  const fetchGroups = useCallback(async () => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const response = await telemetryService.getUserGroups(userId);
      
      if (response.success && response.data) {
        // Obtener la cantidad real de dispositivos y el array para cada grupo
        const groupsWithDevices = await Promise.all(
          response.data.map(async (group) => {
            try {
              const devicesResp = await telemetryService.getGroupDevices(group.DeviceGroupID);
              const deviceArray = devicesResp.success && Array.isArray(devicesResp.data)
                ? devicesResp.data
                : [];
              return { ...group, deviceArray };
            } catch {
              return { ...group, deviceArray: [] };
            }
          })
        );
        updateState({ 
          groups: groupsWithDevices,
          error: null 
        });
        // Update stats
        setStats(prev => ({
          ...prev,
          totalGroups: groupsWithDevices.length
        }));
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch groups'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, setLoading, setError, updateState]);

  const selectGroup = useCallback((group: Group | null) => {
    updateState({ selectedGroup: group });
  }, [updateState]);

  // ===================== FUNCIONES DE GRUPO =====================
  // 1. Obtener DeviceIDs del grupo
  const fetchGroupDevices = useCallback(async (groupId: string) => {
    if (!groupId) {
      console.warn('[TELEMETRY] Intento de obtener dispositivos con groupId vacío o undefined');
      setGroupDevices([]);
      return [];
    }
    try {
      console.log('🔍 [HOOK] fetchGroupDevices - Calling API for groupId:', groupId);
      const resp = await telemetryService.getGroupDevices(groupId);
      console.log('🔍 [HOOK] fetchGroupDevices - API Response:', resp);
      
      console.log('🔍 [HOOK] fetchGroupDevices - Response structure:', {
        success: resp.success,
        dataType: typeof resp.data,
        isArray: Array.isArray(resp.data),
        dataLength: resp.data?.length,
        firstItem: resp.data?.[0]
      });
      
      // Manejar diferentes formatos de respuesta
      let deviceArray: any[] = [];
      
      if (resp.success && Array.isArray(resp.data)) {
        deviceArray = resp.data;
      } else if (Array.isArray(resp)) {
        // Si la respuesta es directamente un array
        deviceArray = resp;
      } else if (resp.data && Array.isArray(resp.data)) {
        // Si la respuesta tiene data como array
        deviceArray = resp.data;
      } else if (resp && Array.isArray(resp)) {
        // Si la respuesta es directamente un array sin estructura
        deviceArray = resp;
      }
      
      console.log('🔍 [HOOK] fetchGroupDevices - Device array extracted:', deviceArray);
      
      if (deviceArray.length > 0) {
        // Extraer DeviceID de cada miembro
        const ids = deviceArray
          .map((m: any) => m.DeviceID || m.deviceId || m.id)
          .filter((id: any) => typeof id === 'string' && id.length > 0);
        console.log('🔍 [HOOK] fetchGroupDevices - Extracted device IDs:', ids);
        setGroupDevices(ids);
        return ids;
      } else {
        console.log('🔍 [HOOK] fetchGroupDevices - No valid data in response:', resp);
        setGroupDevices([]);
        return [];
      }
    } catch (error) {
      console.error('❌ [HOOK] fetchGroupDevices - Error:', error);
      setGroupDevices([]);
      return [];
    }
  }, []);

  // 2. Obtener info de cada dispositivo
  const fetchGroupDevicesInfo = useCallback(async (deviceIds: string[]) => {
    const infoObj: Record<string, DeviceInfoData> = {};
    await Promise.all(deviceIds.map(async (id) => {
      try {
        const resp = await telemetryService.getDeviceInfo(id);
        if (resp.success && resp.data) {
          infoObj[id] = resp.data;
          console.log('🔍 [HOOK] fetchGroupDevicesInfo - Device info loaded:', id, {
            deviceId: resp.data.deviceId,
            deviceName: resp.data.deviceName,
            latitude: resp.data.latitude,
            longitude: resp.data.longitude
          });
        }
      } catch (error) {
        console.error('❌ [HOOK] fetchGroupDevicesInfo - Error loading device info for:', id, error);
      }
    }));
    setGroupDevicesInfo(infoObj);
    console.log('🔍 [HOOK] fetchGroupDevicesInfo - All devices info loaded:', infoObj);
    return infoObj;
  }, []);

  // 2.1. Obtener características de cada dispositivo del grupo
  const fetchGroupDevicesCharacteristics = useCallback(async (deviceIds: string[]) => {
    const characteristicsObj: Record<string, DeviceCharacteristicsData> = {};
    await Promise.all(deviceIds.map(async (id) => {
      try {
        const resp = await telemetryService.getDeviceCharacteristics(id);
        if (resp.success && resp.data) {
          characteristicsObj[id] = resp.data;
          console.log('🔍 [HOOK] fetchGroupDevicesCharacteristics - Device characteristics loaded:', id, {
            deviceId: resp.data.deviceId,
            deviceName: resp.data.deviceName,
            ecowittInfo: resp.data.ecowittInfo ? {
              latitude: resp.data.ecowittInfo.data?.latitude,
              longitude: resp.data.ecowittInfo.data?.longitude
            } : 'No ecowittInfo'
          });
        }
      } catch (error) {
        console.error('❌ [HOOK] fetchGroupDevicesCharacteristics - Error loading characteristics for:', id, error);
      }
    }));
    setGroupDevicesCharacteristics(characteristicsObj);
    console.log('🔍 [HOOK] fetchGroupDevicesCharacteristics - All devices characteristics loaded:', characteristicsObj);
    return characteristicsObj;
  }, []);

  // 3. Obtener datos en tiempo real de todos los dispositivos del grupo
  const fetchGroupRealtimeData = useCallback(async (groupId: string) => {
    try {
      console.log('🔍 [HOOK] fetchGroupRealtimeData - Starting with groupId:', groupId);
      const resp = await telemetryService.getGroupRealtimeData(groupId);
      console.log('🔍 [HOOK] fetchGroupRealtimeData - Response:', resp);
      
      // El backend devuelve los datos directamente como GroupRealtimeResponse
      if (resp && typeof resp === 'object' && Object.keys(resp).length > 0) {
        console.log('🔍 [HOOK] fetchGroupRealtimeData - Setting group realtime data:', resp);
        setGroupRealtimeData(resp);
        return resp;
      } else {
        console.log('🔍 [HOOK] fetchGroupRealtimeData - No data, setting empty object');
        setGroupRealtimeData({});
        return {};
      }
    } catch (err) {
      console.error('❌ [HOOK] fetchGroupRealtimeData - Error:', err);
      setGroupRealtimeData({});
      return {};
    }
  }, []);

  // Obtener datos de clima para un grupo basándose en la ubicación promedio
  const fetchGroupWeatherData = useCallback(async (groupId: string, deviceIds?: string[]) => {
    try {
      // Usar los deviceIds pasados como parámetro o los del estado
      const ids = deviceIds || groupDevices;
      console.log('🔍 [HOOK] fetchGroupWeatherData - Using device IDs:', ids);
      
      if (ids.length === 0) {
        console.log('🔍 [HOOK] fetchGroupWeatherData - No devices in group');
        return;
      }

      // Usar SOLO las características ya cargadas (NO deviceInfo)
      const devicesCharacteristics = groupDevicesCharacteristics;
      
      console.log('🔍 [HOOK] fetchGroupWeatherData - Devices characteristics:', devicesCharacteristics);
      
      // Calcular ubicación promedio usando SOLO deviceCharacteristics
      const validLocations: Array<{lat: number, lon: number}> = [];

      // Buscar ubicaciones SOLO en deviceCharacteristics.ecowittInfo.data
      Object.values(devicesCharacteristics).forEach((characteristics: DeviceCharacteristicsData) => {
        const ecoWittData = characteristics?.ecowittInfo?.data;
        console.log('🔍 [HOOK] fetchGroupWeatherData - Checking characteristics:', characteristics.deviceId, 'ecowittData:', ecoWittData);
        if (ecoWittData?.latitude && ecoWittData?.longitude && 
            typeof ecoWittData.latitude === 'number' && typeof ecoWittData.longitude === 'number' &&
            !isNaN(ecoWittData.latitude) && !isNaN(ecoWittData.longitude)) {
          validLocations.push({ 
            lat: ecoWittData.latitude, 
            lon: ecoWittData.longitude 
          });
          console.log('🔍 [HOOK] fetchGroupWeatherData - Added location from characteristics:', { lat: ecoWittData.latitude, lon: ecoWittData.longitude });
        }
      });

      if (validLocations.length > 0) {
        // Calcular promedio de ubicaciones
        const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
        const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;
        
        console.log('🔍 [HOOK] fetchGroupWeatherData - Average location:', { lat: avgLat, lon: avgLon });
        
        // Obtener datos de clima para la ubicación promedio
        await fetchWeatherData(avgLat, avgLon);
      } else {
        console.log('🔍 [HOOK] fetchGroupWeatherData - No valid locations found');
      }
    } catch (error) {
      console.error('❌ [HOOK] fetchGroupWeatherData - Error:', error);
    }
  }, [groupDevices, groupDevicesCharacteristics, fetchWeatherData]);

  // ============================================================================
  // POLLING MANAGEMENT
  // ============================================================================

  const startPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    pollingRef.current = setInterval(() => {
      if (state.selectedDevice) {
        fetchRealtimeData(state.selectedDevice.DeviceID);
      } else if (state.selectedGroup) {
        fetchGroupRealtimeData(state.selectedGroup.DeviceGroupID);
      }
    }, pollInterval);

    updateState({ polling: true });
  }, [pollInterval, state.selectedDevice, state.selectedGroup, fetchRealtimeData, fetchGroupRealtimeData, updateState]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    updateState({ polling: false });
  }, [updateState]);

  // ============================================================================
  // ALERT MANAGEMENT
  // ============================================================================

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // ===================== NUEVA FUNCIÓN: CARGA AUTOMÁTICA COMPLETA =====================
  const performAutoLoad = useCallback(async () => {
    if (!userId || authLoading) return;

    setAutoLoadProgress({
      devices: false,
      groups: false,
      initialData: false
    });

    try {
      // 1. Cargar dispositivos y grupos en paralelo
      await Promise.all([
        fetchDevices(),
        fetchGroups()
      ]);

      setAutoLoadProgress(prev => ({ ...prev, devices: true, groups: true }));

      // 2. PRECARGAR DATOS DE TODOS LOS DISPOSITIVOS
      if (state.devices.length > 0) {
        
        // Precargar datos de todos los dispositivos en paralelo
        const deviceDataPromises = state.devices.map(async (device) => {
          try {
            const [realtimeData, deviceInfo, deviceCharacteristics] = await Promise.all([
              telemetryService.getRealtimeData(device.DeviceID),
              telemetryService.getDeviceInfo(device.DeviceID),
              telemetryService.getDeviceCharacteristics(device.DeviceID)
            ]);

            return {
              deviceId: device.DeviceID,
              realtimeData: realtimeData.success ? realtimeData.data : null,
              deviceInfo: deviceInfo.success ? deviceInfo.data : null,
              deviceCharacteristics: deviceCharacteristics.success ? deviceCharacteristics.data : null
            };
          } catch (error) {
            console.error(`Error precargando datos del dispositivo ${device.DeviceID}:`, error);
            return {
              deviceId: device.DeviceID,
              realtimeData: null,
              deviceInfo: null,
              deviceCharacteristics: null
            };
          }
        });

        const deviceDataResults = await Promise.all(deviceDataPromises);
        
        // Almacenar datos precargados en el estado
        const precachedData: {
          realtimeData: Record<string, RealtimeData>;
          deviceInfo: Record<string, DeviceInfoData>;
          deviceCharacteristics: Record<string, DeviceCharacteristicsData>;
        } = {
          realtimeData: {},
          deviceInfo: {},
          deviceCharacteristics: {}
        };

        deviceDataResults.forEach(result => {
          if (result.realtimeData) precachedData.realtimeData[result.deviceId] = result.realtimeData;
          if (result.deviceInfo) precachedData.deviceInfo[result.deviceId] = result.deviceInfo;
          if (result.deviceCharacteristics) precachedData.deviceCharacteristics[result.deviceId] = result.deviceCharacteristics;
        });

        // Guardar datos precargados en el estado
        updateState({
          precachedData,
          lastUpdate: new Date().toISOString()
        });

      }

      // 3. PRECARGAR DATOS DE TODOS LOS GRUPOS
      if (state.groups.length > 0) {
        
        const groupDataPromises = state.groups.map(async (group) => {
          try {
            // Obtener dispositivos del grupo
            const devicesResp = await telemetryService.getGroupDevices(group.DeviceGroupID);
            const deviceIds = devicesResp.success && Array.isArray(devicesResp.data)
              ? devicesResp.data.map((d: any) => d.DeviceID || d.deviceId || d.id).filter(Boolean)
              : [];

            if (deviceIds.length > 0) {
              // Precargar datos de todos los dispositivos del grupo
              const groupDevicePromises = deviceIds.map(async (deviceId) => {
                try {
                  const [deviceInfo, deviceCharacteristics] = await Promise.all([
                    telemetryService.getDeviceInfo(deviceId),
                    telemetryService.getDeviceCharacteristics(deviceId)
                  ]);

                  return {
                    deviceId,
                    deviceInfo: deviceInfo.success ? deviceInfo.data : null,
                    deviceCharacteristics: deviceCharacteristics.success ? deviceCharacteristics.data : null
                  };
                } catch (error) {
                  console.error(`Error precargando datos del dispositivo ${deviceId} del grupo:`, error);
                  return { deviceId, deviceInfo: null, deviceCharacteristics: null };
                }
              });

              const groupDeviceResults = await Promise.all(groupDevicePromises);
              
              // Obtener datos en tiempo real del grupo
              const groupRealtimeResp = await telemetryService.getGroupRealtimeData(group.DeviceGroupID);
              const groupRealtimeData = groupRealtimeResp && typeof groupRealtimeResp === 'object' 
                ? groupRealtimeResp 
                : {};

              return {
                groupId: group.DeviceGroupID,
                deviceIds,
                deviceInfo: groupDeviceResults.reduce<Record<string, DeviceInfoData>>((acc, result) => {
                  if (result.deviceInfo) acc[result.deviceId] = result.deviceInfo;
                  return acc;
                }, {}),
                deviceCharacteristics: groupDeviceResults.reduce<Record<string, DeviceCharacteristicsData>>((acc, result) => {
                  if (result.deviceCharacteristics) acc[result.deviceId] = result.deviceCharacteristics;
                  return acc;
                }, {}),
                realtimeData: groupRealtimeData
              };
            }
            return null;
          } catch (error) {
            console.error(`Error precargando datos del grupo ${group.DeviceGroupID}:`, error);
            return null;
          }
        });

        const groupDataResults = await Promise.all(groupDataPromises);
        
        // Almacenar datos precargados de grupos
        const precachedGroupData: {
          groupDevices: Record<string, string[]>;
          groupDevicesInfo: Record<string, Record<string, DeviceInfoData>>;
          groupDevicesCharacteristics: Record<string, Record<string, DeviceCharacteristicsData>>;
          groupRealtimeData: Record<string, GroupRealtimeResponse>;
        } = {
          groupDevices: {},
          groupDevicesInfo: {},
          groupDevicesCharacteristics: {},
          groupRealtimeData: {}
        };

        groupDataResults.forEach(result => {
          if (result) {
            precachedGroupData.groupDevices[result.groupId] = result.deviceIds;
            precachedGroupData.groupDevicesInfo[result.groupId] = result.deviceInfo;
            precachedGroupData.groupDevicesCharacteristics[result.groupId] = result.deviceCharacteristics;
            precachedGroupData.groupRealtimeData[result.groupId] = result.realtimeData;
          }
        });

        // Guardar datos precargados de grupos en el estado global
        updateState({
          precachedGroupData: precachedGroupData
        });

        // NO seleccionar automáticamente ningún grupo
        // Los datos están precargados pero no hay selección automática
      }

      setAutoLoadProgress(prev => ({ ...prev, initialData: true }));
      setAutoLoadComplete(true);
    } catch (error) {
      console.error('❌ [HOOK] Error en carga automática:', error);
      setError('Error al cargar datos automáticamente');
    }
  }, [userId, authLoading, state.devices, state.groups, fetchDevices, fetchGroups, selectDevice, selectGroup, updateState, setError]);

  // ============================================================================
  // FUNCIONES OPTIMIZADAS PARA USAR DATOS PRECARGADOS
  // ============================================================================

  // Función optimizada para seleccionar dispositivo usando datos precargados
  const selectDeviceOptimized = useCallback((device: DeviceInfo | null) => {
    if (!device) {
      updateState({ 
        selectedDevice: null,
        realtimeData: null,
        deviceInfo: null,
        deviceCharacteristics: null
      });
      return;
    }

    // Usar datos precargados si están disponibles
    const precachedData = state.precachedData;
    if (precachedData && precachedData.realtimeData[device.DeviceID]) {
      updateState({
        selectedDevice: device,
        realtimeData: precachedData.realtimeData[device.DeviceID],
        deviceInfo: precachedData.deviceInfo[device.DeviceID] || null,
        deviceCharacteristics: precachedData.deviceCharacteristics[device.DeviceID] || null
      });
    } else {
      // Fallback a carga tradicional si no hay datos precargados
      selectDevice(device);
    }
  }, [state.precachedData, updateState, selectDevice]);

  // Función optimizada para seleccionar grupo usando datos precargados
  const selectGroupOptimized = useCallback((group: Group | null) => {
    if (!group) {
      updateState({ selectedGroup: null });
      setGroupDevices([]);
      setGroupDevicesInfo({});
      setGroupDevicesCharacteristics({});
      setGroupRealtimeData({});
      return;
    }

    // Usar datos precargados si están disponibles
    const precachedGroupData = state.precachedGroupData;
    if (precachedGroupData && precachedGroupData.groupDevices[group.DeviceGroupID]) {
      updateState({ selectedGroup: group });
      
      // Cargar datos del grupo desde el caché
      setGroupDevices(precachedGroupData.groupDevices[group.DeviceGroupID] || []);
      setGroupDevicesInfo(precachedGroupData.groupDevicesInfo[group.DeviceGroupID] || {});
      setGroupDevicesCharacteristics(precachedGroupData.groupDevicesCharacteristics[group.DeviceGroupID] || {});
      setGroupRealtimeData(precachedGroupData.groupRealtimeData[group.DeviceGroupID] || {});
    } else {
      // Fallback a carga tradicional si no hay datos precargados
      updateState({ selectedGroup: group });
    }
  }, [state.precachedGroupData, updateState]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // NUEVO: Carga automática al inicializar
  useEffect(() => {
    if (userId && !authLoading && !autoLoadComplete) {
      performAutoLoad();
    }
  }, [userId, authLoading, autoLoadComplete, performAutoLoad]);

  // Auto-polling optimizado
  useEffect(() => {
    if (autoPoll && (state.selectedDevice || state.selectedGroup)) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [autoPoll, state.selectedDevice, state.selectedGroup, startPolling, stopPolling]);

  // ===================== EFECTO AL SELECCIONAR DISPOSITIVO (OPTIMIZADO) =====================
  useEffect(() => {
    // Solo cargar datos si no están precargados
    if (state.selectedDevice && state.selectedDevice.DeviceID) {
      const precachedData = state.precachedData;
      const deviceId = state.selectedDevice.DeviceID;
      
      // Si no hay datos precargados, cargar normalmente
      if (!precachedData || !precachedData.realtimeData[deviceId]) {
        setLoading(true);
        
        Promise.all([
          fetchRealtimeData(deviceId),
          fetchDeviceInfo(deviceId),
          fetchDeviceCharacteristics(deviceId)
        ]).finally(() => {
          setLoading(false);
        });
      } else {
        console.log('🚀 [HOOK] Usando datos precargados para:', state.selectedDevice.DeviceName);
        setLoading(false);
      }
    } else {
      // Limpiar datos cuando no hay dispositivo seleccionado
      updateState({ 
        realtimeData: null,
        deviceInfo: null,
        deviceCharacteristics: null
      });
    }
  }, [state.selectedDevice, state.precachedData, fetchRealtimeData, fetchDeviceInfo, fetchDeviceCharacteristics, updateState, setLoading]);

  // ===================== EFECTO AL SELECCIONAR GRUPO (OPTIMIZADO) =====================
  useEffect(() => {
    if (state.selectedGroup && state.selectedGroup.DeviceGroupID) {
      const groupId = state.selectedGroup.DeviceGroupID;
      const precachedGroupData = state.precachedGroupData;
      
      // Si no hay datos precargados, cargar normalmente
      if (!precachedGroupData || !precachedGroupData.groupDevices[groupId]) {
        console.log('📡 [HOOK] Cargando datos del grupo (no precargados):', state.selectedGroup.GroupName);
        setLoading(true);
        
        Promise.all([
          fetchGroupDevices(groupId),
          fetchGroupRealtimeData(groupId)
        ]).then(async ([deviceIds]) => {
          if (deviceIds.length > 0) {
            await Promise.all([
              fetchGroupDevicesInfo(deviceIds),
              fetchGroupDevicesCharacteristics(deviceIds)
            ]);
          }
        }).finally(() => {
          setLoading(false);
        });
      } else {
        console.log('🚀 [HOOK] Usando datos precargados para grupo:', state.selectedGroup.GroupName);
        setLoading(false);
      }
    } else {
      console.log('🔍 [HOOK] No group selected, clearing data');
      setGroupDevices([]);
      setGroupDevicesInfo({});
      setGroupDevicesCharacteristics({});
      setGroupRealtimeData({});
      updateState({ weatherData: null });
    }
  }, [state.selectedGroup, state.precachedGroupData, fetchGroupDevices, fetchGroupDevicesInfo, fetchGroupDevicesCharacteristics, fetchGroupRealtimeData, updateState, setLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================================================
  // RETURN VALUES
  // ============================================================================

  return {
    // State
    ...state,
    stats,
    alerts,
    // NUEVO: datos de grupo
    groupDevices,
    groupDevicesInfo,
    groupDevicesCharacteristics,
    groupRealtimeData,
    // NUEVO: estado de carga automática
    autoLoadComplete,
    autoLoadProgress,
    // Actions
    fetchDevices,
    selectDevice: selectDeviceOptimized, // Usar versión optimizada
    fetchDeviceInfo,
    fetchDeviceCharacteristics,
    fetchRealtimeData,
    fetchHistoricalData,
    fetchWeatherData,
    fetchGroups,
    selectGroup: selectGroupOptimized, // Usar versión optimizada
    startPolling,
    stopPolling,
    acknowledgeAlert,
    clearAlerts,
    clearError,
    setLoading,
    setError,
    // NUEVO: funciones de grupo
    fetchGroupDevices,
    fetchGroupDevicesInfo,
    fetchGroupDevicesCharacteristics,
    fetchGroupRealtimeData,
    fetchGroupWeatherData,
    // NUEVO: función de carga automática
    performAutoLoad
  };
}; 