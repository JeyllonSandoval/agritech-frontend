// ============================================================================
// CREATE GROUP PAGE
// Three-step process for creating device groups
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, UsersIcon, CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import telemetryService from '../../../services/telemetryService';
import { GroupCreation, DeviceInfo } from '../../../types/telemetry';
import { showSuccessToast } from '@/components/common/SuccessToast';

interface GroupFormData {
  groupName: string;
  description: string;
}

interface CreateGroupPageProps {}

const CreateGroupPage: React.FC<CreateGroupPageProps> = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);
  
  const [formData, setFormData] = useState<GroupFormData>({
    groupName: '',
    description: ''
  });

  const steps = [
    {
      id: 1,
      title: 'Información del Grupo',
      description: 'Define el nombre y descripción del grupo',
      icon: UsersIcon
    },
    {
      id: 2,
      title: 'Selección de Dispositivos',
      description: 'Elige los dispositivos que formarán parte del grupo',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 3,
      title: 'Confirmación',
      description: 'Verifica y confirma la creación del grupo',
      icon: CheckCircleIcon
    }
  ];

  // Cargar dispositivos del usuario
  useEffect(() => {
    const loadDevices = async () => {
      setLoadingDevices(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay sesión activa');
        }

        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userId = tokenPayload.UserID;

        const response = await telemetryService.getDevices({ userId });
        if (response.success && response.data) {
          setDevices(response.data);
        } else {
          throw new Error('Error al cargar dispositivos');
        }
      } catch (error) {
        console.error('Error cargando dispositivos:', error);
        setError('Error al cargar los dispositivos. Por favor, intenta de nuevo.');
      } finally {
        setLoadingDevices(false);
      }
    };

    if (currentStep >= 2) {
      loadDevices();
    }
  }, [currentStep]);

  const handleInputChange = (field: keyof GroupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const handleDeviceSelection = (deviceId: string, selected: boolean) => {
    if (selected) {
      setSelectedDevices(prev => [...prev, deviceId]);
    } else {
      setSelectedDevices(prev => prev.filter(id => id !== deviceId));
    }
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(device => device.DeviceID));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa. Por favor, inicia sesión.');
      }

      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const userId = tokenPayload.UserID;

      const groupData = {
        GroupName: formData.groupName,
        UserID: userId,
        Description: formData.description || undefined,
        deviceIds: selectedDevices // CAMBIO: deviceIds como espera la implementación del backend
      };

      console.log('Creando grupo:', groupData);
      console.log('selectedDevices:', selectedDevices);
      console.log('selectedDevices.length:', selectedDevices.length);
      
      const response = await telemetryService.createGroup(groupData);
      
      if (
        (response && typeof response === 'object' && 'DeviceGroupID' in response) ||
        (response && typeof response === 'object' && response.success)
      ) {
        localStorage.setItem('showGroupCreatedToast', '1');
        router.push('/telemetry');
      } else {
        throw new Error(Array.isArray(response.error) ? response.error.join('; ') : response.error || 'Error al crear el grupo');
      }
    } catch (error) {
      console.error('Error al crear grupo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el grupo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.groupName.trim().length > 0;
      case 2:
        return selectedDevices.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const getSelectedDevices = () => {
    return devices.filter(device => selectedDevices.includes(device.DeviceID));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <UsersIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Información del Grupo</h3>
                  <p className="text-white/80 text-sm">
                    Define el nombre y descripción de tu nuevo grupo de dispositivos. 
                    Los grupos te permiten organizar y gestionar múltiples dispositivos de manera eficiente.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => handleInputChange('groupName', e.target.value)}
                  className="w-full mb-4 text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Estaciones Campo Norte"
                />

                <label className="block text-sm font-medium text-white/80 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Describe el propósito o ubicación de este grupo de dispositivos..."
                />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-emerald-400 mb-1">Selección de Dispositivos</p>
                  <p>
                    Selecciona los dispositivos que quieres incluir en este grupo. 
                    Puedes seleccionar múltiples dispositivos para gestionarlos juntos.
                  </p>
                </div>
              </div>
            </div>

            {loadingDevices ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 text-lg border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white/80 text-lg">Cargando dispositivos...</span>
                </div>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12 text-lg">
                <DevicePhoneMobileIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 mb-2">No hay dispositivos disponibles</p>
                <p className="text-white/40 text-sm">
                  Primero necesitas agregar dispositivos antes de crear un grupo.
                </p>
                <button
                  onClick={() => router.push('/telemetry/add-device')}
                  className="mt-4 px-4 py-2 text-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300"
                >
                  Agregar Dispositivo
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Dispositivos Disponibles ({devices.length})
                  </h3>
                  <button
                    onClick={handleSelectAll}
                    className="px-3 py-1 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
                  >
                    {selectedDevices.length === devices.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                  {devices.map((device) => (
                    <div
                      key={device.DeviceID}
                      className={`p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                        selectedDevices.includes(device.DeviceID)
                          ? 'bg-emerald-500/20 border-emerald-500/30'
                          : 'bg-white/10 border-white/20 hover:bg-white/20'
                      }`}
                      onClick={() => handleDeviceSelection(
                        device.DeviceID, 
                        !selectedDevices.includes(device.DeviceID)
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedDevices.includes(device.DeviceID)}
                          onChange={() => {}}
                          className="mt-1 w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500/50"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-white mb-1">{device.DeviceName}</h4>
                          <p className="text-white/60 text-sm mb-2">
                            {device.DeviceType} • {device.status}
                          </p>
                          <p className="text-white/40 text-xs font-mono">
                            MAC: {device.DeviceMac}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedDevices.length > 0 && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mt-4">
                    <p className="text-emerald-400 text-sm font-medium">
                      {selectedDevices.length} dispositivo{selectedDevices.length !== 1 ? 's' : ''} seleccionado{selectedDevices.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 3:
        const selectedDevicesList = getSelectedDevices();
        
        return (
          <div className="space-y-6">
            {/* Información del grupo */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información del Grupo</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-white/70">Nombre:</span>
                  <span className="text-white font-medium">{formData.groupName}</span>
                </div>
                
                {formData.description && (
                  <div className="flex justify-between text-lg">
                    <span className="text-white/70">Descripción:</span>
                    <span className="text-white">{formData.description}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Dispositivos seleccionados */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Dispositivos Seleccionados ({selectedDevicesList.length})
              </h3>
              
              <div className="space-y-3">
                {selectedDevicesList.map((device) => (
                  <div key={device.DeviceID} className="flex items-center justify-between p-3 text-lg bg-white/5 rounded-lg">
                    <div>
                      <h4 className="font-medium text-white">{device.DeviceName}</h4>
                      <p className="text-white/60 text-sm">
                        {device.DeviceType} • {device.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs font-mono">{device.DeviceMac}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-lg">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-emerald-400 mb-1">Listo para Crear</p>
                  <p>
                    El grupo será creado con {selectedDevicesList.length} dispositivo{selectedDevicesList.length !== 1 ? 's' : ''} 
                    y podrás gestionarlos de manera unificada.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 bg-white/10 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Crear Nuevo Grupo
            </h1>
            <p className="text-white/60 text-sm">
              Organiza tus dispositivos en grupos para una gestión más eficiente
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/20 text-white/50'
                    }`}>
                      {currentStep > step.id ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3 hidden md:block">
                      <div className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-white' : 'text-white/50'
                      }`}>
                        {step.title}
                      </div>
                      <div className="text-sm text-white/60">
                        {step.description}
                      </div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-emerald-500' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
            {renderStepContent()}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 mt-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 text-lg bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/telemetry')}
                  className="px-6 py-3 text-lg bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  Cancelar
                </button>

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="px-6 py-3 text-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isStepValid(currentStep)}
                    className="px-6 py-3 text-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        Creando...
                      </>
                    ) : (
                      <>
                        <PlusIcon className="w-4 h-4" />
                        Crear Grupo
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage; 