// ============================================================================
// TELEMETRY CONTROLS - Estado en header, colores de marca
// ============================================================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceInfo } from '../../../types/telemetry';
import { ArrowPathIcon, PlayCircleIcon, InformationCircleIcon, CloudIcon, PlusCircleIcon, UsersIcon, Squares2X2Icon, DocumentChartBarIcon, AdjustmentsHorizontalIcon, DevicePhoneMobileIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import DeviceManager from './DeviceManager';
import GroupManager from './GroupManager';
import DropdownControl from './DropdownControl';

interface TelemetryControlsProps {
  polling: boolean;
  loading: boolean;
  onRefresh: () => void;
  onTogglePolling: () => void;
  onShowDeviceInfo?: () => void;
  onShowDeviceComparison?: () => void;
  onShowGroupManager?: () => void;
  onShowReports?: () => void;
  onShowDevices?: () => void;
  onShowRealtimeData?: () => void;
  onShowInfoPanel?: () => void;
  onShowWeatherPanel?: () => void;
  onAddDevice?: () => void;
  onCreateGroup?: () => void;
  selectedDevice?: DeviceInfo | null;
  deviceCount?: number;
  hasRealtimeData?: boolean;
}

const TelemetryControls: React.FC<TelemetryControlsProps> = ({
  polling,
  loading,
  onRefresh,
  onTogglePolling,
  onShowDeviceInfo,
  onShowDeviceComparison,
  onShowGroupManager,
  onShowReports,
  onShowDevices,
  onShowRealtimeData,
  onShowInfoPanel,
  onShowWeatherPanel,
  onAddDevice,
  onCreateGroup,
}) => {
  const router = useRouter();
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);

  // Handlers por defecto
  const handleAddDevice = () => (onAddDevice ? onAddDevice() : router.push('/telemetry/add-device'));
  const handleShowDevices = () => (onShowDevices ? onShowDevices() : setShowDeviceManager(true));
  const handleShowRealtimeData = () => (onShowRealtimeData ? onShowRealtimeData() : router.push('/telemetry/realtime'));
  const handleShowInfoPanel = () => (onShowInfoPanel ? onShowInfoPanel() : router.push('/telemetry/info'));
  const handleShowWeatherPanel = () => (onShowWeatherPanel ? onShowWeatherPanel() : router.push('/telemetry/weather'));
  const handleCreateGroup = () => (onCreateGroup ? onCreateGroup() : router.push('/telemetry/create-group'));
  const handleShowGroupManager = () => (onShowGroupManager ? onShowGroupManager() : setShowGroupManager(true));
  const handleShowDeviceComparison = () => (onShowDeviceComparison ? onShowDeviceComparison() : null);
  const handleShowReports = () => (onShowReports ? onShowReports() : null);

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
              { label: polling ? 'Pausar Actualización' : 'Iniciar Actualización', onClick: onTogglePolling, disabled: loading, icon: <PlayCircleIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Gestion de datos"
            color="blue"
            options={[
              { label: 'Panel informativo', onClick: handleShowInfoPanel, icon: <Squares2X2Icon className="w-5 h-5" /> },
              { label: 'Panel Climático', onClick: handleShowWeatherPanel, icon: <CloudIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Acciones de dispositivos"
            color="purple"
            options={[
              { label: 'Agregar Dispositivos', onClick: handleAddDevice, icon: <PlusCircleIcon className="w-5 h-5" /> },
              { label: 'Crear grupo', onClick: handleCreateGroup, icon: <UsersIcon className="w-5 h-5" /> },
            ]}
          />
          <DropdownControl
            className="w-full"
            label="Controles Avanzados"
            color="indigo"
            options={[
              { label: 'Comparar de dispositivos', onClick: handleShowDeviceComparison, icon: <DevicePhoneMobileIcon className="w-5 h-5" /> },
              { label: 'Generar Reportes', onClick: handleShowReports, icon: <DocumentChartBarIcon className="w-5 h-5" /> },
              { label: 'Gestionar dispositivos', onClick: handleShowDevices, icon: <DevicePhoneMobileIcon className="w-5 h-5" /> },
              { label: 'Gestionar grupos', onClick: handleShowGroupManager, icon: <UsersIcon className="w-5 h-5" /> },
            ]}
          />
        </div>
      </div>
      {/* Device Manager Modal */}
      {showDeviceManager && (
        <DeviceManager onClose={() => setShowDeviceManager(false)} />
      )}
      {/* Group Manager Modal */}
      {showGroupManager && (
        <GroupManager onClose={() => setShowGroupManager(false)} />
      )}
    </>
  );
};

export default TelemetryControls; 