// ============================================================================
// DEVICE MANAGER
// Modern, minimalist device management interface
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import { DeviceInfo, DeviceRegistration, Group } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { 
  DevicePhoneMobileIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { CiEdit } from "react-icons/ci";
import { useModal } from '@/context/modalContext';
import { showSuccessToast } from '../../common/SuccessToast';
import EditModal from '../modals/editModal';
import { useRouter } from 'next/navigation';

interface DeviceManagerProps {
  onClose?: () => void;
  onDeviceCreated?: (device: DeviceInfo) => void;
  onDeviceUpdated?: (device: DeviceInfo) => void;
  onDeviceDeleted?: (deviceId: string) => void;
}

const initialForm: DeviceRegistration = {
  DeviceName: '',
  DeviceMac: '',
  DeviceApplicationKey: '',
  DeviceApiKey: '',
  DeviceType: 'Outdoor',
  UserID: '',
};

const DeviceManager: React.FC<DeviceManagerProps> = ({ 
  onClose, 
  onDeviceCreated, 
  onDeviceUpdated, 
  onDeviceDeleted 
}) => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingDevice, setEditingDevice] = useState<DeviceInfo | null>(null);
  const [formData, setFormData] = useState<DeviceRegistration>(initialForm);
  const { openConfirmModal } = useModal();
  const router = useRouter();

  // ============================================================================
  // FILTERS STATE
  // ============================================================================
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  // Obtener tipos únicos de dispositivos
  const deviceTypes = useMemo(() => {
    const types = [...new Set(devices.map(device => device.DeviceType))];
    return types.sort();
  }, [devices]);

  // Filtrar dispositivos por tipo, estado y búsqueda
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesType = deviceTypeFilter === 'all' || device.DeviceType === deviceTypeFilter;
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [devices, deviceTypeFilter, statusFilter, searchTerm]);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await telemetryService.getDevices();
      setDevices(res.data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (device: DeviceInfo) => {
    setEditingDevice(device);
  };

  const handleDelete = async (deviceId: string) => {
    openConfirmModal(
      '¿Estás seguro de que quieres eliminar este dispositivo?',
      async () => {
        setLoading(true);
        setError(null);
        try {
          await telemetryService.deleteDevice(deviceId);
          setDevices(devices.filter(d => d.DeviceID !== deviceId));
          onDeviceDeleted?.(deviceId);
          showSuccessToast('Dispositivo eliminado correctamente');
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleDeviceUpdated = (updatedData: DeviceInfo | Group) => {
    const updatedDevice = updatedData as DeviceInfo;
    setDevices(devices.map(d => d.DeviceID === updatedDevice.DeviceID ? updatedDevice : d));
    onDeviceUpdated?.(updatedDevice);
    setEditingDevice(null);
    showSuccessToast('Dispositivo actualizado correctamente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await telemetryService.registerDevice(formData);
      if (res.data) {
        setDevices([res.data!, ...devices]);
        onDeviceCreated?.(res.data!);
        showSuccessToast('Dispositivo creado correctamente');
      }
      setFormData(initialForm);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewDevice = () => {
    router.push('/telemetry/add-device');
  };

  // ============================================================================
  // FILTER HANDLERS
  // ============================================================================

  const handleClearFilters = () => {
    setDeviceTypeFilter('all');
    setStatusFilter('all');
    setSearchTerm('');
  };

  const handleDeviceTypeFilterChange = (type: string) => {
    setDeviceTypeFilter(type);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
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
        placeholder="Buscar dispositivos..."
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
      {/* Device Type Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-white/80">Filtrar por tipo:</label>
          {(deviceTypeFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
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
            onClick={() => handleDeviceTypeFilterChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceTypeFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Todos ({devices.length})
          </button>
          {deviceTypes.map(type => (
            <button
              key={type}
              onClick={() => handleDeviceTypeFilterChange(type)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                deviceTypeFilter === type
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              {type} ({devices.filter(d => d.DeviceType === type).length})
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="text-sm font-medium text-white/80 mb-2 block">Filtrar por estado:</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusFilterChange('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Todos ({devices.length})
          </button>
          <button
            onClick={() => handleStatusFilterChange('active')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'active'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Activos ({devices.filter(d => d.status === 'active').length})
          </button>
          <button
            onClick={() => handleStatusFilterChange('inactive')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              statusFilter === 'inactive'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            Inactivos ({devices.filter(d => d.status === 'inactive').length})
          </button>
        </div>
      </div>
    </div>
  );

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const inactiveDevices = devices.filter(d => d.status !== 'active').length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="backdrop-blur-3xl rounded-3xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20">
              <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Gestión de Dispositivos</h2>
              <p className="text-white/60 mt-1">Administra tus dispositivos EcoWitt</p>
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
              <div className="text-2xl font-bold text-white">{devices.length}</div>
              <div className="text-white/60 text-sm">Total</div>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <div className="text-2xl font-bold text-emerald-400">{activeDevices}</div>
              <div className="text-emerald-300 text-sm">Activos</div>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <div className="text-2xl font-bold text-orange-400">{inactiveDevices}</div>
              <div className="text-orange-300 text-sm">Inactivos</div>
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
              <span className="ml-3 text-white/70 text-sm">Cargando dispositivos...</span>
            </div>
          )}

          {/* Devices List */}
          {!loading && (
            <div className="space-y-3">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <div
                    key={device.DeviceID}
                    className="bg-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${
                          device.status === 'active' 
                            ? 'bg-emerald-500/20' 
                            : 'bg-orange-500/20'
                        }`}>
                          <DevicePhoneMobileIcon className={`w-5 h-5 ${
                            device.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{device.DeviceName}</h3>
                          <p className="text-white/60 text-sm">{device.DeviceType}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${
                              device.status === 'active' ? 'bg-emerald-400' : 'bg-orange-400'
                            }`}></div>
                            <span className={`text-xs ${
                              device.status === 'active' ? 'text-emerald-400' : 'text-orange-400'
                            }`}>
                              {device.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(device)}
                          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200"
                          title="Editar dispositivo"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(device.DeviceID)}
                          className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all duration-200"
                          title="Eliminar dispositivo"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <DevicePhoneMobileIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {searchTerm || deviceTypeFilter !== 'all' || statusFilter !== 'all' 
                      ? 'No se encontraron dispositivos' 
                      : 'No hay dispositivos registrados'}
                  </h3>
                  <p className="text-white/60 text-sm mb-4">
                    {searchTerm || deviceTypeFilter !== 'all' || statusFilter !== 'all'
                      ? 'Intenta ajustar los filtros de búsqueda'
                      : 'Registra tu primer dispositivo para comenzar'}
                  </p>
                  {(searchTerm || deviceTypeFilter !== 'all' || statusFilter !== 'all') && (
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

          {/* Add Device Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={handleNewDevice}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              <PlusIcon className="w-5 h-5" />
              Agregar Dispositivo
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        {editingDevice && (
          <EditModal
            isOpen={!!editingDevice}
            type="device"
            data={editingDevice}
            onClose={() => setEditingDevice(null)}
            onUpdated={handleDeviceUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceManager; 