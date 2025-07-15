import React from 'react';
import { createPortal } from 'react-dom';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FormConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const FormConfirmModal: React.FC<FormConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Guardar Cambios',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  if (typeof window === 'undefined' || !document.body) return null;

  return createPortal(
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-[9999] p-4"
      onClick={onCancel}
    >
      <div 
        className="bg-gray-400/20 backdrop-blur-sm rounded-2xl 
          border border-gray-700/50 shadow-2xl
          p-6 md:p-8 relative w-full max-w-md
          flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-lg md:text-xl font-semibold text-white">
              {title}
            </h2>
          </div>
          <button
            onClick={onCancel}
            className="p-1.5 rounded-lg bg-gray-800/50 text-gray-400
              hover:bg-gray-700/50 hover:text-white
              transition-all duration-200"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 mb-6">
          <p className="text-gray-300 text-sm leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-700/50">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium
              bg-gray-800/50 hover:bg-gray-700/50 
              text-gray-300 hover:text-white 
              border border-gray-600/50 hover:border-gray-500/50
              rounded-lg transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-medium
              bg-emerald-600 hover:bg-emerald-700 
              text-white rounded-lg 
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <CheckCircleIcon className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default FormConfirmModal; 