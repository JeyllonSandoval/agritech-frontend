// ============================================================================
// DEVICE MANAGER
// Component for managing telemetry devices
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  DevicePhoneMobileIcon, 
  InformationCircleIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  SignalIcon,
  WifiIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { DeviceInfo } from '../../../types/telemetry';
import telemetryService from '../../../services/telemetryService';
import DeviceInfoModal from './DeviceInfoModal';

interface DeviceManagerProps {
  onClose: () => void;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ onClose }) => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [showDeviceInfo, setShowDeviceInfo] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.UserID;

      const response = await telemetryService.getDevices({ userId });
      if (response.success && response.data) {
        setDevices(response.data);
      } else {
        throw new Error('Error al cargar dispositivos');
      }
    } catch (error) {
      console.error('Error cargando dispositivos:', error);
      setError('Error al cargar los dispositivos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeviceInfo = (device: DeviceInfo) => {
    setSelectedDevice(device);
    setShowDeviceInfo(true);
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este dispositivo?')) {
      return;
    }

    try {
      const response = await telemetryService.deleteDevice(deviceId);
      if (response.success) {
        setDevices(prev => prev.filter(device => device.DeviceID !== deviceId));
      } else {
        throw new Error('Error al eliminar dispositivo');
      }
    } catch (error) {
      console.error('Error eliminando dispositivo:', error);
      setError('Error al eliminar el dispositivo');
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

  const filteredDevices = devices.filter(device => {
    if (filter === 'all') return true;
    return device.status === filter;
  });

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
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <DevicePhoneMobileIcon className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Dispositivos</h2>
              <p className="text-white/60 text-sm">
                Administra y configura tus dispositivos de telemetría
              </p>
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
          {/* Filters and Actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg p-1">
                {(['all', 'active', 'inactive'] as const).map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                      filter === filterOption
                        ? 'bg-emerald-500 text-white'
                        : 'text-white/70 hover:text-white hover:bg-white/20'
                    }`}
                  >
                    {filterOption === 'all' ? 'Todos' : 
                     filterOption === 'active' ? 'Activos' : 'Inactivos'}
                  </button>
                ))}
              </div>
              <span className="text-white/60 text-sm">
                {filteredDevices.length} dispositivo{filteredDevices.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => window.location.href = '/telemetry/add-device'}
              className="flex items-center gap-2 text-lg px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Agregar Dispositivo
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/80">Cargando dispositivos...</span>
              </div>
            </div>
          ) : filteredDevices.length === 0 ? (
            <div className="text-center py-12">
              <DevicePhoneMobileIcon className="w-16 h-16 text-lg text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay dispositivos</h3>
              <p className="text-white/60 mb-6 text-lg">
                {filter === 'all' 
                  ? 'Aún no tienes dispositivos registrados.'
                  : `No hay dispositivos ${filter === 'active' ? 'activos' : 'inactivos'}.`
                }
              </p>
            </div>
          ) : (
            /* Devices Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDevices.map((device) => (
                <div
                  key={device.DeviceID}
                  className="bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  {/* Device Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getDeviceTypeIcon(device.DeviceType)}
                      <div>
                        <h3 className="font-semibold text-white text-lg">{device.DeviceName}</h3>
                        <p className="text-white/60 text-sm">{getDeviceTypeText(device.DeviceType)}</p>
                      </div>
                    </div>
                    {getStatusIcon(device.status)}
                  </div>

                  {/* Device Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Estado:</span>
                      <span className={`font-medium ${
                        device.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                      }`}>
                        {getStatusText(device.status)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">MAC:</span>
                      <span className="text-white font-mono text-xs">{device.DeviceMac}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Creado:</span>
                      <span className="text-white/80 text-xs">
                        {new Date(device.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeviceInfo(device)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 text-sm"
                    >
                      <InformationCircleIcon className="w-4 h-4" />
                      Información
                    </button>
                    <button
                      onClick={() => {/* TODO: Implement edit */}}
                      className="p-2 bg-white/10 border border-white/20 text-white/70 rounded-lg hover:bg-white/20 transition-all duration-300"
                      title="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDevice(device.DeviceID)}
                      className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                      title="Eliminar"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Info Modal */}
        {showDeviceInfo && selectedDevice && (
          <DeviceInfoModal
            device={selectedDevice}
            onClose={() => setShowDeviceInfo(false)}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceManager; 