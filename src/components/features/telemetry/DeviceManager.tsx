import React, { useState, useEffect } from 'react';
import { DeviceInfo, DeviceRegistration } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { DevicePhoneMobileIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

const DeviceManager: React.FC<DeviceManagerProps> = ({ onClose, onDeviceCreated, onDeviceUpdated, onDeviceDeleted }) => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingDevice, setEditingDevice] = useState<DeviceInfo | null>(null);
  const [formData, setFormData] = useState<DeviceRegistration>(initialForm);
  const { openConfirmModal } = useModal();
  const router = useRouter();

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
    console.log('🔍 handleDelete - Iniciando eliminación para deviceId:', deviceId);
    console.log('🔍 handleDelete - Tipo de deviceId:', typeof deviceId);
    console.log('🔍 handleDelete - DeviceId válido:', deviceId && deviceId.length > 0);
    
    // Usar ConfirmModal en lugar de confirm nativo
    openConfirmModal(
      '¿Estás seguro de que quieres eliminar este dispositivo?',
      async () => {
        console.log('🔍 handleDelete - Usuario confirmó eliminación');
        setLoading(true);
        setError(null);
        try {
          console.log('🔍 handleDelete - Llamando a telemetryService.deleteDevice');
          await telemetryService.deleteDevice(deviceId);
          console.log('🔍 handleDelete - Dispositivo eliminado exitosamente');
          setDevices(devices.filter(d => d.DeviceID !== deviceId));
          onDeviceDeleted?.(deviceId);
          showSuccessToast('Dispositivo eliminado correctamente');
        } catch (e: any) {
          console.error('❌ handleDelete - Error al eliminar dispositivo:', e);
          console.error('❌ handleDelete - Error message:', e.message);
          setError(e.message);
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const handleDeviceUpdated = (updatedDevice: DeviceInfo) => {
    setDevices(devices.map(d => d.DeviceID === updatedDevice.DeviceID ? updatedDevice : d));
    onDeviceUpdated?.(updatedDevice);
    setEditingDevice(null);
    // Mostrar confirmación de éxito
    openConfirmModal('¡Dispositivo actualizado correctamente!', () => {});
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
      setShowForm(false);
      setFormData(initialForm);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(initialForm);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewDevice = () => {
    router.push('/telemetry/add-device');
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-400" />
          <h2 className="text-xl font-semibold text-white">Gestión de Dispositivos</h2>
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

      {/* Device List */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white text-center">Dispositivos ({devices.length})</h3>
          <button
            onClick={handleNewDevice}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Agregar Dispositivo
          </button>
        </div>
        {loading ? (
          <div className="text-white/70 text-base py-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
              <span>Cargando...</span>
            </div>
          </div>
        ) : devices.length === 0 ? (
          <div className="text-center text-lg py-8 text-white/50">
            <DevicePhoneMobileIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay dispositivos registrados</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar scrollbar-w-2 scrollbar-thumb-emerald-400/60 scrollbar-track-white/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {devices.map(device => (
              <div key={device.DeviceID} className="bg-white/5 border text-base border-white/20 rounded-lg p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white text-base">{device.DeviceName}</h4>
                  <p className="text-xs text-white/50">{device.DeviceType} | {device.DeviceMac}</p>
                  <p className="text-xs text-white/50 mt-1">Estado: {device.status === 'active' ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleEdit(device)} 
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors rounded-full hover:bg-blue-400/10"
                  >
                    <CiEdit className="w-5 h-5 stroke-[1]" />
                  </button>
                  <button 
                    onClick={() => handleDelete(device.DeviceID)} 
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
        isOpen={!!editingDevice}
        device={editingDevice}
        onClose={() => setEditingDevice(null)}
        onDeviceUpdated={handleDeviceUpdated}
      />
    </div>
  );
};

export default DeviceManager; 