// ============================================================================
// TELEMETRY ALERTS
// Component for displaying telemetry alerts and notifications
// ============================================================================

import React from 'react';
import { TelemetryAlert } from '../../../types/telemetry';

interface TelemetryAlertsProps {
  alerts: TelemetryAlert[];
  onAcknowledge: (alertId: string) => void;
  onClear: () => void;
}

const TelemetryAlerts: React.FC<TelemetryAlertsProps> = ({
  alerts,
  onAcknowledge,
  onClear
}) => {
  const getAlertIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500/10 border-red-500/20 text-red-300';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-300';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6zM4 5h6v6H4V5zm10 0h6v6h-6V5zm0 10h6v6h-6v-6z" />
          </svg>
          <h2 className="text-lg md:text-xl font-semibold text-white">Alertas</h2>
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            {alerts.length}
          </span>
        </div>
        
        <button
          onClick={onClear}
          className="text-white/70 hover:text-white transition-colors p-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border backdrop-blur-sm transition-all duration-200 hover:scale-105 ${getAlertColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold">{alert.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-2">{alert.message}</p>
                  
                  {alert.deviceName && (
                    <div className="flex items-center gap-2 text-xs opacity-75">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{alert.deviceName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs opacity-75 mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{formatTimestamp(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                {!alert.acknowledged && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="text-white/70 hover:text-white transition-colors p-1"
                    title="Marcar como leída"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                )}
                
                {alert.acknowledged && (
                  <div className="flex items-center gap-1 text-xs opacity-75">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Leída</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Data */}
            {alert.data && Object.keys(alert.data).length > 0 && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {Object.entries(alert.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="opacity-75">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-400"></div>
              <span className="text-white/70">
                {alerts.filter(a => a.severity === 'critical').length} críticas
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-white/70">
                {alerts.filter(a => a.severity === 'warning').length} advertencias
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-white/70">
                {alerts.filter(a => a.severity === 'info').length} informativas
              </span>
            </div>
          </div>
          
          <div className="text-white/50">
            {alerts.filter(a => !a.acknowledged).length} sin leer
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemetryAlerts; 