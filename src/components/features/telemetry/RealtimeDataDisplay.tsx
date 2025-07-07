/**
 * Componente para mostrar datos de telemetría en tiempo real
 */

import React from 'react';
import { 
  Device, 
  Sensor, 
  SensorStatus, 
  SensorType,
  LoadingState 
} from '@/types/telemetry';
import { 
  SignalIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  SunIcon,
  CloudIcon,
  BeakerIcon,
  BoltIcon,
  WifiIcon,
  Battery100Icon,
  FireIcon,
  SparklesIcon,
  CpuChipIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface RealtimeDataDisplayProps {
  devices: Device[];
  loadingState: LoadingState;
  lastUpdate?: Date;
  onDeviceClick?: (device: Device) => void;
}

export default function RealtimeDataDisplay({ 
  devices, 
  loadingState, 
  lastUpdate,
  onDeviceClick 
}: RealtimeDataDisplayProps) {
  
  // Función para obtener el icono del estado del sensor
  const getSensorStatusIcon = (status: SensorStatus) => {
    switch (status) {
      case SensorStatus.ONLINE:
        return <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
      case SensorStatus.OFFLINE:
        return <XCircleIcon className="w-4 h-4 text-red-400" />;
      case SensorStatus.ERROR:
        return <ExclamationTriangleIcon className="w-4 h-4 text-yellow-400" />;
      case SensorStatus.WARNING:
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-400" />;
      default:
        return <SignalIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  // Función para obtener el color del estado del dispositivo
  const getDeviceStatusColor = (status: SensorStatus) => {
    switch (status) {
      case SensorStatus.ONLINE:
        return 'border-emerald-400/30 bg-emerald-400/10';
      case SensorStatus.OFFLINE:
        return 'border-red-400/30 bg-red-400/10';
      case SensorStatus.ERROR:
        return 'border-yellow-400/30 bg-yellow-400/10';
      case SensorStatus.WARNING:
        return 'border-orange-400/30 bg-orange-400/10';
      default:
        return 'border-gray-400/30 bg-gray-400/10';
    }
  };

  // Función para formatear la fecha
  const formatDate = (date: Date) => {
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Función para obtener el icono del tipo de sensor
  const getSensorTypeIcon = (type: SensorType) => {
    switch (type) {
      case SensorType.TEMPERATURE:
        return <FireIcon className="w-4 h-4 text-orange-400" />;
      case SensorType.HUMIDITY:
        return <CloudIcon className="w-4 h-4 text-blue-400" />;
      case SensorType.PRESSURE:
        return <ChartBarIcon className="w-4 h-4 text-purple-400" />;
      case SensorType.WIND:
        return <SparklesIcon className="w-4 h-4 text-cyan-400" />;
      case SensorType.RAINFALL:
        return <CloudIcon className="w-4 h-4 text-blue-500" />;
      case SensorType.SOIL:
        return <BeakerIcon className="w-4 h-4 text-green-400" />;
      case SensorType.SOLAR:
        return <SunIcon className="w-4 h-4 text-yellow-400" />;
      case SensorType.LEAF:
        return <CogIcon className="w-4 h-4 text-green-500" />;
      case SensorType.CO2:
        return <WifiIcon className="w-4 h-4 text-gray-400" />;
      case SensorType.PM25:
        return <CloudIcon className="w-4 h-4 text-gray-500" />;
      case SensorType.LIGHTNING:
        return <BoltIcon className="w-4 h-4 text-yellow-500" />;
      case SensorType.WATER_LEAK:
        return <CogIcon className="w-4 h-4 text-red-400" />;
      case SensorType.BATTERY:
        return <Battery100Icon className="w-4 h-4 text-green-400" />;
      default:
        return <SignalIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loadingState === LoadingState.LOADING) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400"></div>
        <span className="ml-3 text-white/70">Cargando datos...</span>
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center p-8">
        <SignalIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-white/70">No hay dispositivos disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de actualización */}
      <div className="flex items-center justify-between flex-col md:flex-row gap-4">
        <h3 className="text-xl font-semibold text-white">
          Datos en Tiempo Real
        </h3>
        {lastUpdate && (
          <div className="flex items-center text-sm text-white/60">
            <ClockIcon className="w-4 h-4 mr-2" />
            Última actualización: {formatDate(lastUpdate)}
          </div>
        )}
      </div>

      {/* Grid de dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`p-4 rounded-lg border backdrop-blur-sm transition-all duration-300 hover:scale-105 cursor-pointer ${getDeviceStatusColor(device.status)}`}
            onClick={() => onDeviceClick?.(device)}
          >
            {/* Header del dispositivo */}
            <div className="flex items-center text-lg justify-between mb-3">
              <div className="flex items-center">
                {getSensorStatusIcon(device.status)}
                <span className="ml-2 text-white font-medium">
                  {device.name}
                </span>
              </div>
              <span className="text-xs text-white/60">
                {device.sensors.length} sensores
              </span>
            </div>

            {/* Información del dispositivo */}
            <div className="text-xs text-white/60 mb-3">
              <p>MAC: {device.mac}</p>
              <p>Ubicación: {device.location}</p>
              <p>Estado: {device.status}</p>
            </div>

            {/* Sensores del dispositivo */}
            <div className="space-y-2 text-lg">
              {device.sensors.slice(0, 5).map((sensor) => (
                <div
                  key={sensor.id}
                  className="flex items-center justify-between p-2 bg-white/5 rounded"
                >
                  <div className="flex items-center">
                    <div className="mr-2">{getSensorTypeIcon(sensor.type)}</div>
                    <span className="text-sm text-white/80">
                      {sensor.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {sensor.value !== null ? `${sensor.value} ${sensor.unit}` : 'N/A'}
                    </div>
                    <div className="text-xs text-white/60">
                      {sensor.location}
                    </div>
                  </div>
                </div>
              ))}
              
              {device.sensors.length > 5 && (
                <div className="text-center text-xs text-white/60">
                  +{device.sensors.length - 5} sensores más
                </div>
              )}
            </div>

            {/* Última actualización del dispositivo */}
            <div className="mt-3 text-xs text-white/40">
              Actualizado: {formatDate(device.lastUpdate)}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de dispositivos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">
            {devices.length}
          </div>
          <div className="text-sm text-white/60">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-400">
            {devices.filter(d => d.status === SensorStatus.ONLINE).length}
          </div>
          <div className="text-sm text-white/60">En línea</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-400">
            {devices.filter(d => d.status === SensorStatus.OFFLINE).length}
          </div>
          <div className="text-sm text-white/60">Desconectados</div>
        </div>
      </div>
    </div>
  );
} 