// ============================================================================
// TELEMETRY CONTROLS - Estado en header, colores de marca
// ============================================================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceInfo, Group } from '../../../types/telemetry';
import { ArrowPathIcon, PlayCircleIcon, PauseCircleIcon, InformationCircleIcon, CloudIcon, PlusCircleIcon, UsersIcon, Squares2X2Icon, DocumentChartBarIcon, AdjustmentsHorizontalIcon, DevicePhoneMobileIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import DropdownControl from './DropdownControl';
import DeviceComparison from './DeviceComparison';

interface TelemetryControlsProps {
  polling: boolean;
  loading: boolean;
  onRefresh: () => void;
  onTogglePolling: () => void;
  onShowDeviceInfo?: () => void;
  onShowDeviceComparison?: () => void;
  onShowGroupManager?: () => void;
  onShowDevices?: () => void;
  onShowRealtimeData?: () => void;
  onShowInfoPanel?: () => void;
  onShowWeatherPanel?: () => void;
  onAddDevice?: () => void;
  onCreateGroup?: () => void;
  selectedDevice?: DeviceInfo | null;
  deviceCount?: number;
  hasRealtimeData?: boolean;
  devices?: DeviceInfo[];
  groups?: Group[];
}

const TelemetryControls: React.FC<TelemetryControlsProps> = ({
  polling,
  loading,
  onRefresh,
  onTogglePolling,
  onShowDeviceInfo,
  onShowDeviceComparison,
  onShowGroupManager,
  onShowDevices,
  onShowRealtimeData,
  onShowInfoPanel,
  onShowWeatherPanel,
  onAddDevice,
  onCreateGroup,
  devices = [],
  groups = [],
}) => {
  const router = useRouter();
  const [showDeviceComparison, setShowDeviceComparison] = useState(false);

  // Handlers mejorados con fallbacks apropiados
  const handleAddDevice = () => {
    if (onAddDevice) {
      onAddDevice();
    } else {
      router.push('/telemetry/add-device');
    }
  };

  const handleShowDevices = () => {
    if (onShowDevices) {
      onShowDevices();
    } else {
      // Usar el handler del dashboard
      console.log('Mostrando gestión de dispositivos');
    }
  };

  const handleShowRealtimeData = () => {
    if (onShowRealtimeData) {
      onShowRealtimeData();
    } else {
      // Mostrar panel de datos en tiempo real
      console.log('Mostrando datos en tiempo real');
    }
  };

  const handleShowInfoPanel = () => {
    if (onShowInfoPanel) {
      onShowInfoPanel();
    } else {
      // Mostrar panel informativo
      console.log('Mostrando panel informativo');
    }
  };

  const handleShowWeatherPanel = () => {
    if (onShowWeatherPanel) {
      onShowWeatherPanel();
    } else {
      // Mostrar panel climático
      console.log('Mostrando panel climático');
    }
  };

  const handleCreateGroup = () => {
    if (onCreateGroup) {
      onCreateGroup();
    } else {
      router.push('/telemetry/create-group');
    }
  };

  const handleShowGroupManager = () => {
    if (onShowGroupManager) {
      onShowGroupManager();
    } else {
      // Usar el handler del dashboard
      console.log('Mostrando gestión de grupos');
    }
  };

  const handleShowDeviceComparison = () => {
    if (onShowDeviceComparison) {
      onShowDeviceComparison();
    } else {
      setShowDeviceComparison(true);
    }
  };



  return (
    <>
      <div className="">
        {/* Header con estado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
              <AdjustmentsHorizontalIcon className="w-7 h-7 text-emerald-400" />
              Controles de Telemetría
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 shadow-sm">
            <span className={`w-3 h-3 rounded-full ${polling ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className={`text-base font-semibold ${polling ? 'text-emerald-400' : 'text-gray-400'}`}>{polling ? 'Activo' : 'Inactivo'}</span>
          </div>
        </div>
        {/* Panel principal: dropdowns alineados horizontalmente */}
        <div className="flex flex-col md:flex-row md:items-center w-full gap-2 justify-between">
          <DropdownControl
            className="w-full"
            label="Sincronizacion"
            color="emerald"
            options={[
              { label: 'Actualiza datos', onClick: onRefresh, disabled: loading, icon: <ArrowPathIcon className="w-5 h-5" /> },
              { label: polling ? 'Pausar Actualización' : 'Iniciar Actualización', onClick: onTogglePolling, disabled: loading, icon: polling ? <PauseCircleIcon className="w-5 h-5" /> : <PlayCircleIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Gestion"
            color="blue"
            options={[
              { label: 'Panel informativo', onClick: handleShowInfoPanel, icon: <Squares2X2Icon className="w-5 h-5" /> },
              { label: 'Panel Climático', onClick: handleShowWeatherPanel, icon: <CloudIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Creacion"
            color="purple"
            options={[
              { label: 'Agregar Dispositivos', onClick: handleAddDevice, icon: <PlusCircleIcon className="w-5 h-5" /> },
              { label: 'Crear grupo', onClick: handleCreateGroup, icon: <UsersIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Operaciones"
            color="indigo"
            options={[
              { label: 'Comparar dispositivos', onClick: handleShowDeviceComparison, icon: <DevicePhoneMobileIcon className="w-5 h-5" /> },
              { label: 'Generar Reporte', onClick: () => router.push('/telemetry/create-report'), icon: <DocumentChartBarIcon className="w-5 h-5" /> },
              { label: 'Gestionar dispositivos', onClick: handleShowDevices, icon: <DevicePhoneMobileIcon className="w-5 h-5" /> },
              { label: 'Gestionar grupos', onClick: handleShowGroupManager, icon: <UsersIcon className="w-5 h-5" /> },
            ].map(opt => ({ ...opt, className: 'text-base font-medium' }))}
          />
        </div>
      </div>
      
      {/* Modales */}
      {showDeviceComparison && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Comparación de Dispositivos</h2>
                <button
                  onClick={() => setShowDeviceComparison(false)}
                  className="text-white/60 hover:text-red-400 transition-colors p-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DeviceComparison 
                devices={devices} 
                onClose={() => setShowDeviceComparison(false)} 
              />
            </div>
          </div>
        </div>
      )}
      

    </>
  );
};

export default TelemetryControls; 