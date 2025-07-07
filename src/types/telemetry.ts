/**
 * Tipos TypeScript para el sistema de telemetría
 * Basado en la documentación de Ecowitt
 */

// Re-exportar los tipos de Ecowitt con namespaces para evitar conflictos
export { 
  CALLBACK_TYPES,
  TEMPERATURE_UNITS,
  PRESSURE_UNITS,
  WIND_SPEED_UNITS,
  RAINFALL_UNITS,
  SOLAR_IRRADIANCE_UNITS,
  CAPACITY_UNITS,
  DEFAULT_REALTIME_PARAMS,
  createRealtimeRequestParams,
  validateRealtimeRequestParams
} from '../../docs/ecowitt-parameters/realtime-request.types';

export type { 
  RealtimeRequestParams,
  CallbackType,
  TemperatureUnit,
  PressureUnit,
  WindSpeedUnit,
  RainfallUnit,
  SolarIrradianceUnit,
  CapacityUnit
} from '../../docs/ecowitt-parameters/realtime-request.types';

export {
  isWaterLeakStatus,
  getWaterLeakStatusDescription,
  validateRealtimeResponse,
  extractOutdoorData,
  extractIndoorData,
  extractWindData,
  extractRainfallData
} from '../../docs/ecowitt-parameters/realtime-response.types';

export type {
  RealtimeResponse,
  RealtimeData,
  OutdoorData,
  IndoorData,
  SolarAndUVIData,
  RainfallData,
  RainfallPiezoData,
  WindData,
  PressureData,
  LightningData,
  IndoorCO2Data,
  PM25Data,
  CO2AQIComboData,
  PM25AQIComboData,
  PM10AQIComboData,
  PM1AQIComboData,
  PM4AQIComboData,
  TRHAQIComboData,
  WaterLeakData,
  WaterLeakStatus,
  TempHumidityData,
  SoilData,
  TempData,
  LeafData,
  BatteryData,
  LDSData,
  CameraData,
  WFC01Data,
  AC1100Data,
  WFC02Data,
  WaterLeakStatusType
} from '../../docs/ecowitt-parameters/realtime-response.types';

export {
  validateDeviceInfoRequestParams
} from '../../docs/ecowitt-parameters/device-info-request.types';

export type {
  DeviceInfoRequestParams
} from '../../docs/ecowitt-parameters/device-info-request.types';

export {
  validateDeviceInfoResponse
} from '../../docs/ecowitt-parameters/device-info-response.types';

export type {
  DeviceInfoResponse,
  DeviceInfoData
} from '../../docs/ecowitt-parameters/device-info-response.types';

export {
  validateHistoryRequestParams
} from '../../docs/ecowitt-parameters/history-request.types';

export type {
  HistoryRequestParams
} from '../../docs/ecowitt-parameters/history-request.types';

export {
  validateHistoryResponse
} from '../../docs/ecowitt-parameters/history-response.types';

export type {
  HistoryResponse,
  HistoryData
} from '../../docs/ecowitt-parameters/history-response.types';

// Estados del sensor
export enum SensorStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  ERROR = 'error',
  WARNING = 'warning'
}

// Tipos de sensores
export enum SensorType {
  TEMPERATURE = 'temperature',
  HUMIDITY = 'humidity',
  PRESSURE = 'pressure',
  WIND = 'wind',
  RAINFALL = 'rainfall',
  SOLAR = 'solar',
  SOIL = 'soil',
  LEAF = 'leaf',
  CO2 = 'co2',
  PM25 = 'pm25',
  LIGHTNING = 'lightning',
  WATER_LEAK = 'water_leak',
  BATTERY = 'battery'
}

// Interfaz para un sensor individual
export interface Sensor {
  id: string;
  name: string;
  type: SensorType;
  status: SensorStatus;
  value: number | null;
  unit: string;
  lastUpdate: Date;
  location?: string;
  description?: string;
}

// Interfaz para un dispositivo
export interface Device {
  id: string;
  name: string;
  mac: string;
  imei?: string;
  status: SensorStatus;
  sensors: Sensor[];
  lastUpdate: Date;
  location?: string;
  description?: string;
}

// Interfaz para datos de telemetría en tiempo real
export interface TelemetryData {
  devices: Device[];
  timestamp: Date;
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
}

// Interfaz para configuración de telemetría
export interface TelemetryConfig {
  apiKey: string;
  applicationKey: string;
  updateInterval: number; // en milisegundos
  units: {
    temperature: 'celsius' | 'fahrenheit';
    pressure: 'hpa' | 'inhg' | 'mmhg';
    windSpeed: 'mps' | 'kmh' | 'knots' | 'mph' | 'bft' | 'fpm';
    rainfall: 'mm' | 'in';
    solar: 'lux' | 'fc' | 'wm2';
    capacity: 'l' | 'm3' | 'gal';
  };
}

// Interfaz para alertas
export interface TelemetryAlert {
  id: string;
  deviceId: string;
  sensorId: string;
  type: 'threshold' | 'offline' | 'error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  value?: number;
  threshold?: number;
}

// Interfaz para estadísticas
export interface TelemetryStats {
  totalReadings: number;
  averageResponseTime: number;
  errorRate: number;
  last24Hours: {
    readings: number;
    errors: number;
    alerts: number;
  };
}

// Estados de carga
export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Interfaz para el estado de telemetría
export interface TelemetryState {
  data: TelemetryData | null;
  config: TelemetryConfig;
  alerts: TelemetryAlert[];
  stats: TelemetryStats;
  loadingState: LoadingState;
  error: string | null;
  lastUpdate: Date | null;
} 