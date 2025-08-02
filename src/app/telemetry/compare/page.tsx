// ============================================================================
// DEVICE COMPARISON PAGE
// Modern, minimalist device comparison interface
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../utils/protectedRoute';
import DeviceComparison from '../../../components/features/telemetry/DeviceComparison';
import { useTelemetry } from '../../../hooks/useTelemetry';
import { 
  ScaleIcon, 
  ArrowLeftIcon,
  DevicePhoneMobileIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const ComparePage: React.FC = () => {
  const router = useRouter();
  const [showComparison, setShowComparison] = useState(true);

  const {
    devices,
    fetchDevices
  } = useTelemetry({ autoPoll: false });

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const handleBackToTelemetry = () => {
    router.push('/telemetry');
  };

  const handleHideComparison = () => {
    setShowComparison(false);
    setTimeout(() => {
      router.push('/telemetry');
    }, 300);
  };

  const handleAddDevices = () => {
    router.push('/telemetry/add-device');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen max-w-screen-lg mx-auto text-base">
        <div className="container mx-auto px-4 py-8">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTelemetry}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Comparación de Dispositivos</h1>
                <p className="text-white/60 mt-1">Analiza y compara datos entre múltiples dispositivos</p>
              </div>
            </div>
            
            <button
              onClick={handleAddDevices}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 font-medium"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Agregar Dispositivo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            
            {/* Comparison Interface */}
            <div>
              {devices.length > 1 ? (
                <div className="overflow-hidden">
                  {showComparison && (
                    <DeviceComparison
                      devices={devices}
                      onClose={handleHideComparison}
                    />
                  )}
                </div>
              ) : (
                <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ScaleIcon className="w-12 h-12 text-white/30" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Se requieren al menos 2 dispositivos
                    </h3>
                    <p className="text-white/60 mb-6">
                      Para realizar comparaciones necesitas tener al menos 2 dispositivos registrados
                    </p>
                    <button
                      onClick={handleAddDevices}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 font-medium mx-auto"
                    >
                      <PlusIcon className="w-5 h-5" />
                      <span>Agregar Dispositivo</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ComparePage; 