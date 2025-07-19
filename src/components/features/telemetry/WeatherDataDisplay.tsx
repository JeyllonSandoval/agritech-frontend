// ============================================================================
// WEATHER DATA DISPLAY
// Component for displaying weather data and forecasts
// ============================================================================

import React from 'react';
import { WeatherData, DeviceInfo } from '../../../types/telemetry';
import { 
  WiDaySunny,
  WiDayCloudy,
  WiDayRain,
  WiDaySnow,
  WiDayThunderstorm,
  WiDaySprinkle,
  WiFog,
  WiHot,
  WiThermometer,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
  WiCloud,
  WiRefresh
} from 'react-icons/wi';

import WeatherErrorHandler from './WeatherErrorHandler';

interface WeatherDataDisplayProps {
  weatherData: WeatherData | null;
  device: DeviceInfo;
  loading: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({
  weatherData,
  device,
  loading,
  error,
  onRefresh
}) => {
  const getWeatherIcon = (weatherId: number) => {
    // Map weather IDs to appropriate Weather Icons
    if (weatherId >= 200 && weatherId < 300) {
      return <WiDayThunderstorm className="w-8 h-8 text-amber-500" />;
    }
    if (weatherId >= 300 && weatherId < 400) {
      return <WiDaySprinkle className="w-8 h-8 text-sky-400" />;
    }
    if (weatherId >= 500 && weatherId < 600) {
      return <WiDayRain className="w-8 h-8 text-blue-500" />;
    }
    if (weatherId >= 600 && weatherId < 700) {
      return <WiDaySnow className="w-8 h-8 text-slate-300" />;
    }
    if (weatherId >= 700 && weatherId < 800) {
      return <WiFog className="w-8 h-8 text-gray-500" />;
    }
    if (weatherId === 800) {
      return <WiDaySunny className="w-8 h-8 text-yellow-400" />;
    }
    if (weatherId >= 801 && weatherId < 900) {
      return <WiDayCloudy className="w-8 h-8 text-gray-400" />;
    }
    return <WiDaySunny className="w-8 h-8 text-gray-400" />;
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
    if (uvi <= 2) return { level: 'Bajo', color: 'text-green-400' };
    if (uvi <= 5) return { level: 'Moderado', color: 'text-amber-400' };
    if (uvi <= 7) return { level: 'Alto', color: 'text-orange-500' };
    if (uvi <= 10) return { level: 'Muy Alto', color: 'text-red-500' };
    return { level: 'Extremo', color: 'text-purple-500' };
  };

  const getWindDirection = (degrees: number) => {
    // Direcciones y nombres completos en español
    const directions = [
      { abbr: 'N', name: 'Norte' },
      { abbr: 'NNE', name: 'Norte-Noreste' },
      { abbr: 'NE', name: 'Noreste' },
      { abbr: 'ENE', name: 'Este-Noreste' },
      { abbr: 'E', name: 'Este' },
      { abbr: 'ESE', name: 'Este-Sureste' },
      { abbr: 'SE', name: 'Sureste' },
      { abbr: 'SSE', name: 'Sur-Sureste' },
      { abbr: 'S', name: 'Sur' },
      { abbr: 'SSW', name: 'Sur-Suroeste' },
      { abbr: 'SW', name: 'Suroeste' },
      { abbr: 'WSW', name: 'Oeste-Suroeste' },
      { abbr: 'W', name: 'Oeste' },
      { abbr: 'WNW', name: 'Oeste-Noroeste' },
      { abbr: 'NW', name: 'Noroeste' },
      { abbr: 'NNW', name: 'Norte-Noroeste' },
    ];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index].name;
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

  // Mostrar error si existe
  if (error) {
    return (
      <WeatherErrorHandler
        error={error}
        onRetry={onRefresh || (() => {})}
        isLoading={loading}
      />
    );
  }

  // Mostrar loading
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

  // Mostrar error si no hay datos
  if (!weatherData) {
    return (
      <WeatherErrorHandler
        error="No se pudieron cargar los datos del clima"
        onRetry={onRefresh || (() => {})}
        isLoading={loading}
      />
    );
  }

  const current = weatherData.current;
  const weather = current.weather[0];
  const uvInfo = getUVLevel(current.uvi);

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <WiCloud className="w-6 h-6 text-cyan-400" />
          <h2 className="text-lg md:text-xl font-semibold text-white">Datos Meteorológicos</h2>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <WiRefresh className="w-12 h-10" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Current Weather */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Current Weather */}
          <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-xl p-6">
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
                <WiStrongWind className="w-5 h-5 text-blue-400" />
                <h4 className="text-white font-medium text-lg">Viento</h4>
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
                <WiHot className="w-5 h-5 text-yellow-400" />
                <h4 className="text-white font-medium text-lg">Índice UV</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Valor:</span>
                  <span className={`font-medium text-sm ${uvInfo.color}`}>{current.uvi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-sm">Nivel:</span>
                  <span className={`font-medium text-sm ${uvInfo.color}`}>{uvInfo.level}</span>
                </div>
              </div>
            </div>

            {/* Sun Information */}
            <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <WiDaySunny className="w-5 h-5 text-amber-400" />
                <h4 className="text-white font-medium text-lg">Sol</h4>
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
              {weatherData.hourly.slice(0, 12).map((hour, index) => {
                // Icono dinámico según el clima
                const hourWeatherId = hour.weather[0].id;
                let HourIcon = null;
                if (hourWeatherId >= 200 && hourWeatherId < 300) {
                  // Tormenta
                  HourIcon = <WiDayThunderstorm className="w-7 h-7 mx-auto text-yellow-400" />;
                } else if (hourWeatherId >= 300 && hourWeatherId < 400) {
                  // Llovizna
                  HourIcon = <WiDaySprinkle className="w-7 h-7 mx-auto text-sky-400" />;
                } else if (hourWeatherId >= 500 && hourWeatherId < 600) {
                  // Lluvia
                  HourIcon = <WiDayRain className="w-7 h-7 mx-auto text-blue-400" />;
                } else if (hourWeatherId >= 600 && hourWeatherId < 700) {
                  // Nieve
                  HourIcon = <WiDaySnow className="w-7 h-7 mx-auto text-slate-200" />;
                } else if (hourWeatherId >= 700 && hourWeatherId < 800) {
                  // Niebla
                  HourIcon = <WiFog className="w-7 h-7 mx-auto text-gray-400" />;
                } else if (hourWeatherId === 800) {
                  // Despejado
                  HourIcon = <WiDaySunny className="w-7 h-7 mx-auto text-yellow-300" />;
                } else if (hourWeatherId >= 801 && hourWeatherId < 900) {
                  // Nublado
                  HourIcon = <WiDayCloudy className="w-7 h-7 mx-auto text-gray-300" />;
                } else {
                  // Desconocido
                  HourIcon = <WiDaySunny className="w-7 h-7 mx-auto text-gray-400" />;
                }
                return (
                  <div key={index} className="flex flex-col items-center justify-center bg-white/5 rounded-lg p-3 shadow-sm border border-white/10">
                    <div className="text-xs text-white/50 mb-1">
                      {index === 0 ? 'Ahora' : formatTime(hour.dt)}
                    </div>
                    <div className="mb-1">
                      {HourIcon}
                    </div>
                    <div className="text-white font-bold text-lg">
                      {Math.round(hour.temp)}°
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Daily Forecast */}
        {weatherData.daily && weatherData.daily.length > 0 && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <h4 className="text-lg font-semibold text-white mb-4">Pronóstico de 7 Días</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
              {weatherData.daily.slice(0, 7).map((day, index) => {
                // Icono dinámico igual que en el pronóstico por horas
                const dayWeatherId = day.weather[0].id;
                let DayIcon = null;
                if (dayWeatherId >= 200 && dayWeatherId < 300) {
                  // Tormenta
                  DayIcon = <WiDayThunderstorm className="w-7 h-7 mx-auto text-yellow-400" />;
                } else if (dayWeatherId >= 300 && dayWeatherId < 400) {
                  // Llovizna
                  DayIcon = <WiDaySprinkle className="w-7 h-7 mx-auto text-sky-400" />;
                } else if (dayWeatherId >= 500 && dayWeatherId < 600) {
                  // Lluvia
                  DayIcon = <WiDayRain className="w-7 h-7 mx-auto text-blue-400" />;
                } else if (dayWeatherId >= 600 && dayWeatherId < 700) {
                  // Nieve
                  DayIcon = <WiDaySnow className="w-7 h-7 mx-auto text-slate-200" />;
                } else if (dayWeatherId >= 700 && dayWeatherId < 800) {
                  // Niebla
                  DayIcon = <WiFog className="w-7 h-7 mx-auto text-gray-400" />;
                } else if (dayWeatherId === 800) {
                  // Despejado
                  DayIcon = <WiDaySunny className="w-7 h-7 mx-auto text-yellow-300" />;
                } else if (dayWeatherId >= 801 && dayWeatherId < 900) {
                  // Nublado
                  DayIcon = <WiDayCloudy className="w-7 h-7 mx-auto text-gray-300" />;
                } else {
                  // Desconocido
                  DayIcon = <WiDaySunny className="w-7 h-7 mx-auto text-gray-400" />;
                }
                return (
                  <div key={index} className="text-center p-4 bg-white/5 rounded-lg flex flex-col items-center justify-center">
                    <div className="text-sm text-white/50 mb-2">
                      {index === 0 ? 'Hoy' : formatDate(day.dt)}
                    </div>
                    <div className="mb-2">
                      {DayIcon}
                    </div>
                    <div className="text-white font-medium text-sm mb-1">
                      {Math.round(day.temp.max)}° / {Math.round(day.temp.min)}°
                    </div>
                    <div className="text-xs text-white/70">
                      {getWeatherDescription(day.weather[0].id)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherDataDisplay; 