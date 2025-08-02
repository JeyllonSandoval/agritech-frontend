// ============================================================================
// MANAGE DEVICES AND GROUPS PAGE
// Modern, minimalist interface for device and group management
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../../utils/protectedRoute';
import DeviceManager from '../../../components/features/telemetry/DeviceManager';
import DeviceGroupManager from '../../../components/features/telemetry/DeviceGroupManager';
import { useTelemetry } from '../../../hooks/useTelemetry';
import { showSuccessToast } from '@/components/common/SuccessToast';
import { 
  DevicePhoneMobileIcon, 
  UserGroupIcon, 
  PlusIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const ManagePage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'devices' | 'groups'>('devices');
  const [showDeviceManager, setShowDeviceManager] = useState(false);
  const [showGroupManager, setShowGroupManager] = useState(false);

  const {
    devices,
    groups,
    fetchDevices,
    fetchGroups
  } = useTelemetry({ autoPoll: false });

  useEffect(() => {
    fetchDevices();
    fetchGroups();
  }, [fetchDevices, fetchGroups]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('showDeviceCreatedToast')) {
        showSuccessToast('¡Dispositivo creado exitosamente!');
        localStorage.removeItem('showDeviceCreatedToast');
      } else if (localStorage.getItem('showGroupCreatedToast')) {
        showSuccessToast('¡Grupo creado exitosamente!');
        localStorage.removeItem('showGroupCreatedToast');
      }
    }
  }, []);

  const handleBackToTelemetry = () => {
    router.push('/telemetry');
  };

  const handleShowDeviceManager = () => {
    setShowDeviceManager(true);
  };

  const handleHideDeviceManager = () => {
    setShowDeviceManager(false);
    fetchDevices();
  };

  const handleShowGroupManager = () => {
    setShowGroupManager(true);
  };

  const handleHideGroupManager = () => {
    setShowGroupManager(false);
    fetchGroups();
  };

  const activeDevices = devices.filter(d => d.status === 'active').length;
  const inactiveDevices = devices.filter(d => d.status !== 'active').length;
  const groupsWithDevices = groups.filter(g => g.deviceCount && g.deviceCount > 0).length;
  const avgDevicesPerGroup = groups.length > 0 
    ? Math.round(groups.reduce((sum, g) => sum + (g.deviceCount || 0), 0) / groups.length)
    : 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen text-base">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTelemetry}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 text-white/60 hover:text-white"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">Gestión</h1>
                <p className="text-white/60 mt-1">Administra dispositivos y grupos</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-white/5 rounded-2xl p-1 backdrop-blur-xl border border-white/10">
            <button
              onClick={() => setActiveTab('devices')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'devices'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <DevicePhoneMobileIcon className="w-5 h-5" />
              <span>Dispositivos</span>
              <span className="px-2 py-1 rounded-full bg-white/10 text-xs font-medium">
                {devices.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'groups'
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>Grupos</span>
              <span className="px-2 py-1 rounded-full bg-white/10 text-xs font-medium">
                {groups.length}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Action Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {activeTab === 'devices' ? 'Dispositivos EcoWitt' : 'Grupos de Dispositivos'}
                  </h2>
                  <p className="text-white/60 mt-1">
                    {activeTab === 'devices' 
                      ? 'Gestiona tus dispositivos de monitoreo meteorológico'
                      : 'Organiza tus dispositivos en grupos para monitoreo conjunto'
                    }
                  </p>
                </div>
                <button
                  onClick={activeTab === 'devices' ? handleShowDeviceManager : handleShowGroupManager}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <PlusIcon className="w-5 h-5" />
                  {activeTab === 'devices' ? 'Gestionar' : 'Crear Grupo'}
                </button>
              </div>

              {/* Content Cards */}
              {activeTab === 'devices' ? (
                <div className="space-y-4">
                  {devices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {devices.map((device) => (
                        <div key={device.DeviceID} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${
                                device.status === 'active' 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : 'bg-orange-500/20 text-orange-400'
                              }`}>
                                <DevicePhoneMobileIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                                  {device.DeviceName}
                                </h3>
                                <p className="text-white/60 text-sm">{device.DeviceType}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              device.status === 'active' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-orange-500/20 text-orange-400'
                            }`}>
                              {device.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-white/60 text-sm font-mono">{device.DeviceMac}</p>
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <CogIcon className="w-4 h-4" />
                              <span>ID: {device.DeviceID.slice(0, 8)}...</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <DevicePhoneMobileIcon className="w-10 h-10 text-white/30" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No hay dispositivos</h3>
                      <p className="text-white/60 mb-6">Comienza agregando tu primer dispositivo EcoWitt</p>
                      <button
                        onClick={handleShowDeviceManager}
                        className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        Agregar Dispositivo
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {groups.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {groups.map((group) => (
                        <div key={group.DeviceGroupID} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-200 group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                                <UserGroupIcon className="w-5 h-5" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                  {group.GroupName}
                                </h3>
                                <p className="text-white/60 text-sm">
                                  {group.deviceCount || 0} dispositivos
                                </p>
                              </div>
                            </div>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                              Grupo
                            </span>
                          </div>
                          <div className="space-y-2">
                            <p className="text-white/60 text-sm">
                              {group.Description || 'Sin descripción'}
                            </p>
                            <div className="flex items-center gap-2 text-white/40 text-xs">
                              <ChartBarIcon className="w-4 h-4" />
                              <span>Creado: {new Date(group.createdAt).toLocaleDateString('es-ES')}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <UserGroupIcon className="w-10 h-10 text-white/30" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No hay grupos</h3>
                      <p className="text-white/60 mb-6">Crea tu primer grupo para organizar tus dispositivos</p>
                      <button
                        onClick={handleShowGroupManager}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        Crear Grupo
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">

              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Acciones Rápidas</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push('/telemetry/add-device')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 transition-all duration-200"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="font-medium">Agregar Dispositivo</span>
                  </button>
                  <button
                    onClick={() => router.push('/telemetry/create-group')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition-all duration-200"
                  >
                    <PlusIcon className="w-5 h-5" />
                    <span className="font-medium">Crear Grupo</span>
                  </button>
                  <button
                    onClick={() => router.push('/telemetry/compare')}
                    className="w-full flex items-center gap-3 p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 transition-all duration-200"
                  >
                    <ChartBarIcon className="w-5 h-5" />
                    <span className="font-medium">Comparar Dispositivos</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showDeviceManager && (
          <DeviceManager
            onClose={handleHideDeviceManager}
            onDeviceCreated={fetchDevices}
            onDeviceUpdated={fetchDevices}
            onDeviceDeleted={fetchDevices}
          />
        )}

        {showGroupManager && (
          <DeviceGroupManager
            devices={devices}
            groups={groups}
            onClose={handleHideGroupManager}
            onGroupCreated={(group) => {
              fetchGroups();
            }}
            onGroupUpdated={(group) => {
              fetchGroups();
            }}
            onGroupDeleted={(groupId) => {
              fetchGroups();
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
};

export default ManagePage; 