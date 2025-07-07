/**
 * Componente para mostrar estadísticas de telemetría
 */

import React from 'react';
import { TelemetryStats as TelemetryStatsType } from '@/types/telemetry';
import { 
  ChartBarIcon, 
  ClockIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface TelemetryStatsProps {
  stats: TelemetryStatsType;
  className?: string;
}

export default function TelemetryStats({ stats, className = '' }: TelemetryStatsProps) {
  // Función para formatear números
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-ES').format(num);
  };

  // Función para formatear tiempo en milisegundos
  const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  // Función para obtener el color del porcentaje de error
  const getErrorRateColor = (rate: number) => {
    if (rate < 0.05) return 'text-emerald-400';
    if (rate < 0.1) return 'text-yellow-400';
    if (rate < 0.2) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <ChartBarIcon className="w-6 h-6 text-emerald-400 mr-3" />
        <h3 className="text-xl font-semibold text-white">Estadísticas del Sistema</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de lecturas */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Total de Lecturas</p>
              <p className="text-2xl font-bold text-white">
                {formatNumber(stats.totalReadings)}
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Tiempo de respuesta promedio */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Tiempo de Respuesta</p>
              <p className="text-2xl font-bold text-white">
                {formatResponseTime(stats.averageResponseTime)}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Tasa de error */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Tasa de Error</p>
              <p className={`text-2xl font-bold ${getErrorRateColor(stats.errorRate)}`}>
                {(stats.errorRate * 100).toFixed(1)}%
              </p>
            </div>
            <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        {/* Estado del sistema */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60 mb-1">Estado del Sistema</p>
              <p className="text-lg font-bold text-emerald-400">
                {stats.errorRate < 0.05 ? 'Óptimo' : 
                 stats.errorRate < 0.1 ? 'Bueno' : 
                 stats.errorRate < 0.2 ? 'Atención' : 'Crítico'}
              </p>
            </div>
            {stats.errorRate < 0.05 ? (
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
            ) : (
              <XCircleIcon className="w-8 h-8 text-red-400" />
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas de las últimas 24 horas */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">Últimas 24 Horas</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-emerald-400/10 border border-emerald-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-300 mb-1">Lecturas</p>
                <p className="text-xl font-bold text-emerald-400">
                  {formatNumber(stats.last24Hours.readings)}
                </p>
              </div>
              <CheckCircleIcon className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300 mb-1">Errores</p>
                <p className="text-xl font-bold text-red-400">
                  {formatNumber(stats.last24Hours.errors)}
                </p>
              </div>
              <XCircleIcon className="w-6 h-6 text-red-400" />
            </div>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-300 mb-1">Alertas</p>
                <p className="text-xl font-bold text-yellow-400">
                  {formatNumber(stats.last24Hours.alerts)}
                </p>
              </div>
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Indicadores de rendimiento */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-white mb-4">Indicadores de Rendimiento</h4>
        <div className="space-y-3">
          {/* Barra de disponibilidad */}
          <div>
            <div className="flex justify-between text-sm text-white/60 mb-1">
              <span>Disponibilidad del Sistema</span>
              <span>{((1 - stats.errorRate) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(1 - stats.errorRate) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Barra de rendimiento */}
          <div>
            <div className="flex justify-between text-sm text-white/60 mb-1">
              <span>Rendimiento</span>
              <span>{stats.averageResponseTime < 1000 ? 'Excelente' : 
                     stats.averageResponseTime < 2000 ? 'Bueno' : 
                     stats.averageResponseTime < 5000 ? 'Regular' : 'Lento'}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  stats.averageResponseTime < 1000 ? 'bg-emerald-400' :
                  stats.averageResponseTime < 2000 ? 'bg-blue-400' :
                  stats.averageResponseTime < 5000 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
                style={{ 
                  width: `${Math.min(100, Math.max(0, 100 - (stats.averageResponseTime / 10000) * 100))}%` 
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 