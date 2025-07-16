// ============================================================================
// DEVICE SELECTOR
// Component for selecting devices and groups
// ============================================================================

import React, { useState } from 'react';
import { DeviceInfo, Group } from '../../../types/telemetry';

interface DeviceSelectorProps {
  devices: DeviceInfo[];
  groups: Group[];
  selectedDevice: DeviceInfo | null;
  selectedGroup: Group | null;
  onDeviceSelect: (device: DeviceInfo | null) => void;
  onGroupSelect: (group: Group | null) => void;
  loading: boolean;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  devices,
  groups,
  selectedDevice,
  selectedGroup,
  onDeviceSelect,
  onGroupSelect,
  loading
}) => {
  const [activeTab, setActiveTab] = useState<'devices' | 'groups'>('devices');

  const handleDeviceClick = (device: DeviceInfo) => {
    onDeviceSelect(device);
    onGroupSelect(null);
  };

  const handleGroupClick = (group: Group) => {
    onGroupSelect(group);
    onDeviceSelect(null);
  };

  const handleClearSelection = () => {
    onDeviceSelect(null);
    onGroupSelect(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
        <span className="ml-3 text-white/70 text-sm">Cargando dispositivos...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-white/10 rounded-lg p-1 backdrop-blur-sm">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'devices'
              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Dispositivos ({devices.length})
          </div>
        </button>
        
        <button
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'groups'
              ? 'bg-emerald-500/20 text-emerald-400 shadow-sm'
              : 'text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Grupos ({groups.length})
          </div>
        </button>
      </div>

      {/* Clear Selection Button */}
      {(selectedDevice || selectedGroup) && (
        <div className="flex justify-center">
          <button
            onClick={handleClearSelection}
            className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors bg-white/5 rounded-lg hover:bg-white/10"
          >
            Limpiar selección
          </button>
        </div>
      )}

      {/* Content */}
      {activeTab === 'devices' ? (
        <div className="space-y-3 text-lg">
          {devices.length === 0 ? (
            <div className="text-center py-8 text-white/50">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p>No hay dispositivos disponibles</p>
            </div>
          ) : (
            devices.map((device) => (
              <div
                key={device.DeviceID}
                onClick={() => handleDeviceClick(device)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                  selectedDevice?.DeviceID === device.DeviceID
                    ? 'bg-emerald-500/20 border-emerald-500/30 shadow-lg'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedDevice?.DeviceID === device.DeviceID
                        ? 'bg-emerald-500/30'
                        : 'bg-white/10'
                    }`}>
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">{device.DeviceName}</h4>
                      <p className="text-xs text-white/50">{device.DeviceType}</p>
                    </div>
                  </div>
                  <div className="text-xs text-white/50">
                    {device.status === 'active' ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-white/50 text-sm">
              <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p>No hay grupos creados</p>
              <p className="text-xs mt-1">Crea tu primer grupo para organizar tus dispositivos</p>
            </div>
          ) : (
            groups.map((group) => {
              // Usar el deviceCount del backend si está disponible, sino calcularlo
              const deviceCount = group.deviceCount || (group as any).deviceArray?.length || 0;
              return (
                <div
                  key={group.DeviceGroupID}
                  onClick={() => handleGroupClick(group)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedGroup?.DeviceGroupID === group.DeviceGroupID
                      ? 'bg-emerald-500/20 border-emerald-500/30 shadow-lg'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedGroup?.DeviceGroupID === group.DeviceGroupID
                          ? 'bg-emerald-500/30'
                          : 'bg-white/10'
                      }`}>
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white">{group.GroupName}</h4>
                        <p className="text-xs text-white/50">
                          {`${deviceCount} dispositivo${deviceCount !== 1 ? 's' : ''}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-white/50 max-w-[120px] truncate">
                      {group.Description || 'Sin descripción'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceSelector; 