'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DeviceInfo, DeviceRegistration } from '../../../types/telemetry';
import { telemetryService } from '../../../services/telemetryService';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import { useModal } from '@/context/modalContext';

interface DeviceEditFormProps {
  device: DeviceInfo;
  onSubmit: (device: DeviceInfo) => void;
  onCancel: () => void;
}

export const DeviceEditForm: React.FC<DeviceEditFormProps> = ({
  device,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<DeviceRegistration>({
    DeviceName: device.DeviceName,
    DeviceMac: device.DeviceMac,
    DeviceApplicationKey: '',
    DeviceApiKey: '',
    DeviceType: device.DeviceType,
    UserID: device.UserID,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validations, setValidations] = useState({
    name: false,
    mac: false,
    userId: false
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingUpdateData, setPendingUpdateData] = useState<any>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const { openConfirmModal } = useModal();

  useEffect(() => {
    setValidations({
      name: formData.DeviceName.length >= 3 && formData.DeviceName.length <= 50,
      mac: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(formData.DeviceMac),
      userId: formData.UserID.length > 0
    });
  }, [formData]);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  const isFormValid = validations.name && validations.mac && validations.userId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || loading) return;

    // Filtrar campos vacíos para no enviar valores vacíos al backend
    const updateData: any = {};
    
    if (formData.DeviceName !== device.DeviceName) {
      updateData.DeviceName = formData.DeviceName;
    }
    if (formData.DeviceMac !== device.DeviceMac) {
      updateData.DeviceMac = formData.DeviceMac;
    }
    if (formData.DeviceType !== device.DeviceType) {
      updateData.DeviceType = formData.DeviceType;
    }
    if (formData.UserID !== device.UserID) {
      updateData.UserID = formData.UserID;
    }
    if (formData.DeviceApplicationKey && formData.DeviceApplicationKey.trim() !== '') {
      updateData.DeviceApplicationKey = formData.DeviceApplicationKey;
    }
    if (formData.DeviceApiKey && formData.DeviceApiKey.trim() !== '') {
      updateData.DeviceApiKey = formData.DeviceApiKey;
    }

    // Verificar si hay cambios para actualizar
    if (Object.keys(updateData).length === 0) {
      setError('No hay cambios para guardar');
      return;
    }

    // Guardar datos pendientes y mostrar modal de confirmación
    setPendingUpdateData(updateData);
    setShowConfirmModal(true);
  };

  const handleConfirmUpdate = async () => {
    if (!pendingUpdateData) return;

    setLoading(true);
    setError(null);
    setShowConfirmModal(false);
    
    try {
      const res = await telemetryService.updateDevice(device.DeviceID, pendingUpdateData);
      
      if (res.data) {
        onSubmit(res.data);
      }
    } catch (e: any) {
      setError(e.message || 'Error al actualizar el dispositivo');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 text-base">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 p-2">
          <div>
            <label className="block text-sm text-white mb-1">Nombre</label>
            <input 
              ref={firstInputRef}
              type="text" 
              name="DeviceName" 
              value={formData.DeviceName} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base" 
              required 
              disabled={loading}
            />
            {!validations.name && formData.DeviceName.length > 0 && (
              <div className="text-red-400 text-xs mt-1">
                El nombre debe tener entre 3 y 50 caracteres
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-white mb-1">MAC</label>
            <input 
              type="text" 
              name="DeviceMac" 
              value={formData.DeviceMac} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base" 
              required 
              disabled={loading}
            />
            {!validations.mac && formData.DeviceMac.length > 0 && (
              <div className="text-red-400 text-xs mt-1">
                Formato MAC inválido (ej: AA:BB:CC:DD:EE:FF)
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm text-white mb-1">Tipo</label>
            <select 
              name="DeviceType" 
              value={formData.DeviceType} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base appearance-none"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white'
              }}
              disabled={loading}
            >
              <option value="Controlled environments" className="bg-gray-800 text-white">Ambientes controlados</option>
              <option value="Plants" className="bg-gray-800 text-white">Plantas</option>
              <option value="Soil" className="bg-gray-800 text-white">Suelo</option>
              <option value="Climate" className="bg-gray-800 text-white">Clima</option>
              <option value="Large-scale farming" className="bg-gray-800 text-white">Agricultura a gran escala</option>
              <option value="home gardens" className="bg-gray-800 text-white">Jardines domésticos</option>
              <option value="Manual" className="bg-gray-800 text-white">Manual</option>
              <option value="Automated" className="bg-gray-800 text-white">Automatizado</option>
              <option value="Delicate" className="bg-gray-800 text-white">Delicado</option>
              <option value="Tough" className="bg-gray-800 text-white">Resistente</option>
              <option value="Outdoor" className="bg-gray-800 text-white">Exterior</option>
              <option value="Indoor" className="bg-gray-800 text-white">Interior</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-white mb-1">Application Key</label>
            <input 
              type="text" 
              name="DeviceApplicationKey" 
              value={formData.DeviceApplicationKey} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base" 
              placeholder="Dejar vacío para mantener el actual"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm text-white mb-1">API Key</label>
            <input 
              type="text" 
              name="DeviceApiKey" 
              value={formData.DeviceApiKey} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base" 
              placeholder="Dejar vacío para mantener el actual"
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm text-white mb-1">User ID</label>
            <input 
              type="text" 
              name="UserID" 
              value={formData.UserID} 
              onChange={handleChange} 
              className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-base" 
              required 
              disabled={loading}
            />
            {!validations.userId && formData.UserID.length === 0 && (
              <div className="text-red-400 text-xs mt-1">
                User ID es requerido
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <button 
            type="submit" 
            className="px-4 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors text-base flex items-center gap-2" 
            disabled={!isFormValid || loading}
          >
            <DevicePhoneMobileIcon className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-base"
            disabled={loading}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[10000] p-4"
          onClick={handleCancelUpdate}
        >
          <div 
            className="bg-gray-100/10 backdrop-blur-md rounded-2xl 
              border border-white/20 shadow-lg
              p-8 relative w-full max-w-md
              flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/20">
                  <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Confirmar Cambios
                </h2>
              </div>
              <p className="text-white/70 text-sm">
                ¿Estás seguro de que quieres guardar los cambios en el dispositivo "{device.DeviceName}"?
              </p>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={handleCancelUpdate}
                  className="px-4 py-2 rounded-lg text-lg bg-white/10 text-white/70
                    hover:bg-white/20 hover:text-white/90
                    transition-all duration-300"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmUpdate}
                  className="px-4 py-2 rounded-lg text-lg bg-emerald-500/20 text-emerald-400
                    hover:bg-emerald-500/30 hover:text-emerald-300
                    transition-all duration-300
                    flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <>
                      <DevicePhoneMobileIcon className="w-4 h-4" />
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 