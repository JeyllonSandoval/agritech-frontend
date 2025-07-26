// ============================================================================
// CREATE GROUP PAGE
// Three-step process for creating device groups with improved styling
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, UsersIcon, CheckCircleIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import telemetryService from '../../../services/telemetryService';
import { GroupCreation, DeviceInfo } from '../../../types/telemetry';
import { showSuccessToast } from '@/components/common/SuccessToast';

interface GroupFormData {
  groupName: string;
  description: string;
}

interface ValidationErrors {
  groupName?: string;
  description?: string;
}

interface TouchedFields {
  groupName: boolean;
  description: boolean;
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

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    groupName: false,
    description: false
  });

  // Filtros para dispositivos
  const [deviceTypeFilter, setDeviceTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

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

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const validateField = (field: keyof GroupFormData, value: string): string | undefined => {
    switch (field) {
      case 'groupName':
        if (!value.trim()) return 'El nombre del grupo es requerido';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) return 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos';
        return undefined;
      
      case 'description':
        if (value.length > 200) return 'La descripción no puede exceder 200 caracteres';
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const field = key as keyof GroupFormData;
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleInputChange = (field: keyof GroupFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error general si hay un error específico
    setError(null);
  };

  const handleInputBlur = (field: keyof GroupFormData) => {
    // Marcar el campo como tocado
    setTouchedFields(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Validar el campo solo cuando el usuario sale del campo
    const error = validateField(field, formData[field]);
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        // Limpiar el error si el campo es válido
        delete newErrors[field];
      }
      return newErrors;
    });
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

  const handleClearFilters = () => {
    setDeviceTypeFilter('all');
    setSearchTerm('');
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Limpiar errores al avanzar
      setError(null);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      // Limpiar errores al retroceder
      setError(null);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

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
        deviceIds: selectedDevices
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
        // Solo considerar errores de validación para campos que han sido tocados
        const hasValidationErrors = Object.keys(validationErrors).some(field => 
          touchedFields[field as keyof TouchedFields]
        );
        return formData.groupName.trim() && !hasValidationErrors;
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

  // Obtener tipos únicos de dispositivos
  const deviceTypes = React.useMemo(() => {
    const types = [...new Set(devices.map(device => device.DeviceType))];
    return types.sort();
  }, [devices]);

  // Filtrar dispositivos por tipo y búsqueda
  const filteredDevices = React.useMemo(() => {
    return devices.filter(device => {
      const matchesType = deviceTypeFilter === 'all' || device.DeviceType === deviceTypeFilter;
      const matchesSearch = searchTerm === '' || 
        device.DeviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.DeviceType.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [devices, deviceTypeFilter, searchTerm]);

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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  value={formData.groupName}
                  onChange={(e) => handleInputChange('groupName', e.target.value)}
                  onBlur={() => handleInputBlur('groupName')}
                  className="w-full mb-4 text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Estaciones Campo Norte"
                />
                {touchedFields.groupName && validationErrors.groupName && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.groupName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onBlur={() => handleInputBlur('description')}
                  rows={4}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Describe el propósito o ubicación de este grupo de dispositivos..."
                />
                {touchedFields.description && validationErrors.description && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.description}</p>
                )}
              </div>
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
              <div className="space-y-4">
                {/* Filtros */}
                <div className="space-y-4">
                  {/* Barra de búsqueda */}
                  <div className="flex items-center gap-2 relative">
                    <input
                      type="text"
                      placeholder="Buscar dispositivos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-4 p-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm placeholder-white/50"
                    />
                    
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/70 z-10"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filtro por tipo */}
                  <div>
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
                        onClick={() => setDeviceTypeFilter('all')}
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
                          onClick={() => setDeviceTypeFilter(type)}
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

                  {/* Botón seleccionar todos */}
                  {filteredDevices.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/70">
                        {selectedDevices.length} de {filteredDevices.length} dispositivos seleccionados
                      </span>
                      <button
                        onClick={handleSelectAll}
                        className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        {selectedDevices.length === filteredDevices.length ? 'Deseleccionar Todo' : 'Seleccionar Todo'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Lista de dispositivos */}
                <div className="flex flex-col md:flex-row gap-4 max-h-96 overflow-y-auto">
                  {filteredDevices.length > 0 ? (
                    filteredDevices.map((device) => (
                      <div
                        key={device.DeviceID}
                        onClick={() => handleDeviceSelection(device.DeviceID, !selectedDevices.includes(device.DeviceID))}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedDevices.includes(device.DeviceID)
                            ? 'bg-emerald-500/20 border-emerald-500/30 shadow-lg'
                            : 'bg-white/10 border-white/20 hover:bg-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              selectedDevices.includes(device.DeviceID)
                                ? 'bg-emerald-500/30'
                                : 'bg-white/10'
                            }`}>
                              <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400" />
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
                    <div className="text-center py-8">
                      <div className="text-white/50 text-sm">
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
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
    <div className="min-h-screen text-lg">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Crear Nuevo Grupo</h1>
            <p className="text-white/70">Organiza tus dispositivos en grupos para una gestión más eficiente</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative">
            {/* Progress Bar Background */}
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/20 rounded-full"></div>
            
            {/* Progress Bar Fill */}
            <div 
              className="absolute top-5 left-0 h-0.5 bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            ></div>
            
            {/* Steps Integrated in Progress Bar */}
            <div className="relative flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step Circle Integrated in Progress Bar */}
                  <div className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 z-10
                    ${currentStep >= step.id 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'bg-gray-900 border-white/30 text-white/50'
                    }
                  `}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  
                  {/* Step Label */}
                  <div className="mt-4 text-center">
                    <h3 className={`text-sm font-medium transition-all duration-300 ${
                      currentStep >= step.id ? 'text-white' : 'text-white/50'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-xs mt-1 transition-all duration-300 ${
                      currentStep >= step.id ? 'text-white/70' : 'text-white/40'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Step Content */}
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-lg">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => router.push('/telemetry')}
              className="px-6 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Cancelar
            </button>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="px-6 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStepValid(currentStep)}
                className="px-6 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
  );
};

export default CreateGroupPage; 