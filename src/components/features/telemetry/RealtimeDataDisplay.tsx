// ============================================================================
// REALTIME DATA DISPLAY
// Component to display realtime sensor data with new structure
// ============================================================================

import React from 'react';
import { RealtimeData, SensorValue } from '../../../types/telemetry';

interface RealtimeDataDisplayProps {
  data: RealtimeData | null;
  deviceName?: string;
  loading?: boolean;
  error?: string | null;
}

const RealtimeDataDisplay: React.FC<RealtimeDataDisplayProps> = ({
  data,
  deviceName,
  loading,
  error
}) => {
  const formatValue = (sensorValue: SensorValue) => {
    return `${sensorValue.value} ${sensorValue.unit}`;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleTimeString();
  };

  const getSensorIcon = (sensorType: string) => {
    switch (sensorType) {
      case 'temperature':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'humidity':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'pressure':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
          </svg>
        );
      case 'soilmoisture':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        );
      case 'battery':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const getSensorColor = (sensorType: string, value: string) => {
    const numValue = parseFloat(value);
    
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Datos en Tiempo Real
        </h3>
        {deviceName && (
          <span className="text-sm text-white/60">{deviceName}</span>
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
                  <p className={`text-lg font-semibold ${getSensorColor('temperature', data.indoor.temperature.value)}`}>
                    {formatValue(data.indoor.temperature)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.indoor.temperature.time)}
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
                  <p className={`text-lg font-semibold ${getSensorColor('humidity', data.indoor.humidity.value)}`}>
                    {formatValue(data.indoor.humidity)}
                  </p>
                  <p className="text-xs text-white/50">
                    Actualizado: {formatTime(data.indoor.humidity.time)}
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