/**
 * Componente para controlar el monitoreo de telemetría
 */

import React, { useState } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon,
  CogIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface TelemetryControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
  onRefresh: () => void;
  onSettings?: () => void;
  lastUpdate?: Date;
  updateInterval?: number;
  className?: string;
}

export default function TelemetryControls({
  isRunning,
  onStart,
  onStop,
  onRefresh,
  onSettings,
  lastUpdate,
  updateInterval = 30000,
  className = ''
}: TelemetryControlsProps) {
  const [showIntervalInfo, setShowIntervalInfo] = useState(false);

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Función para formatear el intervalo
  const formatInterval = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between">
        {/* Estado del monitoreo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-white font-medium text-lg">
              {isRunning ? 'Monitoreando' : 'Detenido'}
            </span>
          </div>

          {/* Información de intervalo */}
          <div 
            className="relative"
            onMouseEnter={() => setShowIntervalInfo(true)}
            onMouseLeave={() => setShowIntervalInfo(false)}
          >
            <div className="flex items-center text-lg text-white/60 cursor-help">
              <SignalIcon className="w-4 h-4 mr-1" />
              Intervalo: {formatInterval(updateInterval)}
            </div>
            
            {/* Tooltip de información */}
            {showIntervalInfo && (
              <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg whitespace-nowrap z-10">
                Actualización cada {formatInterval(updateInterval)}
                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
              </div>
            )}
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center space-x-2">
          {/* Botón de configuración */}
          {onSettings && (
            <button
              onClick={onSettings}
              className="p-2 text-lg text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
              title="Configuración"
            >
              <CogIcon className="w-5 h-5" />
            </button>
          )}

          {/* Botón de refrescar */}
          <button
            onClick={onRefresh}
            className="p-2 text-lg text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            title="Refrescar datos"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>

          {/* Botón de play/pause */}
          <button
            onClick={isRunning ? onStop : onStart}
            className={`px-4 py-2 text-lg rounded-lg font-medium transition-all duration-200 ${
              isRunning
                ? 'bg-red-500/20 text-red-400 border border-red-400/30 hover:bg-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 hover:bg-emerald-500/30'
            }`}
            title={isRunning ? 'Detener monitoreo' : 'Iniciar monitoreo'}
          >
            <div className="flex items-center">
              {isRunning ? (
                <>
                  <PauseIcon className="w-4 h-4 mr-2" />
                  Detener
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Iniciar
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Información de última actualización */}
      {lastUpdate && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between text-lg">
            <span className="text-white/60">Última actualización:</span>
            <span className="text-white font-mono">
              {formatDate(lastUpdate)}
            </span>
          </div>
        </div>
      )}

      {/* Indicador de estado */}
      <div className="mt-3">
          <div className="flex items-center justify-between text-lg text-white/40">
          <span>Estado del sistema</span>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isRunning ? 'bg-emerald-400' : 'bg-gray-400'
            }`}></div>
            <span>{isRunning ? 'Activo' : 'Inactivo'}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 