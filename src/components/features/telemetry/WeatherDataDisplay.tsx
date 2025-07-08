// ============================================================================
// WEATHER DATA DISPLAY
// Component for displaying weather data and forecasts
// ============================================================================

import React from 'react';
import { WeatherData, DeviceInfo } from '../../../types/telemetry';

interface WeatherDataDisplayProps {
  weatherData: WeatherData;
  device: DeviceInfo;
  loading: boolean;
  onRefresh?: () => void;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weatherData,
  device,
  loading,
  onRefresh
}) => {
  const getWeatherIcon = (weatherId: number) => {
    // Map weather IDs to SVG icons
    if (weatherId >= 200 && weatherId < 300) {
      return (
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    if (weatherId >= 300 && weatherId < 400) {
      return (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }
    if (weatherId >= 500 && weatherId < 600) {
      return (
        <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }
    if (weatherId >= 600 && weatherId < 700) {
      return (
        <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (weatherId >= 700 && weatherId < 800) {
      return (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }
    if (weatherId === 800) {
      return (
        <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    }
    if (weatherId >= 801 && weatherId < 900) {
      return (
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    );
  };

  const getWeatherDescription = (weatherId: number) => {
    if (weatherId >= 200 && weatherId < 300) return 'Tormenta';
    if (weatherId >= 300 && weatherId < 400) return 'Llovizna';
    if (weatherId >= 500 && weatherId < 600) return 'Lluvia';
    if (weatherId >= 600 && weatherId < 700) return 'Nieve';
    if (weatherId >= 700 && weatherId < 800) return 'Niebla';
    if (weatherId === 800) return 'Despejado';
    if (weatherId >= 801 && weatherId < 900) return 'Nublado';
    return 'Desconocido';
  };

  const getUVLevel = (uvi: number) => {
    if (uvi <= 2) return { level: 'Bajo', color: 'text-emerald-400' };
    if (uvi <= 5) return { level: 'Moderado', color: 'text-yellow-400' };
    if (uvi <= 7) return { level: 'Alto', color: 'text-orange-400' };
    if (uvi <= 10) return { level: 'Muy Alto', color: 'text-red-400' };
    return { level: 'Extremo', color: 'text-purple-400' };
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
          <span className="ml-3 text-white/70 text-sm">Actualizando clima...</span>
        </div>
      </div>
    );
  }

  const current = weatherData.current;
  const weather = current.weather[0];
  const uvInfo = getUVLevel(current.uvi);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold text-white">Datos Meteorológicos</h2>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-blue-400 hover:text-blue-300 transition-colors p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Device Name */}
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-base md:text-lg font-semibold text-white">{device.DeviceName}</h3>
      </div>

      <div className="space-y-6">
        {/* Current Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Current Weather */}
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Clima Actual</h3>
                <p className="text-sm text-white/70">{formatTime(current.dt)}</p>
              </div>
              <div className="text-4xl">{getWeatherIcon(weather.id)}</div>
            </div>
            
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(current.temp)}°C
            </div>
            
            <div className="text-lg text-white/70 mb-4">
              {getWeatherDescription(weather.id)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/50">Sensación térmica:</span>
                <div className="text-white font-medium">{Math.round(current.feels_like)}°C</div>
              </div>
              <div>
                <span className="text-white/50">Humedad:</span>
                <div className="text-white font-medium">{current.humidity}%</div>
              </div>
              <div>
                <span className="text-white/50">Presión:</span>
                <div className="text-white font-medium">{current.pressure} hPa</div>
              </div>
              <div>
                <span className="text-white/50">Visibilidad:</span>
                <div className="text-white font-medium">{(current.visibility / 1000).toFixed(1)} km</div>
              </div>
            </div>
          </div>

          {/* Wind and UV Info */}
          <div className="space-y-4">
            {/* Wind Information */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <h4 className="text-white font-medium">Viento</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Velocidad:</span>
                  <span className="text-white font-medium text-sm">{current.wind_speed} km/h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Dirección:</span>
                  <span className="text-white font-medium text-sm">{getWindDirection(current.wind_deg)}</span>
                </div>
              </div>
            </div>

            {/* UV Information */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h4 className="text-white font-medium">Índice UV</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Valor:</span>
                  <span className={`font-medium text-sm ${uvInfo.color}`}>{current.uvi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Nivel:</span>
                  <span className={`font-medium text-sm ${uvInfo.level}`}>{uvInfo.level}</span>
                </div>
              </div>
            </div>

            {/* Sun Information */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h4 className="text-white font-medium">Sol</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Amanecer:</span>
                  <span className="text-white font-medium text-sm">{formatTime(current.sunrise)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Atardecer:</span>
                  <span className="text-white font-medium text-sm">{formatTime(current.sunset)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Forecast */}
        {weatherData.hourly && weatherData.hourly.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-white mb-4">Pronóstico por Horas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {weatherData.hourly.slice(0, 12).map((hour, index) => (
                <div key={index} className="text-center">
                  <div className="text-sm text-white/50 mb-1">
                    {index === 0 ? 'Ahora' : formatTime(hour.dt)}
                  </div>
                  <div className="mb-1">
                    {getWeatherIcon(hour.weather[0].id)}
                  </div>
                  <div className="text-white font-medium text-sm">
                    {Math.round(hour.temp)}°
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Forecast */}
        {weatherData.daily && weatherData.daily.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-white mb-4">Pronóstico de 7 Días</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {weatherData.daily.slice(0, 7).map((day, index) => (
                <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-white/50 mb-2">
                    {index === 0 ? 'Hoy' : formatDate(day.dt)}
                  </div>
                  <div className="mb-2">
                    {getWeatherIcon(day.weather[0].id)}
                  </div>
                  <div className="text-white font-medium text-sm mb-1">
                    {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                  </div>
                  <div className="text-xs text-white/70">
                    {getWeatherDescription(day.weather[0].id)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDataDisplay; 