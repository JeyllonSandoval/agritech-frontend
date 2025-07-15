import React, { useState, useEffect } from 'react';
import { Group, DeviceInfo } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import FormConfirmModal from '../modals/formConfirmModal';

interface GroupEditFormProps {
  group: Group;
  devices: DeviceInfo[];
  onSubmit: (group: Group) => void;
  onCancel?: () => void;
}

interface GroupEditFormData {
  GroupName: string;
  Description: string;
  deviceIds: string[];
}

const GroupEditForm: React.FC<GroupEditFormProps> = ({
  group,
  devices,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<GroupEditFormData>({
    GroupName: '',
    Description: '',
    deviceIds: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);

  useEffect(() => {
    if (group) {
      setFormData({
        GroupName: group.GroupName,
        Description: group.Description || '',
        deviceIds: group.deviceIds || []
      });
      setError(null);
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.GroupName.trim()) {
      setError('El nombre del grupo es requerido');
      return;
    }

    if (formData.deviceIds.length === 0) {
      setError('Debe seleccionar al menos un dispositivo');
      return;
    }

    // Filtrar solo los campos que han cambiado
    const updateData: any = {};
    if (formData.GroupName !== group?.GroupName) {
      updateData.GroupName = formData.GroupName;
    }
    if (formData.Description !== group?.Description) {
      updateData.Description = formData.Description;
    }
    if (JSON.stringify(formData.deviceIds.sort()) !== JSON.stringify((group?.deviceIds || []).sort())) {
      updateData.deviceIds = formData.deviceIds;
    }

    // Si no hay cambios, no hacer nada
    if (Object.keys(updateData).length === 0) {
      onCancel?.();
      return;
    }

    // Guardar datos pendientes y mostrar modal de confirmación
    setPendingUpdateData(updateData);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingUpdateData) return;

    console.log('🔧 GroupEditForm.handleConfirmUpdate - Starting update:', {
      groupId: group.DeviceGroupID,
      pendingUpdateData
    });

    setLoading(true);
    setError(null);
    setShowConfirmModal(false);
    
    try {
      const res = await telemetryService.updateGroup(group.DeviceGroupID, pendingUpdateData);
      
      console.log('🔧 GroupEditForm.handleConfirmUpdate - Success:', res);
      
      // El backend devuelve directamente el grupo actualizado
      console.log('🔧 GroupEditForm.handleConfirmUpdate - Updated group:', res);
      
      if (res && typeof res === 'object' && 'DeviceGroupID' in res) {
        onSubmit(res as Group);
      } else {
        console.error('🔧 GroupEditForm.handleConfirmUpdate - Invalid response format:', res);
        setError('Error: Respuesta inválida del servidor');
      }
    } catch (e: any) {
      console.error('🔧 GroupEditForm.handleConfirmUpdate - Error:', e);
      setError(e.message || 'Error al actualizar el grupo');
      setShowConfirmModal(false);
    } finally {
      setLoading(false);
      setPendingUpdateData(null);
    }
  };

  const handleCancelUpdate = () => {
    setShowConfirmModal(false);
    setPendingUpdateData(null);
  };

  const handleDeviceToggle = (deviceId: string) => {
    setFormData(prev => ({
      ...prev,
      deviceIds: prev.deviceIds.includes(deviceId)
        ? prev.deviceIds.filter(id => id !== deviceId)
        : [...prev.deviceIds, deviceId]
    }));
  };

  return (
    <div className="space-y-6 text-base">

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Nombre del Grupo *
          </label>
          <input
            type="text"
            value={formData.GroupName}
            onChange={(e) => setFormData(prev => ({ ...prev, GroupName: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none"
            placeholder="Ej: Sensores Exteriores"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Descripción
          </label>
          <textarea
            value={formData.Description}
            onChange={(e) => setFormData(prev => ({ ...prev, Description: e.target.value }))}
            className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-400 focus:outline-none"
            placeholder="Descripción opcional del grupo"
            rows={3}
          />
        </div>

        {/* Device Selection */}
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Dispositivos *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {devices.map(device => {
              const isSelected = formData.deviceIds.includes(device.DeviceID);
              return (
                <button
                  key={device.DeviceID}
                  type="button"
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
          {formData.deviceIds.length === 0 && (
            <p className="text-xs text-red-400 mt-1">Debe seleccionar al menos un dispositivo</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-4 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-white/20 text-white/70 hover:text-white rounded-lg transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !formData.GroupName.trim() || formData.deviceIds.length === 0}
            className=" bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 transition-all"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
        {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      </form>

      {/* Confirmation Modal */}
      <FormConfirmModal
        isOpen={showConfirmModal}
        title="Confirmar Cambios"
        message="¿Estás seguro de que quieres guardar los cambios en este grupo?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        onConfirm={handleConfirmUpdate}
        onCancel={handleCancelUpdate}
        loading={loading}
      />
    </div>
  );
};

export default GroupEditForm; 