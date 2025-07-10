// ============================================================================
// TELEMETRY CONTROLS
// Component for telemetry control buttons and actions
// ============================================================================

import React from 'react';
import { DeviceInfo } from '../../../types/telemetry';

interface TelemetryControlsProps {
  polling: boolean;
  loading: boolean;
  onRefresh: () => void;
  onTogglePolling: () => void;
  onShowDeviceInfo?: () => void;
  onShowDeviceComparison?: () => void;
  onShowGroupManager?: () => void;
  onShowReports?: () => void;
  selectedDevice?: DeviceInfo | null;
}

const TelemetryControls: React.FC<TelemetryControlsProps> = ({
  polling,
  loading,
  onRefresh,
  onTogglePolling,
  onShowDeviceInfo,
  onShowDeviceComparison,
  onShowGroupManager,
  onShowReports,
  selectedDevice
}) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      <h2 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Controles
      </h2>
      
      <div className="space-y-3">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="w-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-medium text-sm">
            {loading ? 'Actualizando...' : 'Actualizar Datos'}
          </span>
        </button>

        {/* Polling Toggle */}
        <button
          onClick={onTogglePolling}
          disabled={loading}
          className={`w-full border transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            polling
              ? 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          {polling ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium text-sm">
            {polling ? 'Pausar Actualización' : 'Iniciar Actualización'}
          </span>
        </button>

        {/* Device Info Button */}
        {selectedDevice && onShowDeviceInfo && (
          <button
            onClick={onShowDeviceInfo}
            disabled={loading}
            className="w-full bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-sm">Información del Dispositivo</span>
          </button>
        )}

        {/* Device Comparison Button */}
        {onShowDeviceComparison && (
          <button
            onClick={onShowDeviceComparison}
            disabled={loading}
            className="w-full bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="font-medium text-sm">Comparar Dispositivos</span>
          </button>
        )}

        {/* Device Group Manager Button */}
        {onShowGroupManager && (
          <button
            onClick={onShowGroupManager}
            disabled={loading}
            className="w-full bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-medium text-sm">Gestionar Grupos</span>
          </button>
        )}

        {/* Telemetry Reports Button */}
        {onShowReports && (
          <button
            onClick={onShowReports}
            disabled={loading}
            className="w-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 transition-all duration-300 rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="font-medium text-sm">Generar Reportes</span>
          </button>
        )}

        {/* Status Indicator */}
        <div className="bg-white/10 border border-white/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">Estado:</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                polling ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'
              }`} />
              <span className={`text-sm ${
                polling ? 'text-emerald-400' : 'text-gray-400'
              }`}>
                {polling ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="text-xs text-white/50 text-center">
          Los datos se actualizan automáticamente cada minuto cuando está activo
        </div>
      </div>
    </div>
  );
};

export default TelemetryControls; 