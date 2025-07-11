// ============================================================================
// GROUP INFO MODAL
// Modal for displaying detailed group information
// ============================================================================

import React from 'react';
import { 
  UserGroupIcon, 
  DevicePhoneMobileIcon,
  SignalIcon,
  WifiIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CalendarIcon,
  CogIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Group, DeviceInfo } from '../../../types/telemetry';

interface GroupInfoModalProps {
  group: Group;
  devices: DeviceInfo[];
  onClose: () => void;
}

const GroupInfoModal: React.FC<GroupInfoModalProps> = ({ group, devices, onClose }) => {
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
        return <SignalIcon className="w-4 h-4 text-blue-400" />;
      case 'Indoor':
        return <WifiIcon className="w-4 h-4 text-purple-400" />;
      case 'Hybrid':
        return <DevicePhoneMobileIcon className="w-4 h-4 text-emerald-400" />;
      default:
        return <DevicePhoneMobileIcon className="w-4 h-4 text-gray-400" />;
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

  const activeDevices = devices.filter(device => device.status === 'active');
  const inactiveDevices = devices.filter(device => device.status === 'inactive');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Información del Grupo</h2>
              <p className="text-white/60 text-sm">{group.GroupName}</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Group Information */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <CogIcon className="w-5 h-5 text-emerald-400" />
                  Información Básica
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Nombre:</span>
                    <span className="text-white font-medium">{group.GroupName}</span>
                  </div>
                  
                  {group.Description && (
                    <div className="flex items-start justify-between">
                      <span className="text-white/70">Descripción:</span>
                      <span className="text-white text-right max-w-xs">{group.Description}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Estado:</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(group.status)}
                      <span className={`font-medium ${
                        group.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                      }`}>
                        {getStatusText(group.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">ID:</span>
                    <span className="text-white font-mono text-sm">{group.DeviceGroupID}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Creado:</span>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Actualizado:</span>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4 text-white/60" />
                      <span className="text-white/80 text-sm">
                        {new Date(group.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-blue-400" />
                  Estadísticas
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-white">{devices.length}</div>
                    <div className="text-white/60 text-sm">Total Dispositivos</div>
                  </div>
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-400">{activeDevices.length}</div>
                    <div className="text-white/60 text-sm">Dispositivos Activos</div>
                  </div>
                  
                  {inactiveDevices.length > 0 && (
                    <div className="text-center p-4 bg-white/5 rounded-lg">
                      <div className="text-2xl font-bold text-orange-400">{inactiveDevices.length}</div>
                      <div className="text-white/60 text-sm">Dispositivos Inactivos</div>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-white/5 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">
                      {devices.length > 0 ? Math.round((activeDevices.length / devices.length) * 100) : 0}%
                    </div>
                    <div className="text-white/60 text-sm">Tasa de Actividad</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Devices List */}
            <div className="space-y-6">
              <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-5 h-5 text-purple-400" />
                  Dispositivos ({devices.length})
                </h3>
                
                {devices.length === 0 ? (
                  <div className="text-center py-8">
                    <DevicePhoneMobileIcon className="w-12 h-12  text-white/40 mx-auto mb-3" />
                    <p className="text-white/60 text-lg">No hay dispositivos en este grupo</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {devices.map((device) => (
                      <div
                        key={device.DeviceID}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          {getDeviceTypeIcon(device.DeviceType)}
                          <div>
                            <h4 className="font-medium text-white">{device.DeviceName}</h4>
                            <p className="text-white/60 text-sm">{getDeviceTypeText(device.DeviceType)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(device.status)}
                          <span className="text-white/60 text-xs font-mono">{device.DeviceMac}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Device Types Distribution */}
              {devices.length > 0 && (
                <div className="bg-white/10 border border-white/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Distribución por Tipo</h3>
                  
                  <div className="space-y-3">
                    {['Outdoor', 'Indoor', 'Hybrid'].map((type) => {
                      const typeDevices = devices.filter(device => device.DeviceType === type);
                      if (typeDevices.length === 0) return null;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getDeviceTypeIcon(type)}
                            <span className="text-white">{getDeviceTypeText(type)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{typeDevices.length}</span>
                            <span className="text-white/60 text-sm">
                              ({Math.round((typeDevices.length / devices.length) * 100)}%)
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal; 