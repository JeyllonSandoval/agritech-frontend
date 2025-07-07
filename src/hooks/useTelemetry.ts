/**
 * Hook personalizado para manejar datos de telemetría en tiempo real
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  TelemetryData, 
  Device, 
  Sensor, 
  SensorStatus, 
  SensorType, 
  LoadingState,
  TelemetryConfig,
  TelemetryAlert,
  TelemetryStats
} from '@/types/telemetry';
import { getTelemetryService } from '@/services/telemetryService';
import { getMockTelemetryService } from '@/services/mockTelemetryService';
import { RealtimeResponse } from '@/types/telemetry';

interface UseTelemetryOptions {
  devices: string[]; // MAC addresses de los dispositivos
  updateInterval?: number; // Intervalo de actualización en ms
  autoStart?: boolean; // Si debe empezar automáticamente
  useMock?: boolean; // Si debe usar el servicio mock
  onError?: (error: string) => void;
  onDataUpdate?: (data: TelemetryData) => void;
}

interface UseTelemetryReturn {
  data: TelemetryData | null;
  loadingState: LoadingState;
  error: string | null;
  isRunning: boolean;
  stats: TelemetryStats;
  alerts: TelemetryAlert[];
  startMonitoring: () => void;
  stopMonitoring: () => void;
  refreshData: () => Promise<void>;
  acknowledgeAlert: (alertId: string) => void;
  clearError: () => void;
}

export function useTelemetry(options: UseTelemetryOptions): UseTelemetryReturn {
  const {
    devices,
    updateInterval = 30000, // 30 segundos por defecto
    autoStart = true,
    useMock = false,
    onError,
    onDataUpdate
  } = options;

  // Estados
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>([]);
  const [stats, setStats] = useState<TelemetryStats>({
    totalReadings: 0,
    averageResponseTime: 0,
    errorRate: 0,
    last24Hours: {
      readings: 0,
      errors: 0,
      alerts: 0
    }
  });

  // Refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastUpdateRef = useRef<Date | null>(null);

  // Función para procesar datos de sensores
  const processSensorData = useCallback((realtimeData: RealtimeResponse): Sensor[] => {
    const sensors: Sensor[] = [];
    const data = realtimeData.data;

    // Procesar temperatura exterior
    if (data.outdoor?.temperature) {
      sensors.push({
        id: 'outdoor_temperature',
        name: 'Temperatura Exterior',
        type: SensorType.TEMPERATURE,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.outdoor.temperature),
        unit: '°C',
        lastUpdate: new Date(),
        location: 'Exterior'
      });
    }

    // Procesar humedad exterior
    if (data.outdoor?.humidity) {
      sensors.push({
        id: 'outdoor_humidity',
        name: 'Humedad Exterior',
        type: SensorType.HUMIDITY,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.outdoor.humidity),
        unit: '%',
        lastUpdate: new Date(),
        location: 'Exterior'
      });
    }

    // Procesar temperatura interior
    if (data.indoor?.temperature) {
      sensors.push({
        id: 'indoor_temperature',
        name: 'Temperatura Interior',
        type: SensorType.TEMPERATURE,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.indoor.temperature),
        unit: '°C',
        lastUpdate: new Date(),
        location: 'Interior'
      });
    }

    // Procesar humedad interior
    if (data.indoor?.humidity) {
      sensors.push({
        id: 'indoor_humidity',
        name: 'Humedad Interior',
        type: SensorType.HUMIDITY,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.indoor.humidity),
        unit: '%',
        lastUpdate: new Date(),
        location: 'Interior'
      });
    }

    // Procesar presión
    if (data.pressure?.relative) {
      sensors.push({
        id: 'pressure',
        name: 'Presión Atmosférica',
        type: SensorType.PRESSURE,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.pressure.relative),
        unit: 'hPa',
        lastUpdate: new Date(),
        location: 'Exterior'
      });
    }

    // Procesar viento
    if (data.wind?.wind_speed) {
      sensors.push({
        id: 'wind_speed',
        name: 'Velocidad del Viento',
        type: SensorType.WIND,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.wind.wind_speed),
        unit: 'km/h',
        lastUpdate: new Date(),
        location: 'Exterior'
      });
    }

    // Procesar lluvia
    if (data.rainfall?.rain_rate) {
      sensors.push({
        id: 'rain_rate',
        name: 'Intensidad de Lluvia',
        type: SensorType.RAINFALL,
        status: SensorStatus.ONLINE,
        value: parseFloat(data.rainfall.rain_rate),
        unit: 'mm/h',
        lastUpdate: new Date(),
        location: 'Exterior'
      });
    }

    // Procesar sensores de suelo
    for (let i = 1; i <= 16; i++) {
      const soilKey = `soil_ch${i}` as keyof typeof data;
      const soilData = data[soilKey];
      
      if (soilData?.soilmoisture) {
        sensors.push({
          id: `soil_moisture_${i}`,
          name: `Humedad del Suelo ${i}`,
          type: SensorType.SOIL,
          status: SensorStatus.ONLINE,
          value: parseFloat(soilData.soilmoisture),
          unit: '%',
          lastUpdate: new Date(),
          location: `Suelo ${i}`
        });
      }
    }

    // Procesar sensores de temperatura adicionales
    for (let i = 1; i <= 8; i++) {
      const tempKey = `temp_ch${i}` as keyof typeof data;
      const tempData = data[tempKey];
      
      if (tempData?.temperature) {
        sensors.push({
          id: `temperature_${i}`,
          name: `Temperatura ${i}`,
          type: SensorType.TEMPERATURE,
          status: SensorStatus.ONLINE,
          value: parseFloat(tempData.temperature),
          unit: '°C',
          lastUpdate: new Date(),
          location: `Sensor ${i}`
        });
      }
    }

    return sensors;
  }, []);

  // Función para obtener datos de telemetría
  const fetchTelemetryData = useCallback(async (): Promise<TelemetryData> => {
    const startTime = Date.now();
    const telemetryService = useMock ? getMockTelemetryService() : getTelemetryService();

    try {
      // Obtener datos en tiempo real de todos los dispositivos
      const realtimeResponses = await telemetryService.getMultipleDevicesRealtimeData(devices);
      
      // Procesar cada dispositivo
      const processedDevices: Device[] = realtimeResponses.map((response, index) => {
        const mac = devices[index];
        const sensors = processSensorData(response);
        
        return {
          id: mac,
          name: `Dispositivo ${mac.slice(-6)}`, // Usar los últimos 6 caracteres del MAC
          mac,
          status: response.code === 0 ? SensorStatus.ONLINE : SensorStatus.OFFLINE,
          sensors,
          lastUpdate: new Date(),
          location: 'Campo Principal'
        };
      });

      const totalDevices = processedDevices.length;
      const onlineDevices = processedDevices.filter(d => d.status === SensorStatus.ONLINE).length;
      const offlineDevices = totalDevices - onlineDevices;

      const telemetryData: TelemetryData = {
        devices: processedDevices,
        timestamp: new Date(),
        totalDevices,
        onlineDevices,
        offlineDevices
      };

      // Actualizar estadísticas
      const responseTime = Date.now() - startTime;
      setStats(prev => ({
        ...prev,
        totalReadings: prev.totalReadings + 1,
        averageResponseTime: (prev.averageResponseTime + responseTime) / 2,
        last24Hours: {
          ...prev.last24Hours,
          readings: prev.last24Hours.readings + 1
        }
      }));

      return telemetryData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      onError?.(errorMessage);
      
      // Actualizar estadísticas de error
      setStats(prev => ({
        ...prev,
        errorRate: (prev.errorRate + 1) / 2,
        last24Hours: {
          ...prev.last24Hours,
          errors: prev.last24Hours.errors + 1
        }
      }));

      throw error;
    }
  }, [devices, processSensorData, onError]);

  // Función para refrescar datos
  const refreshData = useCallback(async () => {
    if (loadingState === LoadingState.LOADING) return;

    setLoadingState(LoadingState.LOADING);
    setError(null);

    try {
      const telemetryData = await fetchTelemetryData();
      setData(telemetryData);
      setLoadingState(LoadingState.SUCCESS);
      lastUpdateRef.current = new Date();
      onDataUpdate?.(telemetryData);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
    }
  }, [fetchTelemetryData, loadingState, onDataUpdate]);

  // Función para iniciar monitoreo
  const startMonitoring = useCallback(() => {
    if (isRunning) return;

    setIsRunning(true);
    abortControllerRef.current = new AbortController();

    // Primera carga
    refreshData();

    // Configurar intervalo
    intervalRef.current = setInterval(() => {
      if (abortControllerRef.current?.signal.aborted) return;
      refreshData();
    }, updateInterval);
  }, [isRunning, refreshData, updateInterval]);

  // Función para detener monitoreo
  const stopMonitoring = useCallback(() => {
    setIsRunning(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  // Función para reconocer alerta
  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, acknowledged: true }
        : alert
    ));
  }, []);

  // Función para limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Efecto para iniciar automáticamente
  useEffect(() => {
    if (autoStart && devices.length > 0) {
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [autoStart, devices, startMonitoring, stopMonitoring]);

  // Efecto para limpiar al desmontar
  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    data,
    loadingState,
    error,
    isRunning,
    stats,
    alerts,
    startMonitoring,
    stopMonitoring,
    refreshData,
    acknowledgeAlert,
    clearError
  };
} 