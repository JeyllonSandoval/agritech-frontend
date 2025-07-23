// ============================================================================
// DEVICE GROUP MANAGER
// Modern, minimalist group management interface
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { DeviceInfo, Group, GroupCreation } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { useTranslation } from '../../../hooks/useTranslation';
import { 
  UserGroupIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
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
  // FILTERS STATE
  // ============================================================================
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deviceCountFilter, setDeviceCountFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  // Filtrar grupos por estado, cantidad de dispositivos y búsqueda
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      const matchesStatus = statusFilter === 'all' || group.status === statusFilter;
      const matchesDeviceCount = deviceCountFilter === 'all' || 
        (deviceCountFilter === 'empty' && (group.deviceCount || 0) === 0) ||
        (deviceCountFilter === 'has_devices' && (group.deviceCount || 0) > 0);
      const matchesSearch = searchTerm === '' || 
        group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesDeviceCount && matchesSearch;
    });
  }, [groups, statusFilter, deviceCountFilter, searchTerm]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleEdit = (group: Group) => {
    setEditingGroup(group);
  };

  const handleDelete = async (groupId: string) => {
    console.log('🔧 DeviceGroupManager.handleDelete - Starting delete:', groupId);
    
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
    
    onGroupUpdated?.(updatedGroup);
    setEditingGroup(null);
    showSuccessToast('Grupo actualizado correctamente');
  };

  const handleNewGroup = () => {
    router.push('/telemetry/create-group');
  };

  // ============================================================================
  // FILTER HANDLERS
  // ============================================================================

  const handleClearFilters = () => {
    setStatusFilter('all');
    setDeviceCountFilter('all');
    setSearchTerm('');
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleDeviceCountFilterChange = (filter: string) => {
    setDeviceCountFilter(filter);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderSearchBar = () => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-white/50" />
      </div>
      <input
        type="text"
        placeholder="Buscar grupos..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm placeholder-white/50"
      />
      {searchTerm && (
        <button
          onClick={() => handleSearchChange('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white transition-colors"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-3">
      {/* Status Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Filtrar por estado:</label>
          {(statusFilter !== 'all' || deviceCountFilter !== 'all' || searchTerm) && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <XMarkIcon className="w-3 h-3" />
              Limpiar filtros
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilterChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Todos ({groups.length})
          </button>
          <button
            onClick={() => handleStatusFilterChange('active')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Activos ({groups.filter(g => g.status === 'active').length})
          </button>
          <button
            onClick={() => handleStatusFilterChange('inactive')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'inactive'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Inactivos ({groups.filter(g => g.status === 'inactive').length})
          </button>
        </div>
      </div>

      {/* Device Count Filter */}
      <div>
        <label className="text-sm font-medium text-white/80 mb-2 block">Filtrar por dispositivos:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleDeviceCountFilterChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceCountFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Todos ({groups.length})
          </button>
          <button
            onClick={() => handleDeviceCountFilterChange('has_devices')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceCountFilter === 'has_devices'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Con dispositivos ({groups.filter(g => (g.deviceCount || 0) > 0).length})
          </button>
          <button
            onClick={() => handleDeviceCountFilterChange('empty')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceCountFilter === 'empty'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Vacíos ({groups.filter(g => (g.deviceCount || 0) === 0).length})
          </button>
        </div>
      </div>
    </div>
  );

  const groupsWithDevices = groups.filter(g => g.deviceCount && g.deviceCount > 0).length;
  const avgDevicesPerGroup = groups.length > 0 
    ? Math.round(groups.reduce((sum, g) => sum + (g.deviceCount || 0), 0) / groups.length)
    : 0;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/20">
              <UserGroupIcon className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Grupos</h2>
              <p className="text-white/60 mt-1">Organiza tus dispositivos en grupos</p>
            </div>
          </div>
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Stats Bar */}
        <div className="bg-white/5 backdrop-blur-xl p-4 border-b border-white/10">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">{groups.length}</div>
              <div className="text-white/60 text-sm">Total</div>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <div className="text-2xl font-bold text-blue-400">{groupsWithDevices}</div>
              <div className="text-blue-300 text-sm">Con dispositivos</div>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <div className="text-2xl font-bold text-purple-400">{avgDevicesPerGroup}</div>
              <div className="text-purple-300 text-sm">Promedio</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          
          {/* Search and Filters */}
          <div className="space-y-4">
            {renderSearchBar()}
            {renderFilters()}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <span className="ml-3 text-white/70 text-sm">Cargando grupos...</span>
            </div>
          )}

          {/* Groups List */}
          {!loading && (
            <div className="space-y-3">
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <div key={group.DeviceGroupID} className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 group">
                    
                    {/* Group Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                          <UserGroupIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {group.GroupName}
                          </h3>
                          <p className="text-white/60 text-sm">
                            {group.deviceCount || 0} dispositivo{(group.deviceCount || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                        Grupo
                      </span>
                    </div>

                    {/* Group Info */}
                    <div className="space-y-3 mb-4">
                      {group.Description && (
                        <p className="text-white/60 text-sm line-clamp-2">
                          {group.Description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <CalendarIcon className="w-4 h-4" />
                        <span>Creado: {new Date(group.createdAt).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <span>ID: {group.DeviceGroupID.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(group)} 
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all duration-200"
                      >
                        <PencilIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Editar</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(group.DeviceGroupID)} 
                        disabled={loading} 
                        className="flex-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all duration-200 disabled:opacity-50"
                      >
                        <TrashIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <UserGroupIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {searchTerm || statusFilter !== 'all' || deviceCountFilter !== 'all' 
                      ? 'No se encontraron grupos' 
                      : 'No hay grupos creados'}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {searchTerm || statusFilter !== 'all' || deviceCountFilter !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Crea tu primer grupo para organizar tus dispositivos'}
                  </p>
                  {(searchTerm || statusFilter !== 'all' || deviceCountFilter !== 'all') && (
                    <button
                      onClick={handleClearFilters}
                      className="text-emerald-400 hover:text-emerald-300 text-sm"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Add Group Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleNewGroup}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              Crear Grupo
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
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