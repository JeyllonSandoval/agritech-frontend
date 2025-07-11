// ============================================================================
// TELEMETRY CONTROLS - Estado en header, colores de marca
// ============================================================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DeviceInfo } from '../../../types/telemetry';
import { ArrowPathIcon, PlayCircleIcon, InformationCircleIcon, CloudIcon, PlusCircleIcon, UsersIcon, Squares2X2Icon, DocumentChartBarIcon, AdjustmentsHorizontalIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';
import DeviceManager from './DeviceManager';
import GroupManager from './GroupManager';

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

// Reusable Button estilizado
interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: 'emerald' | 'blue' | 'purple' | 'indigo' | 'orange' | 'gray';
  className?: string;
}
const colorMap = {
  emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30',
  purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30',
  indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30',
  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30',
  gray: 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20',
};
const ControlButton: React.FC<ControlButtonProps> = ({ onClick, disabled, children, icon, color = 'gray', className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full border rounded-xl px-4 py-3 text-base font-semibold flex items-center gap-3 justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${colorMap[color]} ${className}`}
    style={{ minWidth: 180 }}
  >
    {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

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
  const handleAddDevice = () => onAddDevice ? onAddDevice() : router.push('/telemetry/add-device');
  const handleShowDevices = () => setShowDeviceManager(true);
  const handleShowRealtimeData = () => onShowRealtimeData ? onShowRealtimeData() : router.push('/telemetry/realtime');
  const handleShowInfoPanel = () => onShowInfoPanel ? onShowInfoPanel() : router.push('/telemetry/info');
  const handleShowWeatherPanel = () => onShowWeatherPanel ? onShowWeatherPanel() : router.push('/telemetry/weather');
  const handleCreateGroup = () => onCreateGroup ? onCreateGroup() : router.push('/telemetry/create-group');
  const handleShowGroupManager = () => setShowGroupManager(true);

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 w-full border border-white/20 shadow-2xl">
        {/* Header con estado */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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
        {/* Panel principal */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sincronización */}
            <div className="flex-1 shadow-md">
              <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2"><ArrowPathIcon className="w-5 h-5" /> Sincronización</h3>
              <div className="flex flex-col gap-4">
                <ControlButton onClick={onRefresh} disabled={loading} icon={<ArrowPathIcon className="w-5 h-5" />} color="emerald">Actualiza datos</ControlButton>
                <ControlButton onClick={onTogglePolling} disabled={loading} icon={<PlayCircleIcon className="w-5 h-5" />} color={polling ? 'orange' : 'emerald'}>{polling ? 'Pausar Actualización' : 'Iniciar Actualización'}</ControlButton>
              </div>
            </div>
            {/* Gestión de datos */}
            <div className="flex-1 shadow-md">
              <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2"><InformationCircleIcon className="w-5 h-5" /> Gestión de datos</h3>
              <div className="flex flex-col gap-4">
                <ControlButton onClick={handleShowInfoPanel} icon={<Squares2X2Icon className="w-5 h-5" />} color="blue">Panel informativo</ControlButton>
                <ControlButton onClick={handleShowWeatherPanel} icon={<CloudIcon className="w-5 h-5" />} color="blue">Panel Climático</ControlButton>
              </div>
            </div>
            {/* Acciones de dispositivos */}
            <div className="flex-1 shadow-md">
              <h3 className="text-lg font-bold text-purple-400 mb-4 flex items-center gap-2"><PlusCircleIcon className="w-5 h-5" /> Acciones de dispositivos</h3>
              <div className="flex flex-col gap-4">
                <ControlButton onClick={handleAddDevice} icon={<PlusCircleIcon className="w-5 h-5" />} color="purple">Agregar Dispositivos</ControlButton>
                <ControlButton onClick={handleCreateGroup} icon={<UsersIcon className="w-5 h-5" />} color="purple">Crear grupo</ControlButton>
              </div>
            </div>
          </div>
          {/* Controles avanzados */}
          <div className="">
            <h3 className="text-lg font-bold text-indigo-400 mb-4 flex items-center gap-2"><AdjustmentsHorizontalIcon className="w-5 h-5" /> Controles Avanzados</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <ControlButton onClick={onShowDeviceComparison ? onShowDeviceComparison : () => {}} icon={<DevicePhoneMobileIcon className="w-5 h-5" />} color="indigo">Comparar de dispositivos</ControlButton>
              <ControlButton onClick={onShowReports ? onShowReports : () => {}} icon={<DocumentChartBarIcon className="w-5 h-5" />} color="indigo">Generar Reportes</ControlButton>
              <ControlButton onClick={handleShowDevices} icon={<DevicePhoneMobileIcon className="w-5 h-5" />} color="indigo">Gestionar dispositivos</ControlButton>
              <ControlButton onClick={handleShowGroupManager} icon={<UsersIcon className="w-5 h-5" />} color="indigo">Gestionar grupos</ControlButton>
            </div>
          </div>
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