// ============================================================================
// ADD DEVICE PAGE
// Three-step process for adding new telemetry devices with improved clarity
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
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

interface TouchedFields {
  deviceName: boolean;
  deviceType: boolean;
  deviceMac: boolean;
  deviceApplicationKey: boolean;
  deviceApiKey: boolean;
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
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    deviceName: false,
    deviceType: false,
    deviceMac: false,
    deviceApplicationKey: false,
    deviceApiKey: false
  });

  // Remover el useEffect que validaba automáticamente en el paso 2
  // Las validaciones ahora solo se mostrarán cuando el usuario toque un campo

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

  const checklistData = [
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

  const [checklist, setChecklist] = useState(checklistData);

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
        if (value.length < 5) return 'La Application Key debe tener al menos 5 caracteres';
        // Permitir cualquier string con caracteres alfanuméricos, guiones, guiones bajos y dos puntos
        if (!/^[a-zA-Z0-9:_-]+$/.test(value)) return 'La Application Key solo puede contener letras, números, guiones, guiones bajos y dos puntos';
        return undefined;
      
      case 'deviceApiKey':
        if (!value.trim()) return 'La API Key es requerida';
        if (value.length < 5) return 'La API Key debe tener al menos 5 caracteres';
        // Permitir cualquier string con caracteres alfanuméricos, guiones, guiones bajos y dos puntos
        if (!/^[a-zA-Z0-9:_-]+$/.test(value)) return 'La API Key solo puede contener letras, números, guiones, guiones bajos y dos puntos';
        return undefined;
      
      case 'deviceType':
        if (!value.trim()) return 'El tipo de dispositivo es requerido';
        // Validar que el tipo esté en la lista de tipos válidos
        const validTypes = DEVICE_TYPES.map(t => t.value);
        if (!validTypes.includes(value)) return 'Tipo de dispositivo inválido';
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
    
    // Limpiar error general si hay un error específico
    setError(null);
  };

  const handleInputBlur = (field: keyof DeviceFormData) => {
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
        // Verificar que todos los campos requeridos estén llenos y sin errores de validación
        // Solo considerar errores de validación para campos que han sido tocados
        const hasValidationErrors = Object.keys(validationErrors).some(field => 
          touchedFields[field as keyof TouchedFields]
        );
        return formData.deviceName.trim() && 
               formData.deviceMac.trim() && 
               formData.deviceApplicationKey.trim() && 
               formData.deviceApiKey.trim() &&
               formData.deviceType.trim() &&
               !hasValidationErrors;
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
          <div className="space-y-6 text-lg">
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
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                      src="https://www.youtube.com/embed/gIf-sgLexV8"
                      title="Tutorial de Configuración EcoWitt"
                      className="absolute top-0 left-0 w-full h-full rounded-lg"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-white/70 text-sm mt-3">
                    Video tutorial oficial de EcoWitt para configurar tu dispositivo correctamente.
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
                  className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {checklist.every(item => item.completed) ? 'Desmarcar Todo' : 'Marcar Todo'}
                </button>
              </div>
              <div className="space-y-4">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-start gap-4 cursor-pointer group">
                    {/* Custom Checkbox */}
                    <div className="relative flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`
                        w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center
                        ${item.completed 
                          ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/25' 
                          : 'bg-white/5 border-white/30 group-hover:border-emerald-400 group-hover:bg-white/10'
                        }
                      `}>
                        {item.completed && (
                          <svg 
                            className="w-4 h-4 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 pt-0.5">
                      <span className={`
                        text-base leading-relaxed transition-all duration-200
                        ${item.completed 
                          ? 'text-white/60 line-through' 
                          : 'text-white group-hover:text-white/90'
                        }
                      `}>
                        {item.text}
                      </span>
                      
                      {/* Progress indicator */}
                      {item.completed && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-emerald-400 font-medium">Completado</span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-white/60 mb-2">
                  <span>Progreso</span>
                  <span>{checklist.filter(item => item.completed).length} de {checklist.length}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                    style={{ 
                      width: `${(checklist.filter(item => item.completed).length / checklist.length) * 100}%` 
                    }}
                  ></div>
                </div>
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
          <div className="space-y-6 text-lg">
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
                    onBlur={() => handleInputBlur('deviceName')}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: Estación del Jardín"
                  />
                  {touchedFields.deviceName && validationErrors.deviceName && (
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
                    onBlur={() => handleInputBlur('deviceType')}
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
                  {touchedFields.deviceType && validationErrors.deviceType && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceType}</p>
                  )}
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
                    onBlur={() => handleInputBlur('deviceMac')}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="AA:BB:CC:DD:EE:FF"
                  />
                  {touchedFields.deviceMac && validationErrors.deviceMac && (
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
                    onBlur={() => handleInputBlur('deviceApplicationKey')}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Tu Application Key de EcoWitt"
                  />
                  {touchedFields.deviceApplicationKey && validationErrors.deviceApplicationKey && (
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
                    onBlur={() => handleInputBlur('deviceApiKey')}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Tu API Key de EcoWitt"
                  />
                  {touchedFields.deviceApiKey && validationErrors.deviceApiKey && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.deviceApiKey}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/5 border border-yellow-500/20 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
                    <h4 className="text-lg font-semibold text-yellow-400">¿Dónde encontrar las credenciales?</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Credenciales API */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <h5 className="text-sm font-medium text-emerald-400">Credenciales API</h5>
                      </div>
                      <ol className="text-sm text-white/70 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs font-medium text-emerald-400">1</span>
                          <span>Inicia sesión en tu cuenta de <a href="https://www.ecowitt.net/home/login" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">EcoWitt.net</a></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs font-medium text-emerald-400">2</span>
                          <span>Ve a <strong>"Parte superior derecha"</strong> → <strong>"User Profile"</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs font-medium text-emerald-400">3</span>
                          <span>Genera una nueva <strong>API Key</strong> y <strong>Application Key</strong></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-emerald-500/20 rounded-full flex items-center justify-center text-xs font-medium text-emerald-400">4</span>
                          <span>Copia ambas credenciales para usarlas aquí</span>
                        </li>
                      </ol>
                    </div>

                    {/* Dirección MAC */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <h5 className="text-sm font-medium text-blue-400">Dirección MAC</h5>
                      </div>
                      <div className="text-sm text-white/70 space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-medium text-blue-400">1</span>
                          <span>Busca en tu dispositivo físico la dirección MAC impresa</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-5 h-5 bg-blue-500/20 rounded-full flex items-center justify-center text-xs font-medium text-blue-400">2</span>
                          <span>O consulta en <a href="https://www.ecowitt.net/home/manage" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline transition-colors">EcoWitt/Manage</a></span>
                        </div>
                        <div className="mt-3 p-2 bg-white/5 rounded border border-white/10">
                          <p className="text-xs text-white/50 mb-1">Formato esperado:</p>
                          <code className="text-xs text-emerald-400 font-mono">AA:BB:CC:DD:EE:FF</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips adicionales */}
                  <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-xs text-emerald-300">
                        <strong>Tip:</strong> Guarda tus credenciales en un lugar seguro. Las necesitarás cada vez que agregues un nuevo dispositivo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-lg">
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
            <h1 className="text-2xl font-bold text-white">Agregar Dispositivo</h1>
            <p className="text-white/70">Configura tu dispositivo EcoWitt para telemetría</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="relative">
            {/* Progress Bar with Integrated Steps */}
            <div className="relative mb-8">
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

