// ============================================================================
// TELEMETRY HOOK
// React hook for managing telemetry state and API calls
// ============================================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { telemetryService } from '../services/telemetryService';
import { useTelemetryAuth } from './useTelemetryAuth';
import {
  DeviceInfo,
  RealtimeData,
  HistoricalResponse,
  WeatherData,
  DeviceInfoData,
  DeviceCharacteristicsData,
  Group,
  TimeRange,
  TelemetryState,
  TelemetryFilters,
  TelemetryStats,
  TelemetryAlert
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

  // ============================================================================
  // REFS FOR POLLING
  // ============================================================================

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const updateState = useCallback((updates: Partial<TelemetryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    updateState({ loading, error: loading ? null : state.error });
  }, [updateState, state.error]);

  const setError = useCallback((error: string | null) => {
    updateState({ error, loading: false });
  }, [updateState]);

  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  // ============================================================================
  // DEVICE MANAGEMENT
  // ============================================================================

  const fetchDevices = useCallback(async (filters?: TelemetryFilters) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    try {
      setLoading(true);
      const filtersWithUser: TelemetryFilters = {
        ...filters,
        userId: userId,
        deviceType: deviceType || filters?.deviceType
      };

      const response = await telemetryService.getDevices(filtersWithUser);
      
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
    
    if (device) {
      // Fetch device info and realtime data when selecting a device
      fetchDeviceInfo(device.DeviceID);
      fetchRealtimeData(device.DeviceID);
    } else {
      // Clear device-specific data when deselecting
      updateState({
        deviceInfo: null,
        deviceCharacteristics: null,
        realtimeData: null,
        historicalData: null,
        weatherData: null
      });
    }
  }, [updateState]);

  const fetchDeviceInfo = useCallback(async (deviceId: string) => {
    console.log('🔍 useTelemetry - fetchDeviceInfo iniciado para deviceId:', deviceId);
    try {
      setLoading(true);
      const response = await telemetryService.getDeviceInfo(deviceId);
      
      if (response.success && response.data) {
        updateState({ 
          deviceInfo: response.data,
          error: null 
        });
        
        // Fetch weather data for the device location
        // Adaptado para usar latitude y longitude directamente del deviceInfo
        if (response.data.latitude && response.data.longitude) {
          fetchWeatherData(response.data.latitude, response.data.longitude);
        }
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch device info'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateState]);

  const fetchDeviceCharacteristics = useCallback(async (deviceId: string) => {
    console.log('🔍 useTelemetry - fetchDeviceCharacteristics iniciado para deviceId:', deviceId);
    try {
      setLoading(true);
      const response = await telemetryService.getDeviceCharacteristics(deviceId);
      
      console.log('🔍 useTelemetry - Respuesta de getDeviceCharacteristics:', response);
      
      if (response.success && response.data) {
        console.log('🔍 useTelemetry - Data de características recibida:', response.data);
        updateState({ 
          deviceCharacteristics: response.data,
          error: null 
        });
      } else {
        console.log('🔍 useTelemetry - Error en respuesta:', response.error);
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch device characteristics'
        );
      }
    } catch (error) {
      console.log('🔍 useTelemetry - Error en fetchDeviceCharacteristics:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateState]);

  // ============================================================================
  // REALTIME DATA
  // ============================================================================

  const fetchRealtimeData = useCallback(async (deviceId: string) => {
    try {
      const response = await telemetryService.getRealtimeData(deviceId);
      
      if (response.success && response.data) {
        updateState({ 
          realtimeData: response.data,
          lastUpdate: new Date().toISOString(),
          error: null 
        });
        
        // Check for alerts based on realtime data
        checkAlerts(deviceId, response.data);
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch realtime data'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [setError, updateState]);

  const startPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    if (autoPoll && state.selectedDevice) {
      updateState({ polling: true });
      
      pollingRef.current = setInterval(() => {
        if (state.selectedDevice) {
          fetchRealtimeData(state.selectedDevice.DeviceID);
        }
      }, pollInterval);
    }
  }, [autoPoll, state.selectedDevice, pollInterval, updateState, fetchRealtimeData]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    updateState({ polling: false });
  }, [updateState]);

  // ============================================================================
  // HISTORICAL DATA
  // ============================================================================

  const fetchHistoricalData = useCallback(async (
    deviceId: string, 
    startTime: string, 
    endTime: string
  ) => {
    try {
      setLoading(true);
      const response = await telemetryService.getHistoricalData(deviceId, startTime, endTime);
      
      if (response.success && response.data) {
        updateState({ 
          historicalData: response.data,
          error: null 
        });
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch historical data'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, updateState]);

  // ============================================================================
  // WEATHER DATA
  // ============================================================================

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      // Usar getWeatherOverview en vez de getCurrentWeather
      const response = await telemetryService.getWeatherOverview(lat, lon);
      if (response.success && response.data) {
        updateState({ 
          weatherData: response.data,
          error: null 
        });
      } else {
        setError(
          Array.isArray(response.error)
            ? response.error.join('; ')
            : response.error || 'Failed to fetch weather data'
        );
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [setError, updateState]);

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
        updateState({ 
          groups: response.data,
          error: null 
        });
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalGroups: response.data!.length
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
  // ALERTS MANAGEMENT
  // ============================================================================

  const checkAlerts = useCallback((deviceId: string, data: RealtimeData) => {
    const newAlerts: TelemetryAlert[] = [];
    
    // Temperature alerts
    if (data.temperature !== undefined) {
      if (data.temperature > 35) {
        newAlerts.push({
          id: `temp-${Date.now()}`,
          deviceId,
          type: 'temperature',
          severity: 'critical',
          title: 'Temperatura Crítica',
          message: `Temperature is critically high: ${data.temperature}°C`,
          value: data.temperature,
          threshold: 35,
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      } else if (data.temperature > 30) {
        newAlerts.push({
          id: `temp-${Date.now()}`,
          deviceId,
          type: 'temperature',
          severity: 'warning',
          title: 'Temperatura Alta',
          message: `Temperature is high: ${data.temperature}°C`,
          value: data.temperature,
          threshold: 30,
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      }
    }

    // Humidity alerts
    if (data.humidity !== undefined) {
      if (data.humidity < 20) {
        newAlerts.push({
          id: `humidity-${Date.now()}`,
          deviceId,
          type: 'humidity',
          severity: 'warning',
          title: 'Humedad Baja',
          message: `Humidity is very low: ${data.humidity}%`,
          value: data.humidity,
          threshold: 20,
          timestamp: new Date().toISOString(),
          acknowledged: false
        });
      }
    }

    // Add new alerts
    if (newAlerts.length > 0) {
      setAlerts(prev => [...prev, ...newAlerts]);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalAlerts: prev.totalAlerts + newAlerts.length,
        criticalAlerts: prev.criticalAlerts + newAlerts.filter(a => a.severity === 'critical').length
      }));
    }
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, acknowledged: true }
          : alert
      )
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
    setStats(prev => ({
      ...prev,
      totalAlerts: 0,
      criticalAlerts: 0
    }));
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Initialize data fetching
  useEffect(() => {
    if (authLoading) return; // Wait for authentication to load
    
    if (authError) {
      setError(authError);
      return;
    }
    
    if (userId) {
      fetchDevices();
      fetchGroups();
    }
  }, [fetchDevices, fetchGroups, userId, authLoading, authError]);

  // Start/stop polling based on autoPoll setting
  useEffect(() => {
    if (autoPoll) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [autoPoll, startPolling, stopPolling]);

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
    setError
  };
};

export default useTelemetry; 