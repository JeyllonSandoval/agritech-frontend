// ============================================================================
// GROUP REALTIME DATA DISPLAY
// Component to display realtime data for device groups
// ============================================================================

import React from 'react';
import { GroupRealtimeResponse, Group, WeatherData, DeviceCharacteristicsData } from '../../../types/telemetry';
import { useDeviceWeather } from '../../../hooks/useDeviceWeather';
import SimpleWeatherDisplay from './SimpleWeatherDisplay';
import { 
  WiThermometer, 
  WiHumidity, 
  WiBarometer, 
  WiRain, 
  WiStrongWind,
} from 'react-icons/wi';
import { CiBatteryCharging } from "react-icons/ci";

interface GroupRealtimeDataDisplayProps {
  data: GroupRealtimeResponse | null;
  group: Group;
  loading?: boolean;
  error?: string | null;
  weatherData?: WeatherData | null; // Keep for backward compatibility
  groupDevicesCharacteristics?: Record<string, DeviceCharacteristicsData>;
}

const GroupRealtimeDataDisplay: React.FC<GroupRealtimeDataDisplayProps> = ({
  data,
  group,
  loading,
  error,
  weatherData: propWeatherData, // Rename to avoid conflict
  groupDevicesCharacteristics
}) => {
  // Use the useDeviceWeather hook to get weather data for the group
  const { weatherData: hookWeatherData } = useDeviceWeather({ 
    device: null, 
    deviceInfo: null, 
    deviceCharacteristics: null,
    group,
    groupDevicesCharacteristics
  });

  // Use hook weather data if available, otherwise fall back to prop
  const weatherData = hookWeatherData || propWeatherData;

  // Console logs para debuggear
  console.log('🔍 [GroupRealtimeDataDisplay] Props recibidas:', {
    groupName: group?.GroupName,
    dataKeys: data ? Object.keys(data) : [],
    weatherData: weatherData ? 'Presente' : 'Ausente',
    weatherCurrent: weatherData?.current ? 'Presente' : 'Ausente',
    hookWeatherData: hookWeatherData ? 'Presente' : 'Ausente',
    propWeatherData: propWeatherData ? 'Presente' : 'Ausente'
  });

  if (weatherData?.current) {
    console.log('🔍 [GroupRealtimeDataDisplay] Datos de clima disponibles:', {
      temperatura: weatherData.current.temp,
      humedad: weatherData.current.humidity,
      descripcion: weatherData.current.weather[0]?.description,
      ubicacion: { lat: weatherData.lat, lon: weatherData.lon }
    });
  }
  const formatValue = (sensorValue: any) => {
    if (typeof sensorValue === 'number') {
      return `${sensorValue}`;
    }
    if (typeof sensorValue === 'object' && sensorValue.value) {
      return `${sensorValue.value} ${sensorValue.unit || ''}`;
    }
    return `${sensorValue}`;
  };

  const formatTime = (timestamp: any) => {
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    }
    if (typeof timestamp === 'string') {
      const date = new Date(parseInt(timestamp) * 1000);
      return date.toLocaleTimeString();
    }
    return new Date().toLocaleTimeString();
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return <WiThermometer className="w-5 h-5" />;
      case 'humidity':
        return <WiHumidity className="w-5 h-5" />;
      case 'pressure':
        return <WiBarometer className="w-5 h-5" />;
      case 'soilmoisture':
        return <WiRain className="w-5 h-5" />;
      case 'battery':
        return <CiBatteryCharging className="w-5 h-5" />;
      default:
        return <WiThermometer className="w-5 h-5" />;
    }
  };

  const getSensorColor = (sensorType: string, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    
    switch (sensorType) {
      case 'temperature':
        if (numValue > 30) return 'text-red-400';
        if (numValue > 25) return 'text-yellow-400';
        return 'text-green-400';
      case 'humidity':
        if (numValue < 30) return 'text-red-400';
        if (numValue < 50) return 'text-yellow-400';
        return 'text-green-400';
      case 'soilmoisture':
        if (numValue < 30) return 'text-red-400';
        if (numValue < 50) return 'text-yellow-400';
        return 'text-green-400';
      case 'battery':
        if (numValue < 2.5) return 'text-red-400';
        if (numValue < 3.0) return 'text-yellow-400';
        return 'text-green-400';
      default:
        return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-white/70 text-lg">Cargando datos del grupo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-red-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-400 font-medium">Error al cargar datos del grupo</p>
          <p className="text-white/60 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    // Solo mostrar "No hay datos" si no está cargando
    if (!loading) {
      return (
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-white/60 text-sm">No hay datos disponibles para este grupo</p>
          </div>
        </div>
      );
    }
    // Si está cargando, mostrar el loading
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-white/70 text-lg">Cargando datos del grupo...</span>
        </div>
      </div>
    );
  }

  // Siempre renderiza los datos si existen
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Datos del Grupo en Tiempo Real
        </h3>
        <span className="text-lg text-white/60 flex items-center gap-2">
          {group.GroupName}
        </span>
      </div>

      {/* Devices Data */}
      <div className="space-y-6">
        {Object.entries(data).map(([deviceName, deviceData]) => {
          const sensors = deviceData.data || deviceData; // Compatibilidad con estructura anterior
          console.log('Renderizando dispositivo', deviceName, sensors);
          return (
            <div key={deviceName} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-4 border-b border-white/10 pb-2">
                {deviceName}
                {deviceData.deviceInfo && (
                  <span className="text-xs text-white/50 ml-2">
                    (MAC: {deviceData.deviceInfo.mac})
                  </span>
                )}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Temperature */}
                {sensors?.indoor?.temperature && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('temperature')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Temperatura</h5>
                    </div>
                    <p className={`text-lg font-semibold ${getSensorColor('temperature', sensors.indoor.temperature.value)}`}>
                      {formatValue(sensors.indoor.temperature)}
                    </p>
                  </div>
                )}
                {/* Humidity */}
                {sensors?.indoor?.humidity && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('humidity')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Humedad</h5>
                    </div>
                    <p className={`text-lg font-semibold ${getSensorColor('humidity', sensors.indoor.humidity.value)}`}>
                      {formatValue(sensors.indoor.humidity)}
                    </p>
                  </div>
                )}
                {/* Pressure */}
                {sensors?.pressure?.relative && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('pressure')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Presión Relativa</h5>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatValue(sensors.pressure.relative)}
                    </p>
                  </div>
                )}
                {sensors?.pressure?.absolute && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('pressure')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Presión Absoluta</h5>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatValue(sensors.pressure.absolute)}
                    </p>
                  </div>
                )}
                {/* Soil Sensors CH1 */}
                {sensors?.soil_ch1?.soilmoisture && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('soilmoisture')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Humedad del Suelo CH1</h5>
                    </div>
                    <p className={`text-lg font-semibold ${getSensorColor('soilmoisture', sensors.soil_ch1.soilmoisture.value)}`}>
                      {formatValue(sensors.soil_ch1.soilmoisture)}
                    </p>
                  </div>
                )}
                {sensors?.soil_ch1?.ad && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h5 className="text-xs font-medium text-white">Señal Analógica CH1</h5>
                    </div>
                    <p className="text-lg font-semibold text-white">
                      {formatValue(sensors.soil_ch1.ad)}
                    </p>
                  </div>
                )}
                {/* Battery */}
                {sensors?.battery?.soilmoisture_sensor_ch1 && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-emerald-400">
                        {getSensorIcon('battery')}
                      </div>
                      <h5 className="text-xs font-medium text-white">Batería Sensor Suelo</h5>
                    </div>
                    <p className={`text-lg font-semibold ${getSensorColor('battery', sensors.battery.soilmoisture_sensor_ch1.value)}`}>
                      {formatValue(sensors.battery.soilmoisture_sensor_ch1)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Tarjeta de clima básico usando SimpleWeatherDisplay */}
      {weatherData && weatherData.current && (
        <SimpleWeatherDisplay
          weatherData={weatherData}
          variant="realtime"
          className=""
        />
      )}
    </div>
  );
};

export default GroupRealtimeDataDisplay; 