// ============================================================================
// REALTIME DATA DISPLAY
// Component to display realtime sensor data with new structure
// ============================================================================

import React from 'react';
import { RealtimeData, SensorValue, WeatherData, DeviceInfo, DeviceInfoData, DeviceCharacteristicsData } from '../../../types/telemetry';
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


interface RealtimeDataDisplayProps {
  data: RealtimeData | Record<string, RealtimeData> | null;
  deviceName?: string;
  loading?: boolean;
  error?: string | null;
  onShowDeviceInfo?: () => void;
  device?: DeviceInfo | null;
  deviceInfo?: DeviceInfoData | null;
  deviceCharacteristics?: DeviceCharacteristicsData | null;
  isGroupData?: boolean;
}

const RealtimeDataDisplay: React.FC<RealtimeDataDisplayProps> = ({
  data,
  deviceName,
  loading,
  error,
  onShowDeviceInfo,
  device = null,
  deviceInfo = null,
  deviceCharacteristics = null
}) => {
  const { weatherData, loading: weatherLoading, error: weatherError } = useDeviceWeather({ device, deviceInfo, deviceCharacteristics });

  const formatValue = (sensorValue: SensorValue | number) => {
    if (typeof sensorValue === 'number') {
      return `${sensorValue}`;
    }
    return `${sensorValue.value} ${sensorValue.unit}`;
  };

  const formatTime = (timestamp: string | number) => {
    if (typeof timestamp === 'number') {
      const date = new Date(timestamp * 1000);
      return date.toLocaleTimeString();
    }
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString();
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
          <span className="ml-3 text-white/70 text-lg">Cargando datos en tiempo real...</span>
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
          <p className="text-red-400 font-medium">Error al cargar datos</p>
          <p className="text-white/60 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-white/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-white/60 text-sm">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
      {/* Información del dispositivo */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Datos en Tiempo Real
        </h3>
        {deviceName && (
          <span className="text-lg text-white/60 flex items-center gap-2">
            {deviceName}
            {onShowDeviceInfo && (
              <button
                onClick={onShowDeviceInfo}
                className="ml-2 p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                title="Ver información del dispositivo"
                type="button"
              >
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Indoor Sensors */}
        {data.indoor && (
          <>
            {data.indoor.temperature && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('temperature')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Temperatura Interior</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('temperature', typeof data.indoor.temperature === 'object' ? data.indoor.temperature.value : data.indoor.temperature)}`}>
                    {formatValue(data.indoor.temperature)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(typeof data.indoor.temperature === 'object' ? data.indoor.temperature.time : Date.now())}
                  </p>
                </div>
              </div>
            )}

            {data.indoor.humidity && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('humidity')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad Interior</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('humidity', typeof data.indoor.humidity === 'object' ? data.indoor.humidity.value : data.indoor.humidity)}`}>
                    {formatValue(data.indoor.humidity)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(typeof data.indoor.humidity === 'object' ? data.indoor.humidity.time : Date.now())}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Pressure Sensors */}
        {data.pressure && (
          <>
            {data.pressure.relative && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('pressure')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Presión Relativa</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.pressure.relative)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.pressure.relative.time)}
                  </p>
                </div>
              </div>
            )}

            {data.pressure.absolute && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('pressure')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Presión Absoluta</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.pressure.absolute)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.pressure.absolute.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Soil Sensors CH1 */}
        {data.soil_ch1 && (
          <>
            {data.soil_ch1.soilmoisture && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('soilmoisture')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad del Suelo CH1</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('soilmoisture', data.soil_ch1.soilmoisture.value)}`}>
                    {formatValue(data.soil_ch1.soilmoisture)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch1.soilmoisture.time)}
                  </p>
                </div>
              </div>
            )}

            {data.soil_ch1.ad && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-white">Señal Analógica CH1</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.soil_ch1.ad)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch1.ad.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Soil Sensors CH9 */}
        {data.soil_ch9 && (
          <>
            {data.soil_ch9.soilmoisture && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    {getSensorIcon('soilmoisture')}
                  </div>
                  <h4 className="text-sm font-medium text-white">Humedad del Suelo CH9</h4>
                </div>
                <div className="space-y-1">
                  <p className={`text-lg font-semibold ${getSensorColor('soilmoisture', data.soil_ch9.soilmoisture.value)}`}>
                    {formatValue(data.soil_ch9.soilmoisture)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch9.soilmoisture.time)}
                  </p>
                </div>
              </div>
            )}

            {data.soil_ch9.ad && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-emerald-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-medium text-white">Señal Analógica CH9</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-white">
                    {formatValue(data.soil_ch9.ad)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.soil_ch9.ad.time)}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Battery Sensors */}
        {data.battery && data.battery.soilmoisture_sensor_ch1 && (
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-emerald-400">
                {getSensorIcon('battery')}
              </div>
              <h4 className="text-sm font-medium text-white">Batería Sensor Suelo</h4>
            </div>
            <div className="space-y-1">
              <p className={`text-lg font-semibold ${getSensorColor('battery', data.battery.soilmoisture_sensor_ch1.value)}`}>
                {formatValue(data.battery.soilmoisture_sensor_ch1)}
              </p>
              <p className="text-xs text-white/50">
                Actualizado: {formatTime(data.battery.soilmoisture_sensor_ch1.time)}
              </p>
            </div>
          </div>
        )}
        
      </div>
      
      {/* Tarjeta de clima básico usando SimpleWeatherDisplay */}
      {weatherData && weatherData.current && (
        <SimpleWeatherDisplay
          weatherData={weatherData}
          variant="realtime"
          className=""
        />
      )}
      
      {/* Mostrar error de clima solo si no está cargando */}
      {weatherError && !weatherLoading && (
        <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
          <p className="text-red-400 text-sm">{weatherError}</p>
        </div>
      )}

      {/* Last Update Info */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-xs text-white/50 text-center">
          Última actualización: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default RealtimeDataDisplay; 