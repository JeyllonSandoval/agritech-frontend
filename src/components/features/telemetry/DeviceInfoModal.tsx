// ============================================================================
// DEVICE INFO MODAL
// Modal for displaying detailed device information
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon, 
  SignalIcon,
  WifiIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  MapPinIcon,
  CalendarIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { DeviceInfo, DeviceInfoData } from '../../../types/telemetry';
import telemetryService from '../../../services/telemetryService';

interface DeviceInfoModalProps {
  device: DeviceInfo;
  onClose: () => void;
}

const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ device, onClose }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDeviceInfo();
  }, [device.DeviceID]);

  const loadDeviceInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await telemetryService.getDeviceInfo(device.DeviceID);
      if (response.success && response.data) {
        setDeviceInfo(response.data);
      } else {
        throw new Error('Error al cargar información del dispositivo');
      }
    } catch (error) {
      console.error('Error cargando información del dispositivo:', error);
      setError('Error al cargar la información del dispositivo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="w-5 h-5 text-emerald-400" />;
      case 'inactive':
        return <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getDeviceTypeIcon = (type: string) => {
    switch (type) {
      case 'Outdoor':
        return <SignalIcon className="w-5 h-5 text-blue-400" />;
      case 'Indoor':
        return <WifiIcon className="w-5 h-5 text-purple-400" />;
      case 'Hybrid':
        return <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400" />;
      default:
        return <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'Desconocido';
    }
  };

  const getDeviceTypeText = (type: string) => {
    switch (type) {
      case 'Outdoor':
        return 'Exterior';
      case 'Indoor':
        return 'Interior';
      case 'Hybrid':
        return 'Híbrido';
      default:
        return type;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <DevicePhoneMobileIcon className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Información del Dispositivo</h2>
              <p className="text-white/60 text-sm">{device.DeviceName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/80">Cargando información...</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CogIcon className="w-5 h-5 text-emerald-400" />
                  Información Básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Nombre:</span>
                      <span className="text-white font-medium">{device.DeviceName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Tipo:</span>
                      <div className="flex items-center gap-2">
                        {getDeviceTypeIcon(device.DeviceType)}
                        <span className="text-white">{getDeviceTypeText(device.DeviceType)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Estado:</span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(device.status)}
                        <span className={`font-medium ${
                          device.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {getStatusText(device.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">MAC:</span>
                      <span className="text-white font-mono text-sm">{device.DeviceMac}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">ID:</span>
                      <span className="text-white font-mono text-sm">{device.DeviceID}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Creado:</span>
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-white/60" />
                        <span className="text-white/80 text-sm">
                          {new Date(device.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              {deviceInfo && (deviceInfo.latitude || deviceInfo.longitude) && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPinIcon className="w-5 h-5 text-blue-400" />
                    Ubicación
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Latitud:</span>
                        <span className="text-white font-medium">{deviceInfo.latitude}°</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Longitud:</span>
                        <span className="text-white font-medium">{deviceInfo.longitude}°</span>
                      </div>
                    </div>
                    
                    {deviceInfo.elevation && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-white/70">Elevación:</span>
                          <span className="text-white font-medium">{deviceInfo.elevation}m</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Current Data */}
              {deviceInfo && deviceInfo.currentData && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Datos Actuales</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {deviceInfo.currentData.temperature !== null && (
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-white">{deviceInfo.currentData.temperature}°C</div>
                        <div className="text-white/60 text-sm">Temperatura</div>
                      </div>
                    )}
                    
                    {deviceInfo.currentData.humidity !== null && (
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-white">{deviceInfo.currentData.humidity}%</div>
                        <div className="text-white/60 text-sm">Humedad</div>
                      </div>
                    )}
                    
                    {deviceInfo.currentData.pressure !== null && (
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-white">{deviceInfo.currentData.pressure}hPa</div>
                        <div className="text-white/60 text-sm">Presión</div>
                      </div>
                    )}
                    
                    {deviceInfo.currentData.windSpeed !== null && (
                      <div className="text-center p-3 bg-white/5 rounded-lg">
                        <div className="text-2xl font-bold text-white">{deviceInfo.currentData.windSpeed}km/h</div>
                        <div className="text-white/60 text-sm">Viento</div>
                      </div>
                    )}
                  </div>
                  
                  {deviceInfo.lastUpdate && (
                    <div className="mt-4 text-center">
                      <span className="text-white/60 text-sm">
                        Última actualización: {new Date(deviceInfo.lastUpdate).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Sensors */}
              {deviceInfo && deviceInfo.sensors && deviceInfo.sensors.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sensores</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {deviceInfo.sensors.map((sensor, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-white font-medium">{sensor.name}</span>
                        <span className="text-white/60 text-sm">{sensor.unit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceInfoModal; 