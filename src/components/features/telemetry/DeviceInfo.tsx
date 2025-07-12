// ============================================================================
// DEVICE INFO MODAL
// Component for displaying detailed device information
// ============================================================================

import React from 'react';
import { useEffect } from 'react';
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
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  // DEBUG: Verifica qué llega realmente
  console.log('DeviceInfo - deviceCharacteristics:', deviceCharacteristics);
  console.log('DeviceInfo - deviceCharacteristics.ecowittInfo:', deviceCharacteristics?.ecowittInfo);

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
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        
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
                  <span className="text-white font-medium text-sm">{device.DeviceName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Tipo:</span>
                  <span className="text-white font-medium text-sm">{device.DeviceType}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">MAC:</span>
                  <span className="text-white font-medium font-mono text-sm">{device.DeviceMac}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white/70 text-sm">Estado:</span>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(device.status)}
                    <span className={`font-medium text-sm ${getStatusColor(device.status)}`}>
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
            {deviceInfo?.latitude && deviceInfo?.longitude && (
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
                    <span className="text-white font-medium">{deviceInfo.latitude}°</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Longitud:</span>
                    <span className="text-white font-medium">{deviceInfo.longitude}°</span>
                  </div>
                  
                  {deviceInfo.elevation && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">Elevación:</span>
                      <span className="text-white font-medium">{deviceInfo.elevation} m</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* EcoWitt Characteristics - SIEMPRE mostrar si existe data */}
            {deviceCharacteristics?.ecowittInfo && deviceCharacteristics.ecowittInfo.data && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Información EcoWitt
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">ID EcoWitt:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Nombre EcoWitt:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.name}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">MAC:</span>
                    <span className="text-white font-medium font-mono text-sm">{deviceCharacteristics.ecowittInfo.data.mac}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Tipo:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Estación:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.stationtype}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Zona Horaria:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.date_zone_id}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Creado:</span>
                    <span className="text-white font-medium text-sm">{new Date(deviceCharacteristics.ecowittInfo.data.createtime * 1000).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Latitud:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.latitude}°</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm">Longitud:</span>
                    <span className="text-white font-medium text-sm">{deviceCharacteristics.ecowittInfo.data.longitude}°</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sensors and Current Data + EcoWitt Real-time Data */}
          <div className="space-y-6 max-h-[90vh]">
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

            {/* EcoWitt Real-time Data - SIEMPRE mostrar si existe last_update */}
            {deviceCharacteristics?.ecowittInfo && deviceCharacteristics.ecowittInfo.data && deviceCharacteristics.ecowittInfo.data.last_update && (
              <div className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Datos del sensor EcoWitt 
                </h3>
                
                <div className="space-y-4">
                  {/* Indoor Sensors */}
                  {deviceCharacteristics.ecowittInfo.data.last_update.indoor && (
                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Sensores Interiores</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {deviceCharacteristics.ecowittInfo.data.last_update.indoor.temperature && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Temperatura:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.indoor.temperature.value} {deviceCharacteristics.ecowittInfo.data.last_update.indoor.temperature.unit}
                            </span>
                          </div>
                        )}
                        {deviceCharacteristics.ecowittInfo.data.last_update.indoor.humidity && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Humedad:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.indoor.humidity.value} {deviceCharacteristics.ecowittInfo.data.last_update.indoor.humidity.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pressure Sensors */}
                  {deviceCharacteristics.ecowittInfo.data.last_update.pressure && (
                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Sensores de Presión</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {deviceCharacteristics.ecowittInfo.data.last_update.pressure.relative && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Relativa:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.pressure.relative.value} {deviceCharacteristics.ecowittInfo.data.last_update.pressure.relative.unit}
                            </span>
                          </div>
                        )}
                        {deviceCharacteristics.ecowittInfo.data.last_update.pressure.absolute && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Absoluta:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.pressure.absolute.value} {deviceCharacteristics.ecowittInfo.data.last_update.pressure.absolute.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Soil Sensors CH1 */}
                  {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1 && (
                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Sensor de Suelo CH1</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.soilmoisture && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Humedad:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.soilmoisture.value} {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.soilmoisture.unit}
                            </span>
                          </div>
                        )}
                        {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.ad && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Señal AD:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.ad.value} {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch1.ad.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Soil Sensors CH9 */}
                  {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9 && (
                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Sensor de Suelo CH9</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.soilmoisture && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Humedad:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.soilmoisture.value} {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.soilmoisture.unit}
                            </span>
                          </div>
                        )}
                        {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.ad && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Señal AD:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.ad.value} {deviceCharacteristics.ecowittInfo.data.last_update.soil_ch9.ad.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Battery Sensors */}
                  {deviceCharacteristics.ecowittInfo.data.last_update.battery && (
                    <div>
                      <h4 className="text-sm font-medium text-white/80 mb-2">Baterías</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch1 && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Sensor Suelo CH1:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch1.value} {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch1.unit}
                            </span>
                          </div>
                        )}
                        {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch9 && (
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70 text-sm">Sensor Suelo CH9:</span>
                            <span className="text-white font-medium text-sm">
                              {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch9.value} {deviceCharacteristics.ecowittInfo.data.last_update.battery.soilmoisture_sensor_ch9.unit}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-xs text-white/50 text-center">
                  Última actualización EcoWitt: {new Date(parseInt(deviceCharacteristics.ecowittInfo.time) * 1000).toLocaleString()}
                </div>
              </div>
            )}

            {/* No Data Available (solo si no hay nada de lo anterior) */}
            {!deviceInfo?.sensors && !deviceInfo?.currentData && !(deviceCharacteristics?.ecowittInfo && deviceCharacteristics.ecowittInfo.data && deviceCharacteristics.ecowittInfo.data.last_update) && (
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