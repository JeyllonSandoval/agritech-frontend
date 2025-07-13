// ============================================================================
// DEVICE GROUP MANAGER
// Component for managing device groups
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, Group, GroupCreation } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { UserGroupIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DeviceGroupManagerProps {
  devices: DeviceInfo[];
  groups: Group[];
  onClose?: () => void;
  onGroupCreated?: (group: Group) => void;
  onGroupUpdated?: (group: Group) => void;
  onGroupDeleted?: (groupId: string) => void;
}

interface GroupFormData {
  GroupName: string;
  Description: string;
  deviceIds: string[];
}

const DeviceGroupManager: React.FC<DeviceGroupManagerProps> = ({
  devices,
  groups,
  onClose,
  onGroupCreated,
  onGroupUpdated,
  onGroupDeleted
}) => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<GroupFormData>({
    GroupName: '',
    Description: '',
    deviceIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setFormData({
      GroupName: '',
      Description: '',
      deviceIds: []
    });
    setShowForm(true);
    setError(null);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setFormData({
      GroupName: group.GroupName,
      Description: group.Description || '',
      deviceIds: group.deviceIds || []
    });
    setShowForm(true);
    setError(null);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este grupo?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await telemetryService.deleteGroup(groupId);
      if (response.success) {
        onGroupDeleted?.(groupId);
        setError(null);
      } else {
        setError('Error al eliminar el grupo');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.GroupName.trim()) {
      setError('El nombre del grupo es requerido');
      return;
    }

    if (formData.deviceIds.length === 0) {
      setError('Debe seleccionar al menos un dispositivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (editingGroup) {
        // Update existing group
        const response = await telemetryService.updateGroup(editingGroup.DeviceGroupID, {
          GroupName: formData.GroupName,
          Description: formData.Description,
          deviceIds: formData.deviceIds
        });

        if (response.success && response.data) {
          onGroupUpdated?.(response.data);
          setShowForm(false);
          setError(null);
        } else {
          setError('Error al actualizar el grupo');
        }
      } else {
        // Create new group
        const groupData: any = {
          GroupName: formData.GroupName,
          Description: formData.Description,
          DeviceIDs: formData.deviceIds, // array de strings UUID
          UserID: '1'
        };

        const response = await telemetryService.createGroup(groupData);
        // Permitir respuesta directa del backend (objeto grupo) o envuelta
        let group: Group | undefined = undefined;
        if (response && typeof response === 'object' && 'DeviceGroupID' in response) {
          group = (response as unknown) as Group;
        } else if (response && typeof response === 'object' && 'success' in response && response.success && response.data) {
          group = response.data as Group;
        }
        if (group) {
          onGroupCreated?.(group);
          setShowForm(false);
          setError(null);
        } else {
          setError('Error al crear el grupo');
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGroup(null);
    setFormData({
      GroupName: '',
      Description: '',
      deviceIds: []
    });
    setError(null);
  };

  const handleDeviceToggle = (deviceId: string) => {
    setFormData(prev => ({
      ...prev,
      deviceIds: prev.deviceIds.includes(deviceId)
        ? prev.deviceIds.filter(id => id !== deviceId)
        : [...prev.deviceIds, deviceId]
    }));
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <UserGroupIcon className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">
            Gestión de Grupos
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Groups List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white text-center">
            Grupos ({groups.length})
          </h3>
          {/* Botón de crear grupo eliminado */}
        </div>

        {groups.length === 0 ? (
          <div className="text-center text-lg py-8 text-white/50">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay grupos creados</p>
            <p className="text-sm">Crea tu primer grupo para organizar tus dispositivos</p>
          </div>
        ) :
          <div className="space-y-3">
            {groups.map(group => (
              <div
                key={group.DeviceGroupID}
                className="bg-white/5 border text-lg border-white/20 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{group.GroupName}</h4>
                    {group.Description && (
                      <p className="text-sm text-white/70 mt-1">{group.Description}</p>
                    )}
                    <p className="text-xs text-white/50 mt-2">
                      {group.deviceIds?.length || 0} dispositivos
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGroup(group.DeviceGroupID)}
                      disabled={loading}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* Formulario de creación de grupo eliminado */}
      {showForm && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">
            Editar Grupo
          </h3>

          <div className="space-y-4">
            {/* Group Name */}
            <div>
              <h3 className="block text-lg font-medium text-white">
                Nombre del Grupo *
              </h3>
              <input
                type="text"
                value={formData.GroupName}
                onChange={(e) => setFormData(prev => ({ ...prev, GroupName: e.target.value }))}
                className="w-full px-3 py-2 text-lg bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none"
                placeholder="Ej: Sensores Exteriores"
              />
            </div>

            {/* Description */}
            <div>
              <h3 className="block text-lg font-medium text-white mb-2">
                Descripción
              </h3>
              <textarea
                value={formData.Description}
                onChange={(e) => setFormData(prev => ({ ...prev, Description: e.target.value }))}
                className="w-full px-3 py-2 text-lg bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none"
                placeholder="Descripción opcional del grupo"
                rows={3}
              />
            </div>

            {/* Device Selection */}
            <div>
              <h3 className="block text-lg font-medium text-white mb-2">
                Dispositivos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {devices.map(device => {
                  const isSelected = formData.deviceIds.includes(device.DeviceID);
                  return (
                    <button
                      key={device.DeviceID}
                      onClick={() => handleDeviceToggle(device.DeviceID)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                          : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                      }`}
                    >
                      <div>
                        <h4 className="font-medium text-sm">{device.DeviceName}</h4>
                        <p className="text-xs opacity-70">{device.DeviceType}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-lg border border-white/20 text-white/70 hover:text-white rounded-lg transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.GroupName.trim() || formData.deviceIds.length === 0}
                className="flex-1 text-lg bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-all"
              >
                {loading ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceGroupManager; 