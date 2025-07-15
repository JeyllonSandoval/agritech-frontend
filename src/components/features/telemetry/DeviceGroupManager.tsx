// ============================================================================
// DEVICE GROUP MANAGER
// Component for managing device groups
// ============================================================================

import React, { useState, useEffect } from 'react';
import { DeviceInfo, Group, GroupCreation } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { UserGroupIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CiEdit } from "react-icons/ci";
import { useModal } from '@/context/modalContext';
import { showSuccessToast } from '../../common/SuccessToast';
import { useRouter } from 'next/navigation';
import EditModal from '../modals/editModal';

interface DeviceGroupManagerProps {
  devices: DeviceInfo[];
  groups: Group[];
  onClose?: () => void;
  onGroupCreated?: (group: Group) => void;
  onGroupUpdated?: (group: Group) => void;
  onGroupDeleted?: (groupId: string) => void;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const { openConfirmModal } = useModal();
  const router = useRouter();

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
  };

  const handleDelete = async (groupId: string) => {
    console.log('🔧 DeviceGroupManager.handleDelete - Starting delete:', groupId);
    
    // Usar ConfirmModal en lugar de confirm nativo
    openConfirmModal(
      '¿Estás seguro de que quieres eliminar este grupo?',
      async () => {
        console.log('🔧 DeviceGroupManager.handleDelete - Confirmed, calling service');
        setLoading(true);
        setError(null);
        try {
          await telemetryService.deleteGroup(groupId);
          console.log('🔧 DeviceGroupManager.handleDelete - Success');
          onGroupDeleted?.(groupId);
          showSuccessToast('Grupo eliminado correctamente');
        } catch (e: any) {
          console.error('🔧 DeviceGroupManager.handleDelete - Error:', e);
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleGroupUpdated = (updatedData: DeviceInfo | Group) => {
    const updatedGroup = updatedData as Group;
    console.log('🔧 DeviceGroupManager.handleGroupUpdated - Updated group:', updatedGroup);
    
    // Llamar al callback para actualizar el estado padre
    onGroupUpdated?.(updatedGroup);
    setEditingGroup(null);
    showSuccessToast('Grupo actualizado correctamente');
  };

  const handleNewGroup = () => {
    router.push('/telemetry/create-group');
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
          <h2 className="text-xl font-semibold text-white">Gestión de Grupos</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-base">
          {error}
        </div>
      )}

      {/* Groups List */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white text-center">Grupos ({groups.length})</h3>
          <button
            onClick={handleNewGroup}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Crear Grupo
          </button>
        </div>
        {loading ? (
          <div className="text-white/70 text-base py-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
              <span>Cargando...</span>
            </div>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center text-lg py-8 text-white/50">
            <UserGroupIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay grupos creados</p>
            <p className="text-sm mt-2">Crea tu primer grupo para organizar tus dispositivos</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar scrollbar-w-2 scrollbar-thumb-emerald-400/60 scrollbar-track-white/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {groups.map(group => (
              <div key={group.DeviceGroupID} className="bg-white/5 border text-base border-white/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-base">{group.GroupName}</h4>
                  {group.Description && (
                    <p className="text-xs text-white/50 mt-1 line-clamp-2">{group.Description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-white/50">
                      {group.deviceIds?.length || 0} dispositivos
                    </span>
                    {group.Description && (
                      <span className="text-xs text-emerald-400/70">•</span>
                    )}
                    <span className="text-xs text-white/40">
                      ID: {group.DeviceGroupID.slice(0, 8)}...
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(group)} 
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-full hover:bg-blue-400/10"
                  >
                    <CiEdit className="w-5 h-5 stroke-[1]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(group.DeviceGroupID)} 
                    disabled={loading} 
                    className="p-2 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 rounded-full hover:bg-red-400/10"
                  >
                    <TrashIcon className="w-5 h-5 stroke-[1.5]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <EditModal
        isOpen={!!editingGroup}
        type="group"
        data={editingGroup}
        devices={devices}
        onClose={() => setEditingGroup(null)}
        onUpdated={handleGroupUpdated}
      />
    </div>
  );
};

export default DeviceGroupManager; 