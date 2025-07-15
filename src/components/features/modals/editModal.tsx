'use client';

import React, { useEffect } from 'react';
import { DeviceInfo, Group, DeviceInfo as DeviceInfoType } from '../../../types/telemetry';
import { DeviceEditForm } from '../forms/deviceEditForm';
import GroupEditForm from '../forms/groupEditForm';
import { DevicePhoneMobileIcon, UserGroupIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { createPortal } from 'react-dom';

type EditModalType = 'device' | 'group';

interface EditModalProps {
  isOpen: boolean;
  type: EditModalType;
  data: DeviceInfo | Group | null;
  devices?: DeviceInfoType[]; // Solo necesario para grupos
  onClose: () => void;
  onUpdated: (updatedData: DeviceInfo | Group) => void;
}

const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  type,
  data, 
  devices = [],
  onClose, 
  onUpdated 
}) => {
  // Prevenir scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !data) return null;

  if (typeof window === 'undefined' || !document.body) return null;

  const getIcon = () => {
    if (type === 'device') {
      return <DevicePhoneMobileIcon className="w-6 h-6 text-emerald-400" />;
    } else {
      return <UserGroupIcon className="w-6 h-6 text-emerald-400" />;
    }
  };

  const getTitle = () => {
    if (type === 'device') {
      return 'Editar Dispositivo';
    } else {
      return 'Editar Grupo';
    }
  };

  const getForm = () => {
    if (type === 'device') {
      return (
        <DeviceEditForm
          device={data as DeviceInfo}
          onSubmit={(updatedDevice) => {
            onUpdated(updatedDevice);
            onClose();
          }}
          onCancel={onClose}
        />
      );
    } else {
      return (
                 <GroupEditForm
           group={data as Group}
           devices={devices}
           onSubmit={(updatedGroup: Group) => {
             onUpdated(updatedGroup);
             onClose();
           }}
           onCancel={onClose}
         />
      );
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-100/10 backdrop-blur-md rounded-2xl 
          border border-white/20 shadow-lg
          p-6 md:p-8 relative w-full max-w-4xl max-h-[90vh] scrollbar
          flex flex-col z-[9999]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/20">
              {getIcon()}
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {getTitle()}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white/70
              hover:bg-white/20 hover:text-white/90
              transition-all duration-300"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-2 scrollbar-thumb-emerald-400/60 scrollbar-track-white/10 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
          {getForm()}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default EditModal; 