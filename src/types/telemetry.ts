// ============================================================================
// TYPES FOR ECOWITT TELEMETRY SYSTEM
// Based on EcoWitt API documentation
// ============================================================================

// ============================================================================
// DEVICE MANAGEMENT TYPES
// ============================================================================

export interface DeviceRegistration {
  DeviceName: string;
  DeviceMac: string;
  DeviceApplicationKey: string;
  DeviceApiKey: string;
  DeviceType: 'Outdoor' | 'Indoor' | 'Hybrid';
  UserID: string;
}

export interface DeviceInfo {
  DeviceID: string;
  DeviceName: string;
  DeviceMac: string;
  DeviceType: 'Outdoor' | 'Indoor' | 'Hybrid';
  UserID: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  elevation: number;
}

export interface DeviceSensor {
  name: string;
  type: 'number' | 'string' | 'boolean';
  unit: string;
  enabled?: boolean;
}

export interface DeviceCharacteristics {
  mac: string;
  device_id: string;
  model: string;
  name: string;
  location: DeviceLocation;
  timezone: string;
  region: string;
  country: string;
  city: string;
  firmware_version: string;
  hardware_version: string;
  last_seen: string;
  battery_level?: number;
  signal_strength?: number;
  sensors: DeviceSensor[];
}

export interface DeviceInfoData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  deviceMac: string;
  status: string;
  createdAt: string;
  location: DeviceLocation;
  model: string;
  sensors: DeviceSensor[];
  lastUpdate: string;
  currentData: RealtimeData;
}

export interface DeviceCharacteristicsData {
  deviceId: string;
  deviceName: string;
  deviceType: string;
  deviceMac: string;
  status: string;
  createdAt: string;
  ecowittInfo: DeviceCharacteristics;
}

// ============================================================================
// REALTIME DATA TYPES
// ============================================================================

export interface RealtimeData {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  windSpeed?: number;
  windDirection?: number;
  rainfall?: number;
  uv?: number;
  solarRadiation?: number;
  tempf?: number;
  humidity1?: number;
  baromrelin?: number;
  windspeedmph?: number;
  winddir?: number;
  rainin?: number;
  uv1?: number;
  solarradiation?: number;
  [key: string]: any; // For additional sensor data
}

export interface RealtimeResponse {
  deviceId: string;
  deviceName: string;
  timestamp: string;
  data: RealtimeData;
}

// ============================================================================
// HISTORICAL DATA TYPES
// ============================================================================

export type TimeRange = 
  | 'one_hour'
  | 'one_day' 
  | 'one_week'
  | 'one_month'
  | 'three_months';

export interface HistoricalDataPoint {
  timestamp: string;
  value: number;
}

export interface HistoricalData {
  unit: string;
  list: Record<string, string>;
}

export interface HistoricalResponse {
  indoor?: {
    temperature?: HistoricalData;
    humidity?: HistoricalData;
    pressure?: HistoricalData;
    [key: string]: HistoricalData | undefined;
  };
  outdoor?: {
    temperature?: HistoricalData;
    humidity?: HistoricalData;
    pressure?: HistoricalData;
    windSpeed?: HistoricalData;
    windDirection?: HistoricalData;
    rainfall?: HistoricalData;
    uv?: HistoricalData;
    solarRadiation?: HistoricalData;
    [key: string]: HistoricalData | undefined;
  };
  [key: string]: any;
}

// ============================================================================
// WEATHER API TYPES
// ============================================================================

export interface WeatherData {
  lat: number;
  lon: number;
  timezone: string;
  timezone_offset: number;
  current: {
    dt: number;
    sunrise: number;
    sunset: number;
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    dew_point: number;
    uvi: number;
    clouds: number;
    visibility: number;
    wind_speed: number;
    wind_deg: number;
    weather: WeatherCondition[];
  };
  minutely?: WeatherMinutely[];
  hourly?: WeatherHourly[];
  daily?: WeatherDaily[];
  alerts?: WeatherAlert[];
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface WeatherMinutely {
  dt: number;
  precipitation: number;
}

export interface WeatherHourly {
  dt: number;
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  dew_point: number;
  uvi: number;
  clouds: number;
  visibility: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  pop: number;
}

export interface WeatherDaily {
  dt: number;
  sunrise: number;
  sunset: number;
  moonrise: number;
  moonset: number;
  moon_phase: number;
  temp: {
    day: number;
    min: number;
    max: number;
    night: number;
    eve: number;
    morn: number;
  };
  feels_like: {
    day: number;
    night: number;
    eve: number;
    morn: number;
  };
  pressure: number;
  humidity: number;
  dew_point: number;
  wind_speed: number;
  wind_deg: number;
  weather: WeatherCondition[];
  clouds: number;
  pop: number;
  rain?: number;
  snow?: number;
  uvi: number;
}

export interface WeatherAlert {
  sender_name: string;
  event: string;
  start: number;
  end: number;
  description: string;
  tags: string[];
}

// ============================================================================
// GROUP MANAGEMENT TYPES
// ============================================================================

export interface Group {
  GroupID: string;
  GroupName: string;
  UserID: string;
  Description?: string;
  deviceIds: string[];
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface GroupCreation {
  GroupName: string;
  UserID: string;
  Description?: string;
  deviceIds: string[];
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string | string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

// ============================================================================
// TELEMETRY STATE TYPES
// ============================================================================

export interface TelemetryState {
  devices: DeviceInfo[];
  selectedDevice: DeviceInfo | null;
  realtimeData: RealtimeData | null;
  historicalData: HistoricalResponse | null;
  weatherData: WeatherData | null;
  deviceInfo: DeviceInfoData | null;
  deviceCharacteristics: DeviceCharacteristicsData | null;
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;
  polling: boolean;
  lastUpdate: string | null;
}

export interface TelemetryFilters {
  deviceType?: string;
  userId?: string;
  timeRange?: TimeRange;
  includeHistory?: boolean;
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartDataPoint {
  x: string;
  y: number;
}

export interface ChartDataset {
  label: string;
  data: ChartDataPoint[];
  borderColor: string;
  backgroundColor: string;
  tension: number;
}

export interface ChartConfig {
  type: 'line' | 'bar' | 'doughnut';
  data: {
    labels: string[];
    datasets: ChartDataset[];
  };
  options: any;
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface TelemetryAlert {
  id: string;
  deviceId: string;
  deviceName?: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'wind' | 'rain' | 'uv';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  value: number;
  threshold: number;
  timestamp: string;
  acknowledged: boolean;
  data?: Record<string, any>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type SensorType = 
  | 'temperature'
  | 'humidity' 
  | 'pressure'
  | 'windSpeed'
  | 'windDirection'
  | 'rainfall'
  | 'uv'
  | 'solarRadiation';

export interface SensorConfig {
  name: SensorType;
  displayName: string;
  unit: string;
  icon: string;
  color: string;
  minValue?: number;
  maxValue?: number;
  thresholds?: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

export interface TelemetryStats {
  totalDevices: number;
  activeDevices: number;
  totalGroups: number;
  lastDataUpdate: string;
  averageTemperature: number;
  averageHumidity: number;
  totalAlerts: number;
  criticalAlerts: number;
} 