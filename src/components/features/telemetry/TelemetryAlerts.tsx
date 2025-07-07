/**
 * Componente para mostrar alertas de telemetría
 */

import React from 'react';
import { TelemetryAlert } from '@/types/telemetry';
import { 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface TelemetryAlertsProps {
  alerts: TelemetryAlert[];
  onAcknowledge: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  className?: string;
}

export default function TelemetryAlerts({ 
  alerts, 
  onAcknowledge, 
  onDismiss,
  className = '' 
}: TelemetryAlertsProps) {
  
  // Función para obtener el icono según la severidad
  const getSeverityIcon = (severity: TelemetryAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-400" />;
      case 'high':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
      case 'medium':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
      case 'low':
        return <InformationCircleIcon className="w-5 h-5 text-blue-400" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  // Función para obtener el color de fondo según la severidad
  const getSeverityColor = (severity: TelemetryAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/10 border-red-400/30';
      case 'high':
        return 'bg-orange-500/10 border-orange-400/30';
      case 'medium':
        return 'bg-yellow-500/10 border-yellow-400/30';
      case 'low':
        return 'bg-blue-500/10 border-blue-400/30';
      default:
        return 'bg-gray-500/10 border-gray-400/30';
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para obtener el texto de la severidad
  const getSeverityText = (severity: TelemetryAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'high':
        return 'Alto';
      case 'medium':
        return 'Medio';
      case 'low':
        return 'Bajo';
      default:
        return 'Desconocido';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${className}`}>
        <div className="text-center">
          <CheckCircleIcon className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Sin Alertas
          </h3>
          <p className="text-white/70 text-lg">
            No hay alertas activas en este momento
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          Alertas del Sistema
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/60">
            {alerts.length} alerta{alerts.length !== 1 ? 's' : ''}
          </span>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} transition-all duration-200 ${
              alert.acknowledged ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                {getSeverityIcon(alert.severity)}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-white">
                      {alert.message}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.severity === 'critical' ? 'bg-red-400/20 text-red-300' :
                      alert.severity === 'high' ? 'bg-orange-400/20 text-orange-300' :
                      alert.severity === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                      'bg-blue-400/20 text-blue-300'
                    }`}>
                      {getSeverityText(alert.severity)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-white/60 space-y-1">
                    <p>Dispositivo: {alert.deviceId}</p>
                    <p>Sensor: {alert.sensorId}</p>
                    <p>Tipo: {alert.type}</p>
                    {alert.value !== undefined && (
                      <p>Valor: {alert.value}</p>
                    )}
                    {alert.threshold !== undefined && (
                      <p>Umbral: {alert.threshold}</p>
                    )}
                    <p>Hora: {formatDate(alert.timestamp)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 rounded hover:bg-emerald-500/30 transition-colors duration-200"
                    title="Reconocer alerta"
                  >
                    Reconocer
                  </button>
                )}
                
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors duration-200"
                  title="Descartar alerta"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {alert.acknowledged && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center text-sm text-emerald-400">
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Alerta reconocida
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Resumen de alertas */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-400">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-xs text-white/60">Críticas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-400">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-xs text-white/60">Altas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400">
              {alerts.filter(a => a.severity === 'medium').length}
            </div>
            <div className="text-xs text-white/60">Medias</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">
              {alerts.filter(a => a.severity === 'low').length}
            </div>
            <div className="text-xs text-white/60">Bajas</div>
          </div>
        </div>
      </div>
    </div>
  );
} 