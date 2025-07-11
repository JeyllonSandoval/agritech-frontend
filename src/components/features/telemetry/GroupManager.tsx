// ============================================================================
// GROUP MANAGER
// Component for managing device groups
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  InformationCircleIcon, 
  PencilIcon, 
  TrashIcon, 
  PlusIcon,
  DevicePhoneMobileIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Group, DeviceInfo } from '../../../types/telemetry';
import telemetryService from '../../../services/telemetryService';
import GroupInfoModal from './GroupInfoModal';

interface GroupManagerProps {
  onClose: () => void;
}

const GroupManager: React.FC<GroupManagerProps> = ({ onClose }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.UserID;

      // Cargar grupos y dispositivos en paralelo
      const [groupsResponse, devicesResponse] = await Promise.all([
        telemetryService.getUserGroups(userId),
        telemetryService.getDevices({ userId })
      ]);

      if (groupsResponse.success && groupsResponse.data) {
        setGroups(groupsResponse.data);
      }

      if (devicesResponse.success && devicesResponse.data) {
        setDevices(devicesResponse.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGroupInfo = (group: Group) => {
    setSelectedGroup(group);
    setShowGroupInfo(true);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      return;
    }

    try {
      const response = await telemetryService.deleteGroup(groupId);
      if (response.success) {
        setGroups(prev => prev.filter(group => group.DeviceGroupID !== groupId));
      } else {
        throw new Error('Error al eliminar grupo');
      }
    } catch (error) {
      console.error('Error eliminando grupo:', error);
      setError('Error al eliminar el grupo');
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

  const getGroupDevices = (group: Group) => {
    if (!group.deviceIds || group.deviceIds.length === 0) return [];
    return devices.filter(device => group.deviceIds?.includes(device.DeviceID));
  };

  const filteredGroups = groups.filter(group => {
    if (filter === 'all') return true;
    return group.status === filter;
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
            <UserGroupIcon className="w-8 h-8 text-emerald-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Grupos</h2>
              <p className="text-white/60 text-sm">
                Administra y configura tus grupos de dispositivos
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
                {filteredGroups.length} grupo{filteredGroups.length !== 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={() => window.location.href = '/telemetry/create-group'}
              className="flex items-center text-lg gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300"
            >
              <PlusIcon className="w-5 h-5" />
              Crear Grupo
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
                <div className="w-6 h-6 border-2 text-lg border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white/80">Cargando grupos...</span>
              </div>
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <UserGroupIcon className="w-16 h-16 text-lg text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay grupos</h3>
              <p className="text-white/60 mb-6 text-lg">
                {filter === 'all' 
                  ? 'Aún no tienes grupos creados.'
                  : `No hay grupos ${filter === 'active' ? 'activos' : 'inactivos'}.`
                }
              </p>
            </div>
          ) : (
            /* Groups Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGroups.map((group) => {
                const groupDevices = getGroupDevices(group);
                
                return (
                  <div
                    key={group.DeviceGroupID}
                    className="bg-white/10 border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                  >
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <UserGroupIcon className="w-6 h-6 text-emerald-400" />
                        <div>
                          <h3 className="font-semibold text-white text-lg">{group.GroupName}</h3>
                          <p className="text-white/60 text-sm">
                            {groupDevices.length} dispositivo{groupDevices.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      {getStatusIcon(group.status)}
                    </div>

                    {/* Group Details */}
                    <div className="space-y-2 mb-4">
                      {group.Description && (
                        <div className="text-sm">
                          <span className="text-white/70">Descripción:</span>
                          <p className="text-white/80 mt-1">{group.Description}</p>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Estado:</span>
                        <span className={`font-medium ${
                          group.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                        }`}>
                          {getStatusText(group.status)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/70">Creado:</span>
                        <span className="text-white/80 text-xs">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Devices Preview */}
                    {groupDevices.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-white/70 mb-2">Dispositivos:</h4>
                        <div className="space-y-1">
                          {groupDevices.slice(0, 3).map((device) => (
                            <div key={device.DeviceID} className="flex items-center gap-2 text-xs">
                              <DevicePhoneMobileIcon className="w-3 h-3 text-white/60" />
                              <span className="text-white/80">{device.DeviceName}</span>
                              <span className="text-white/60">({getDeviceTypeText(device.DeviceType)})</span>
                            </div>
                          ))}
                          {groupDevices.length > 3 && (
                            <div className="text-xs text-white/60">
                              +{groupDevices.length - 3} más...
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGroupInfo(group)}
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
                        onClick={() => handleDeleteGroup(group.DeviceGroupID)}
                        className="p-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                        title="Eliminar"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Group Info Modal */}
        {showGroupInfo && selectedGroup && (
          <GroupInfoModal
            group={selectedGroup}
            devices={getGroupDevices(selectedGroup)}
            onClose={() => setShowGroupInfo(false)}
          />
        )}
      </div>
    </div>
  );
};

export default GroupManager; 