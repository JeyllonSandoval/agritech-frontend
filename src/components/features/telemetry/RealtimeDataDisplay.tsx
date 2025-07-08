// ============================================================================
// REALTIME DATA DISPLAY
// Component for displaying realtime sensor data
// ============================================================================

import React from 'react';
import { RealtimeData, DeviceInfo } from '../../../types/telemetry';

interface RealtimeDataDisplayProps {
  data: RealtimeData | null;
  loading: boolean;
  device: DeviceInfo;
  onRefresh?: () => void;
}

const RealtimeDataDisplay: React.FC<RealtimeDataDisplayProps> = ({
  data,
  loading,
  device,
  onRefresh
}) => {
  const sensorConfigs = [
    {
      key: 'temperature',
      label: 'Temperatura',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      unit: '°C',
      color: 'bg-orange-500/20 border-orange-500/30',
      textColor: 'text-orange-400',
      fallbackKeys: ['tempf', 'temp1f']
    },
    {
      key: 'humidity',
      label: 'Humedad',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      unit: '%',
      color: 'bg-cyan-500/20 border-cyan-500/30',
      textColor: 'text-cyan-400',
      fallbackKeys: ['humidity1']
    },
    {
      key: 'pressure',
      label: 'Presión',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      unit: 'hPa',
      color: 'bg-blue-500/20 border-blue-500/30',
      textColor: 'text-blue-400',
      fallbackKeys: ['baromrelin']
    },
    {
      key: 'windSpeed',
      label: 'Velocidad del Viento',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      unit: 'km/h',
      color: 'bg-emerald-500/20 border-emerald-500/30',
      textColor: 'text-emerald-400',
      fallbackKeys: ['windspeedmph']
    },
    {
      key: 'windDirection',
      label: 'Dirección del Viento',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      unit: '°',
      color: 'bg-purple-500/20 border-purple-500/30',
      textColor: 'text-purple-400',
      fallbackKeys: ['winddir']
    },
    {
      key: 'rainfall',
      label: 'Lluvia',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      unit: 'mm',
      color: 'bg-indigo-500/20 border-indigo-500/30',
      textColor: 'text-indigo-400',
      fallbackKeys: ['rainin']
    },
    {
      key: 'uv',
      label: 'Índice UV',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      unit: '',
      color: 'bg-yellow-500/20 border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      key: 'solarRadiation',
      label: 'Radiación Solar',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      unit: 'W/m²',
      color: 'bg-red-500/20 border-red-500/30',
      textColor: 'text-red-400',
      fallbackKeys: ['solarradiation']
    }
  ];

  const getSensorValue = (config: any) => {
    if (!data) return null;
    
    // Try primary key first
    let value = data[config.key as keyof RealtimeData];
    
    // Try fallback keys if primary key is not available
    if (value === undefined && config.fallbackKeys) {
      for (const fallbackKey of config.fallbackKeys) {
        value = data[fallbackKey as keyof RealtimeData];
        if (value !== undefined) break;
      }
    }
    
    return value;
  };

  const formatValue = (value: any, unit: string) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Convert temperature from Fahrenheit to Celsius if needed
    if (unit === '°C' && typeof value === 'number' && value > 100) {
      value = ((value - 32) * 5) / 9;
    }
    
    // Convert wind speed from mph to km/h if needed
    if (unit === 'km/h' && typeof value === 'number' && value < 100) {
      value = value * 1.60934;
    }
    
    // Convert pressure from inches to hPa if needed
    if (unit === 'hPa' && typeof value === 'number' && value < 50) {
      value = value * 33.8639;
    }
    
    return typeof value === 'number' ? `${value.toFixed(1)}${unit}` : `${value}${unit}`;
  };

  const getValueStatus = (value: any, config: any) => {
    if (value === null || value === undefined) return 'normal';
    
    const numValue = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(numValue)) return 'normal';
    
    // Temperature thresholds
    if (config.key === 'temperature') {
      if (numValue > 35) return 'critical';
      if (numValue > 30) return 'warning';
      if (numValue < 5) return 'warning';
    }
    
    // Humidity thresholds
    if (config.key === 'humidity') {
      if (numValue < 20) return 'warning';
      if (numValue > 90) return 'warning';
    }
    
    // UV index thresholds
    if (config.key === 'uv') {
      if (numValue > 10) return 'critical';
      if (numValue > 7) return 'warning';
    }
    
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-white/70 text-sm">Actualizando datos...</span>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">
            Sin datos disponibles
          </h3>
          <p className="text-white/60 text-sm">
            No hay datos en tiempo real para {device.DeviceName}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold text-white">Datos en Tiempo Real</h2>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-emerald-400 hover:text-emerald-300 transition-colors p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Device Name */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <h3 className="text-base md:text-lg font-semibold text-white">{device.DeviceName}</h3>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensorConfigs.map((config) => {
          const value = getSensorValue(config);
          const status = getValueStatus(value, config);
          const statusColor = getStatusColor(status);
          
          return (
            <div
              key={config.key}
              className={`p-4 rounded-xl border transition-all duration-300 hover:scale-105 ${config.color} ${statusColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${config.color.replace('/20', '/30')}`}>
                    {config.icon}
                  </div>
                  <span className="text-sm font-medium text-white">{config.label}</span>
                </div>
                {status !== 'normal' && (
                  <div className={`w-2 h-2 rounded-full ${
                    status === 'critical' ? 'bg-red-400' : 'bg-yellow-400'
                  }`} />
                )}
              </div>
              
              <div className={`text-2xl font-bold ${config.textColor}`}>
                {formatValue(value, config.unit)}
              </div>
              
              {status !== 'normal' && (
                <div className="text-xs text-white/70 mt-1">
                  {status === 'critical' ? 'Valor crítico' : 'Valor fuera de rango'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Last Update */}
      {data.dateutc && (
        <div className="mt-6 text-xs text-white/50 text-center">
          Última actualización: {new Date(data.dateutc).toLocaleString()}
        </div>
      )}
    </div>
  );
};

export default RealtimeDataDisplay; 