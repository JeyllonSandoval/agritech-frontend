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

      if (validLocations.length === 0) {
        console.log('🔍 [HOOK] fetchGroupWeatherData - No devices with location data in characteristics');
        return;
      }

      const avgLat = validLocations.reduce((sum, loc) => sum + loc.lat, 0) / validLocations.length;
      const avgLon = validLocations.reduce((sum, loc) => sum + loc.lon, 0) / validLocations.length;

      console.log('🔍 [HOOK] fetchGroupWeatherData - Average location:', { avgLat, avgLon });
      console.log('🔍 [HOOK] fetchGroupWeatherData - Valid locations found:', validLocations.length);

      // Obtener datos de clima para la ubicación promedio
      await fetchWeatherData(avgLat, avgLon);
    } catch (err) {
      console.error('❌ [HOOK] fetchGroupWeatherData - Error:', err);
    }
  }, [groupDevices, groupDevicesCharacteristics, fetchWeatherData]);

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

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Initial data fetch
  useEffect(() => {
    if (userId && !authLoading) {
      fetchDevices();
      fetchGroups();
    }
  }, [userId, authLoading, fetchDevices, fetchGroups]);

  // Auto-polling
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

  // ===================== EFECTO AL SELECCIONAR DISPOSITIVO =====================
  useEffect(() => {
    const loadDeviceData = async () => {
      if (state.selectedDevice && state.selectedDevice.DeviceID) {
        // Mostrar loading mientras se cargan los datos del dispositivo
        setLoading(true);
        try {
          await Promise.all([
            fetchRealtimeData(state.selectedDevice.DeviceID),
            fetchDeviceInfo(state.selectedDevice.DeviceID),
            fetchDeviceCharacteristics(state.selectedDevice.DeviceID)
          ]);
        } catch (error) {
          console.error('Error loading device data:', error);
          setError('Error al cargar datos del dispositivo');
        } finally {
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
    };
    loadDeviceData();
    // eslint-disable-next-line
  }, [state.selectedDevice]);

  // ===================== EFECTO AL SELECCIONAR GRUPO =====================
  useEffect(() => {
    const loadGroupData = async () => {
      console.log('🔍 [HOOK] Group selection effect triggered:', {
        selectedGroup: state.selectedGroup?.GroupName,
        groupId: state.selectedGroup?.DeviceGroupID
      });
      
      if (state.selectedGroup && state.selectedGroup.DeviceGroupID) {
        // Mostrar loading mientras se cargan los datos del grupo
        setLoading(true);
        try {
          console.log('🔍 [HOOK] Loading group data for:', state.selectedGroup.GroupName);
          const ids = await fetchGroupDevices(state.selectedGroup.DeviceGroupID);
          console.log('🔍 [HOOK] Group devices loaded:', ids);
          
          // Primero cargar la información de dispositivos y características
          console.log('🔍 [HOOK] Loading device info and characteristics...');
          await Promise.all([
            fetchGroupDevicesInfo(ids),
            fetchGroupDevicesCharacteristics(ids)
          ]);
          
          // Luego cargar datos en tiempo real y clima (que dependen de la info de dispositivos)
          console.log('🔍 [HOOK] Loading realtime data and weather...');
          await Promise.all([
            fetchGroupRealtimeData(state.selectedGroup.DeviceGroupID),
            fetchGroupWeatherData(state.selectedGroup.DeviceGroupID, ids)
          ]);
          console.log('🔍 [HOOK] Group data loading completed');
        } catch (error) {
          console.error('Error loading group data:', error);
          setError('Error al cargar datos del grupo');
        } finally {
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
    };
    loadGroupData();
    // eslint-disable-next-line
  }, [state.selectedGroup]);

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
    // Actions
    fetchDevices,
    selectDevice,
    fetchDeviceInfo,
    fetchDeviceCharacteristics,
    fetchRealtimeData,
    fetchHistoricalData,
    fetchWeatherData,
    fetchGroups,
    selectGroup,
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
    fetchGroupWeatherData
  };
}; 