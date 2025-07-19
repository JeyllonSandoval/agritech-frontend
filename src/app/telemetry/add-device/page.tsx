// ============================================================================
// ADD DEVICE PAGE
// Three-step process for adding new telemetry devices with improved clarity
// ============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, WifiIcon, CheckCircleIcon, PlayCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import telemetryService from '../../../services/telemetryService';
import { DeviceRegistration } from '../../../types/telemetry';
import { showSuccessToast } from '@/components/common/SuccessToast';

// Tipos válidos del backend (en inglés, para enviar al backend)
const DEVICE_TYPES = [
  { value: 'Controlled environments', label: 'Ambientes controlados', description: 'Invernaderos, cultivos protegidos' },
  { value: 'Plants', label: 'Plantas', description: 'Monitoreo de cultivos específicos' },
  { value: 'Soil', label: 'Suelo', description: 'Análisis de condiciones del terreno' },
  { value: 'Climate', label: 'Clima', description: 'Estaciones meteorológicas' },
  { value: 'Large-scale farming', label: 'Agricultura a gran escala', description: 'Cultivos extensivos' },
  { value: 'home gardens', label: 'Jardines domésticos', description: 'Huertos caseros' },
  { value: 'Manual', label: 'Manual', description: 'Configuración manual' },
  { value: 'Automated', label: 'Automatizado', description: 'Sistemas automáticos' },
  { value: 'Delicate', label: 'Delicado', description: 'Cultivos sensibles' },
  { value: 'Tough', label: 'Resistente', description: 'Cultivos robustos' },
  { value: 'Outdoor', label: 'Exterior', description: 'Cultivos al aire libre' },
  { value: 'Indoor', label: 'Interior', description: 'Cultivos en interiores' },
];

interface DeviceFormData {
  deviceName: string;
  deviceType: string;
  deviceMac: string;
  deviceApplicationKey: string;
  deviceApiKey: string;
}

interface ValidationErrors {
  deviceName?: string;
  deviceType?: string;
  deviceMac?: string;
  deviceApplicationKey?: string;
  deviceApiKey?: string;
}

const AddDevicePage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    deviceName: '',
    deviceType: DEVICE_TYPES[0].value,
    deviceMac: '',
    deviceApplicationKey: '',
    deviceApiKey: ''
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const steps = [
    {
      id: 1,
      title: 'Configuración Inicial',
      description: 'Aprende a configurar tu dispositivo EcoWitt',
      icon: PlayCircleIcon
    },
    {
      id: 2,
      title: 'Datos del Dispositivo',
      description: 'Ingresa la información de tu dispositivo',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 3,
      title: 'Confirmación',
      description: 'Verifica y confirma la configuración',
      icon: CheckCircleIcon
    }
  ];

  const checklist = [
    {
      id: '1',
      text: 'Descargar la aplicación EcoWitt en tu dispositivo móvil',
      completed: false
    },
    {
      id: '2',
      text: 'Crear una cuenta en EcoWitt.net',
      completed: false
    },
    {
      id: '3',
      text: 'Conectar tu dispositivo EcoWitt a la aplicación',
      completed: false
    },
    {
      id: '4',
      text: 'Obtener las credenciales de API desde tu cuenta EcoWitt',
      completed: false
    }
  ];

  const [checklist, setChecklist] = useState(checklist);

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const validateField = (field: keyof DeviceFormData, value: string): string | undefined => {
    switch (field) {
      case 'deviceName':
        if (!value.trim()) return 'El nombre del dispositivo es requerido';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        if (!/^[a-zA-Z0-9\s\-_]+$/.test(value)) return 'El nombre solo puede contener letras, números, espacios, guiones y guiones bajos';
        return undefined;
      
      case 'deviceMac':
        if (!value.trim()) return 'La dirección MAC es requerida';
        if (!/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value)) {
          return 'Formato de MAC inválido. Use formato AA:BB:CC:DD:EE:FF o AA-BB-CC-DD-EE-FF';
        }
        return undefined;
      
      case 'deviceApplicationKey':
        if (!value.trim()) return 'La Application Key es requerida';
        if (value.length < 10) return 'La Application Key debe tener al menos 10 caracteres';
        if (!/^[a-zA-Z0-9]+$/.test(value)) return 'La Application Key solo puede contener letras y números';
        return undefined;
      
      case 'deviceApiKey':
        if (!value.trim()) return 'La API Key es requerida';
        if (value.length < 10) return 'La API Key debe tener al menos 10 caracteres';
        // Permitir cualquier string, sin más reglas
        return undefined;
      
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    Object.keys(formData).forEach((key) => {
      const field = key as keyof DeviceFormData;
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

  const handleInputChange = (field: keyof DeviceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validar el campo en tiempo real
    const error = validateField(field, value);
    setValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
    
    if (error) setError(null);
  };

  const handleChecklistChange = (id: string, completed: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed } : item
      )
    );
  };

  const handleSelectAllChecks = () => {
    const allCompleted = checklist.every(item => item.completed);
    setChecklist(prev => 
      prev.map(item => ({ ...item, completed: !allCompleted }))
    );
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

      // Enviar DeviceType en inglés
      const deviceData = {
        DeviceName: formData.deviceName,
        DeviceMac: formData.deviceMac,
        DeviceApplicationKey: formData.deviceApplicationKey,
        DeviceApiKey: formData.deviceApiKey,
        DeviceType: formData.deviceType, // valor en inglés
        UserID: userId
      };

      console.log('🔍 Enviando datos del dispositivo:', deviceData);
      
      const response = await telemetryService.registerDevice(deviceData);
      
      console.log('🔍 Respuesta del servidor:', response);
      
      if (response.success && response.data) {
        localStorage.setItem('showDeviceCreatedToast', '1');
        router.push('/telemetry');
      } else {
        throw new Error(Array.isArray(response.error) ? response.error.join('; ') : response.error || 'Error al crear el dispositivo');
      }
    } catch (error) {
      console.error('Error al crear dispositivo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al crear el dispositivo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return checklist.every(item => item.completed);
      case 2:
        return Object.keys(validationErrors).length === 0 && 
               formData.deviceName && 
               formData.deviceMac && 
               formData.deviceApplicationKey && 
               formData.deviceApiKey;
      case 3:
        return true;
      default:
        return false;
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Video Section */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <PlayCircleIcon className="w-5 h-5 text-emerald-400" />
                Configuración de EcoWitt
              </h3>
              <p className="text-white/70 mb-4">
                Antes de continuar, asegúrate de tener tu dispositivo EcoWitt configurado correctamente.
              </p>
              <button
                onClick={() => setShowVideo(!showVideo)}
                className="px-4 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                {showVideo ? 'Ocultar Video' : 'Ver Video Tutorial'}
              </button>
              {showVideo && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <p className="text-white/70 text-sm">
                    Video tutorial de configuración de EcoWitt (implementar cuando esté disponible)
                  </p>
                </div>
              )}
            </div>

            {/* Checklist */}
            <div className="bg-white/10 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Lista de Verificación</h3>
                <button
                  onClick={handleSelectAllChecks}
                  className="text-sm text-emerald-400 hover:text-emerald-300"
                >
                  {checklist.every(item => item.completed) ? 'Desmarcar Todo' : 'Marcar Todo'}
                </button>
              </div>
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                      className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400"
                    />
                    <span className={`text-sm ${item.completed ? 'text-white/50 line-through' : 'text-white'}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Information Box */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <InformationCircleIcon className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-400 mb-1">Información Importante</h4>
                  <p className="text-sm text-white/70">
                    Asegúrate de completar todos los pasos de la lista de verificación antes de continuar. 
                    Esto garantizará que tu dispositivo funcione correctamente con nuestro sistema.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Device Information Form */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <DevicePhoneMobileIcon className="w-5 h-5 text-emerald-400" />
                Información del Dispositivo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Name */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Nombre del Dispositivo *
                  </label>
                  <input
                    type="text"
                    value={formData.deviceName}
                    onChange={(e) => handleInputChange('deviceName', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: Estación del Jardín"
                  />
                  {validationErrors.deviceName && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceName}</p>
                  )}
                </div>

                {/* Device Type */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Tipo de Dispositivo *
                  </label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => handleInputChange('deviceType', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    {DEVICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-white/50 mt-1">
                    {DEVICE_TYPES.find(t => t.value === formData.deviceType)?.description}
                  </p>
                </div>

                {/* MAC Address */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Dirección MAC *
                  </label>
                  <input
                    type="text"
                    value={formData.deviceMac}
                    onChange={(e) => handleInputChange('deviceMac', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="AA:BB:CC:DD:EE:FF"
                  />
                  {validationErrors.deviceMac && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceMac}</p>
                  )}
                </div>

                {/* Application Key */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Application Key *
                  </label>
                  <input
                    type="text"
                    value={formData.deviceApplicationKey}
                    onChange={(e) => handleInputChange('deviceApplicationKey', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Tu Application Key de EcoWitt"
                  />
                  {validationErrors.deviceApplicationKey && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceApplicationKey}</p>
                  )}
                </div>

                {/* API Key */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    API Key *
                  </label>
                  <input
                    type="text"
                    value={formData.deviceApiKey}
                    onChange={(e) => handleInputChange('deviceApiKey', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Tu API Key de EcoWitt"
                  />
                  {validationErrors.deviceApiKey && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceApiKey}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-400 mb-1">¿Dónde encontrar las credenciales?</h4>
                  <ul className="text-sm text-white/70 space-y-1">
                    <li>• Inicia sesión en tu cuenta de EcoWitt.net</li>
                    <li>• Ve a "Settings" → "API Settings"</li>
                    <li>• Copia tu Application Key y API Key</li>
                    <li>• La dirección MAC está impresa en tu dispositivo</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Confirmation Summary */}
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                Resumen de Configuración
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">Información del Dispositivo</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-white/50">Nombre:</span>
                      <span className="text-white ml-2">{formData.deviceName}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Tipo:</span>
                      <span className="text-white ml-2">
                        {DEVICE_TYPES.find(t => t.value === formData.deviceType)?.label}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">MAC:</span>
                      <span className="text-white ml-2 font-mono">{formData.deviceMac}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-white/80 mb-2">Credenciales</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-white/50">Application Key:</span>
                      <span className="text-white ml-2 font-mono text-xs">
                        {formData.deviceApplicationKey.substring(0, 8)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50">API Key:</span>
                      <span className="text-white ml-2 font-mono text-xs">
                        {formData.deviceApiKey.substring(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Warning */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-1">¡Listo para Registrar!</h4>
                  <p className="text-sm text-white/70">
                    Tu dispositivo será registrado en el sistema y comenzará a enviar datos automáticamente. 
                    Podrás ver los datos en tiempo real en el dashboard de telemetría.
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

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
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
            <h1 className="text-2xl font-bold text-white">Agregar Dispositivo</h1>
            <p className="text-white/70">Configura tu dispositivo EcoWitt para telemetría</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-white/20 text-white/50'
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-emerald-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className={`text-center ${currentStep >= step.id ? 'text-white' : 'text-white/50'}`}>
                <h3 className="text-sm font-medium">{step.title}</h3>
                <p className="text-xs">{step.description}</p>
              </div>
            ))}
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
          {renderStepContent()}
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
              disabled={!isStepValid(currentStep) || loading}
              className="px-6 py-2 bg-emerald-500/80 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Registrando...
                </>
              ) : (
                <>
                  <WifiIcon className="w-4 h-4" />
                  Registrar Dispositivo
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDevicePage;

