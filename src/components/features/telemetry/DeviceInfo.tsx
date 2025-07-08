// ============================================================================
// DEVICE INFO MODAL
// Component for displaying detailed device information
// ============================================================================

import React from 'react';
import { DeviceInfo as DeviceInfoType, DeviceInfoData, DeviceCharacteristicsData } from '../../../types/telemetry';

interface DeviceInfoProps {
  device: DeviceInfoType;
  deviceInfo: DeviceInfoData | null;
  deviceCharacteristics: DeviceCharacteristicsData | null;
  onClose: () => void;
  loading: boolean;
}

const DeviceInfo: React.FC<DeviceInfoProps> = ({
  device,
  deviceInfo,
  deviceCharacteristics,
  onClose,
  loading
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'text-emerald-400' : 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    return status === 'active' ? (
      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ) : (
      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg max-w-2xl w-full mx-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
            <span className="ml-3 text-white/70 text-sm">Cargando información del dispositivo...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Información del Dispositivo</h2>
          </div>
          
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Basic Device Information */}
          <div className="space-y-6">
            <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Información Básica
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Nombre:</span>
                  <span className="text-white font-medium">{device.DeviceName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Tipo:</span>
                  <span className="text-white font-medium">{device.DeviceType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">MAC:</span>
                  <span className="text-white font-medium font-mono text-sm">{device.DeviceMac}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Estado:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <span className={`font-medium ${getStatusColor(device.status)}`}>
                      {device.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Creado:</span>
                  <span className="text-white font-medium text-sm">{formatDate(device.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Location Information */}
            {deviceInfo?.location && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Ubicación
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Latitud:</span>
                    <span className="text-white font-medium">{deviceInfo.location.latitude}°</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Longitud:</span>
                    <span className="text-white font-medium">{deviceInfo.location.longitude}°</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Elevación:</span>
                    <span className="text-white font-medium">{deviceInfo.location.elevation} m</span>
                  </div>
                </div>
              </div>
            )}

            {/* EcoWitt Characteristics */}
            {deviceCharacteristics?.ecowittInfo && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Características EcoWitt
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Modelo:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.model}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">ID del Dispositivo:</span>
                    <span className="text-white font-medium font-mono text-sm">{deviceCharacteristics.ecowittInfo.device_id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">País:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.country}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Ciudad:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.city}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Zona Horaria:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.timezone}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Firmware:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.firmware_version}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Hardware:</span>
                    <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.hardware_version}</span>
                  </div>
                  
                  {deviceCharacteristics.ecowittInfo.battery_level && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Batería:</span>
                      <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.battery_level}%</span>
                    </div>
                  )}
                  
                  {deviceCharacteristics.ecowittInfo.signal_strength && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Señal:</span>
                      <span className="text-white font-medium">{deviceCharacteristics.ecowittInfo.signal_strength} dBm</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sensors and Current Data */}
          <div className="space-y-6">
            {/* Sensors List */}
            {deviceInfo?.sensors && deviceInfo.sensors.length > 0 && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                  Sensores Disponibles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {deviceInfo.sensors.map((sensor, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div>
                        <span className="text-white font-medium text-sm">{sensor.name}</span>
                        <div className="text-white/50 text-xs">{sensor.unit}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/50">{sensor.type}</span>
                        {sensor.enabled && (
                          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Data */}
            {deviceInfo?.currentData && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Datos Actuales
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(deviceInfo.currentData).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-white/70 text-sm capitalize">{key}:</span>
                      <span className="text-white font-medium text-sm">
                        {typeof value === 'number' ? value.toFixed(2) : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 text-xs text-white/50 text-center">
                  Última actualización: {deviceInfo.lastUpdate ? formatDate(deviceInfo.lastUpdate) : 'N/A'}
                </div>
              </div>
            )}

            {/* No Data Available */}
            {!deviceInfo?.sensors && !deviceInfo?.currentData && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-white mb-2">Sin Datos Disponibles</h3>
                  <p className="text-white/60 text-sm">
                    No hay información detallada disponible para este dispositivo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/20 flex justify-end">
          <button
            onClick={onClose}
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 rounded-lg px-6 py-2 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo; 