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
      const resp = await telemetryService.getGroupDevices(groupId);
      if (resp.success && Array.isArray(resp.data)) {
        // CORREGIDO: extraer DeviceID de cada miembro
        const ids = resp.data
          .map((m: any) => m.DeviceID)
          .filter((id: any) => typeof id === 'string' && id.length > 0);
        setGroupDevices(ids);
        return ids;
      } else {
        setGroupDevices([]);
        return [];
      }
    } catch {
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
        }
      } catch {}
    }));
    setGroupDevicesInfo(infoObj);
    return infoObj;
  }, []);

  // 3. Obtener datos en tiempo real de todos los dispositivos del grupo
  const fetchGroupRealtimeData = useCallback(async (groupId: string) => {
    try {
      const resp = await telemetryService.getGroupRealtimeData(groupId);
      if (resp && resp.success && resp.data) {
        setGroupRealtimeData(resp.data);
        return resp.data;
      } else {
        setGroupRealtimeData({});
        return {};
      }
    } catch (err) {
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

  // ===================== EFECTO AL SELECCIONAR GRUPO =====================
  useEffect(() => {
    const loadGroupData = async () => {
      if (state.selectedGroup && state.selectedGroup.DeviceGroupID) {
        const ids = await fetchGroupDevices(state.selectedGroup.DeviceGroupID);
        await fetchGroupDevicesInfo(ids);
        await fetchGroupRealtimeData(state.selectedGroup.DeviceGroupID);
      } else {
        setGroupDevices([]);
        setGroupDevicesInfo({});
        setGroupRealtimeData({});
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
    fetchGroupRealtimeData
  };
}; 