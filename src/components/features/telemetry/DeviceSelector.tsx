// ============================================================================
// DEVICE SELECTOR
// Component for selecting devices and groups with improved filtering
// ============================================================================

import React, { useState, useMemo } from 'react';
import { DeviceInfo, Group } from '../../../types/telemetry';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LiaSearchSolid } from "react-icons/lia";
  
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
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // ============================================================================
  // FILTERED DATA
  // ============================================================================

  // Obtener tipos únicos de dispositivos
  const deviceTypes = useMemo(() => {
    const types = [...new Set(devices.map(device => device.DeviceType))];
    return types.sort();
  }, [devices]);

  // Filtrar dispositivos por tipo y búsqueda
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesType = deviceTypeFilter === 'all' || device.DeviceType === deviceTypeFilter;
      const matchesSearch = searchTerm === '' || 
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [devices, deviceTypeFilter, searchTerm]);

  // Filtrar grupos por búsqueda
  const filteredGroups = useMemo(() => {
    return groups.filter(group => {
      return searchTerm === '' || 
        group.GroupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.Description && group.Description.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }, [groups, searchTerm]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleDeviceClick = (device: DeviceInfo) => {
    console.log('🔍 [DEVICE_SELECTOR] Device clicked:', device.DeviceName);
    // Solo llamar si el dispositivo no está ya seleccionado
    if (selectedDevice?.DeviceID !== device.DeviceID) {
      onDeviceSelect(device);
      onGroupSelect(null);
    }
  };

  const handleGroupClick = (group: Group) => {
    console.log('🔍 [DEVICE_SELECTOR] Group clicked:', group.GroupName);
    // Solo llamar si el grupo no está ya seleccionado
    if (selectedGroup?.DeviceGroupID !== group.DeviceGroupID) {
      onGroupSelect(group);
      onDeviceSelect(null);
    }
  };

  const handleClearSelection = () => {
    console.log('🔍 [DEVICE_SELECTOR] Clearing selection');
    onDeviceSelect(null);
    onGroupSelect(null);
  };

  const handleClearFilters = () => {
    setDeviceTypeFilter('all');
    setSearchTerm('');
  };

  const handleDeviceTypeFilterChange = (type: string) => {
    setDeviceTypeFilter(type);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderDeviceTypeFilter = () => (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-white/80">Filtrar por tipo:</label>
        {(deviceTypeFilter !== 'all' || searchTerm) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <XMarkIcon className="w-3 h-3" />
            Limpiar filtros
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleDeviceTypeFilterChange('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
            deviceTypeFilter === 'all'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
              : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
          }`}
        >
          Todos ({devices.length})
        </button>
        {deviceTypes.map(type => (
          <button
            key={type}
            onClick={() => handleDeviceTypeFilterChange(type)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              deviceTypeFilter === type
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/40'
                : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
            }`}
          >
            {type} ({devices.filter(d => d.DeviceType === type).length})
          </button>
        ))}
      </div>
    </div>
  );

  const renderSearchBar = () => (
    <div className="flex items-center gap-2 relative">
        <input
          type="text"
          placeholder={`Buscar ${activeTab === 'devices' ? 'dispositivos' : 'grupos'}...`}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pr-4 p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm placeholder-white/50"
        />
        
        {searchTerm && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 z-10"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        )}
    </div>
  );

  const renderEmptyState = () => (
    <div className="text-center py-8">
      <div className="text-white/50 text-sm">
        {activeTab === 'devices' ? (
          <>
            {deviceTypeFilter !== 'all' || searchTerm ? (
              <>
                <p>No se encontraron dispositivos con los filtros aplicados.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-emerald-400 hover:text-emerald-300 mt-2 text-xs"
                >
                  Limpiar filtros
                </button>
              </>
            ) : (
              <p>No hay dispositivos registrados.</p>
            )}
          </>
        ) : (
          <>
            {searchTerm ? (
              <>
                <p>No se encontraron grupos con la búsqueda aplicada.</p>
                <button
                  onClick={handleClearFilters}
                  className="text-emerald-400 hover:text-emerald-300 mt-2 text-xs"
                >
                  Limpiar filtros
                </button>
              </>
            ) : (
              <p>No hay grupos creados.</p>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-400"></div>
        <span className="ml-3 text-white/70 text-sm">Cargando dispositivos...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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

      {/* Search Bar */}
      {renderSearchBar()}

      {/* Device Type Filter - Solo para dispositivos */}
      {activeTab === 'devices' && devices.length > 0 && renderDeviceTypeFilter()}

      {/* Clear Selection Button */}
      {(selectedDevice || selectedGroup) && (
        <button
          onClick={handleClearSelection}
          className="w-full py-2 px-4 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors text-sm border border-red-500/20"
        >
          ✕ Limpiar selección
        </button>
      )}

      {/* Current Selection Indicator */}
      {(selectedDevice || selectedGroup) && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-200 font-medium">
                Seleccionado:
              </span>
              <span className="text-sm text-white">
                {selectedDevice ? selectedDevice.DeviceName : selectedGroup?.GroupName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="space-y-2 max-h-[500px] min-w-[200px] overflow-y-auto scrollbar flex flex-col">
        {activeTab === 'devices' ? (
          filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <div
                key={device.DeviceID}
                onClick={() => handleDeviceClick(device)}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
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
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            renderEmptyState()
          )
        ) : (
          filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const deviceCount = group.deviceCount || 0;
              return (
                <div
                  key={group.DeviceGroupID}
                  onClick={() => handleGroupClick(group)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
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
          ) : (
            renderEmptyState()
          )
        )}
      </div>
    </div>
  );
};

export default DeviceSelector; 