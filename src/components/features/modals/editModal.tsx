'use client';

import React from 'react';
import { DeviceInfo } from '../../../types/telemetry';
import { DeviceEditForm } from '../forms/deviceEditForm';
import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface EditModalProps {
  isOpen: boolean;
  device: DeviceInfo | null;
  onClose: () => void;
  onDeviceUpdated: (device: DeviceInfo) => void;
}

const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  device, 
  onClose, 
  onDeviceUpdated 
}) => {
  if (!isOpen || !device) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-100/10 rounded-2xl backdrop-blur-sm 
          border border-white/20 shadow-lg
          p-4 sm:p-6 md:p-8 relative w-full max-w-[95vw] sm:max-w-2xl md:max-w-3xl
          flex flex-col max-h-[90vh] sm:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between items-center mb-4 sm:mb-6 sticky top-0 bg-gray-100/10 rounded-t-2xl p-2 -m-2 mb-4">
          <div className="flex items-center gap-3">
            <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Editar Dispositivo
            </h1>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 text-3xl sm:text-4xl hover:text-red-400 
              transition-colors duration-300"
          >
            &times;
          </button>
        </div>
        
        <div className="w-full overflow-y-auto flex-1 scrollbar scrollbar-w-2 scrollbar-thumb-emerald-400/60 scrollbar-track-white/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          <DeviceEditForm
            device={device}
            onSubmit={(updatedDevice) => {
              onDeviceUpdated(updatedDevice);
              onClose();
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default EditModal; 