// ============================================================================
// CREATE REPORT SELECTOR
// Component for selecting devices and groups in report creation with filters
// ============================================================================

import React, { useState, useMemo } from 'react';
import { DeviceInfo, Group } from '../../../types/telemetry';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { LiaSearchSolid } from "react-icons/lia";

interface CreateReportSelectorProps {
  devices: DeviceInfo[];
  groups: Group[];
  selectedTarget: string;
  onTargetChange: (target: string) => void;
  reportType: 'device' | 'group';
}

const CreateReportSelector: React.FC<CreateReportSelectorProps> = ({
  devices,
  groups,
  selectedTarget,
  onTargetChange,
  reportType
}) => {
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
    onTargetChange(device.DeviceID);
  };

  const handleGroupClick = (group: Group) => {
    onTargetChange(group.DeviceGroupID);
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
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-white/80">Filtrar por tipo:</label>
        {(deviceTypeFilter !== 'all' || searchTerm) && (
          <button
            onClick={handleClearFilters}
            className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <XMarkIcon className="w-3 h-3" />
            Limpiar
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        <button
          onClick={() => handleDeviceTypeFilterChange('all')}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
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
            className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${
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
    <div className="flex items-center gap-2 relative mb-3">
      <input
        type="text"
        placeholder={`Buscar ${reportType === 'device' ? 'dispositivos' : 'grupos'}...`}
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="w-full pr-8 p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm placeholder-white/50"
      />
      <LiaSearchSolid className="absolute right-2.5 w-4 h-4 text-white/40" />
    </div>
  );

  const renderEmptyState = () => (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-center">
      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-2">
        {reportType === 'device' ? (
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        )}
      </div>
      <p className="text-white/60 text-xs">
        No hay {reportType === 'device' ? 'dispositivos' : 'grupos'} disponibles
      </p>
    </div>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-3">
      {/* Search Bar */}
      {renderSearchBar()}

      {/* Device Type Filter - Solo para dispositivos */}
      {reportType === 'device' && devices.length > 0 && renderDeviceTypeFilter()}

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto scrollbar">
        {reportType === 'device' ? (
          filteredDevices.length > 0 ? (
            filteredDevices.map((device) => (
              <button
                key={device.DeviceID}
                onClick={() => handleDeviceClick(device)}
                className={`w-full p-2 rounded-lg border transition-all duration-200 text-left ${
                  selectedTarget === device.DeviceID
                    ? 'bg-emerald-500/20 border-emerald-500/30 shadow-sm'
                    : 'bg-white/10 border-white/20 hover:bg-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1 rounded-md ${
                      selectedTarget === device.DeviceID
                        ? 'bg-emerald-500/30'
                        : 'bg-white/10'
                    }`}>
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-white truncate">{device.DeviceName}</h4>
                      <p className="text-xs text-white/50">{device.DeviceType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'active' ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                    {selectedTarget === device.DeviceID && (
                      <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            renderEmptyState()
          )
        ) : (
          filteredGroups.length > 0 ? (
            filteredGroups.map((group) => {
              const deviceCount = group.deviceCount || 0;
              return (
                <button
                  key={group.DeviceGroupID}
                  onClick={() => handleGroupClick(group)}
                  className={`w-full p-2 rounded-lg border transition-all duration-200 text-left ${
                    selectedTarget === group.DeviceGroupID
                      ? 'bg-emerald-500/20 border-emerald-500/30 shadow-sm'
                      : 'bg-white/10 border-white/20 hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded-md ${
                        selectedTarget === group.DeviceGroupID
                          ? 'bg-emerald-500/30'
                          : 'bg-white/10'
                      }`}>
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-white truncate">{group.GroupName}</h4>
                        <p className="text-xs text-white/50">{deviceCount} dispositivos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${group.status === 'active' ? 'bg-emerald-400' : 'bg-gray-400'}`}></div>
                      {selectedTarget === group.DeviceGroupID && (
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
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

export default CreateReportSelector; 