// ============================================================================
// ADD DEVICE PAGE
// Three-step process for adding new telemetry devices
// ============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, WifiIcon, CheckCircleIcon, PlayCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import telemetryService from '../../../services/telemetryService';
import { DeviceRegistration } from '../../../types/telemetry';

interface DeviceFormData {
  deviceName: string;
  deviceType: 'Outdoor' | 'Indoor' | 'Hybrid';
  deviceMac: string;
  deviceApplicationKey: string;
  deviceApiKey: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

const AddDevicePage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    deviceName: '',
    deviceType: 'Outdoor',
    deviceMac: '',
    deviceApplicationKey: '',
    deviceApiKey: ''
  });

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

  const deviceTypes = [
    { value: 'Outdoor', label: 'Dispositivo Exterior' },
    { value: 'Indoor', label: 'Dispositivo Interior' },
    { value: 'Hybrid', label: 'Dispositivo Híbrido' }
  ];

  // Checklist basado en el video de EcoWitt
  const setupChecklist: ChecklistItem[] = [
    {
      id: '1',
      text: 'He descargado la aplicación WS View Plus en mi dispositivo móvil',
      completed: false
    },
    {
      id: '2',
      text: 'He creado una cuenta en la aplicación WS View Plus',
      completed: false
    },
    {
      id: '3',
      text: 'He conectado mi dispositivo EcoWitt a la red WiFi',
      completed: false
    },
    {
      id: '4',
      text: 'He configurado mi dispositivo en la aplicación WS View Plus',
      completed: false
    },
    {
      id: '5',
      text: 'He obtenido mi Application Key desde la aplicación',
      completed: false
    },
    {
      id: '6',
      text: 'He obtenido mi API Key desde la aplicación',
      completed: false
    },
    {
      id: '7',
      text: 'He verificado que mi dispositivo está enviando datos correctamente',
      completed: false
    }
  ];

  const [checklist, setChecklist] = useState<ChecklistItem[]>(setupChecklist);

  const handleInputChange = (field: keyof DeviceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

      const deviceData: DeviceRegistration = {
        DeviceName: formData.deviceName,
        DeviceMac: formData.deviceMac,
        DeviceApplicationKey: formData.deviceApplicationKey,
        DeviceApiKey: formData.deviceApiKey,
        DeviceType: formData.deviceType,
        UserID: userId
      };

      console.log('Enviando datos del dispositivo:', deviceData);
      
      const response = await telemetryService.registerDevice(deviceData);
      
      if (response.success) {
        console.log('Dispositivo registrado exitosamente:', response.data);
        router.push('/telemetry');
      } else {
        throw new Error(Array.isArray(response.error) ? response.error.join('; ') : response.error || 'Error al registrar el dispositivo');
      }
    } catch (error) {
      console.error('Error al agregar dispositivo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al agregar dispositivo';
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
        return formData.deviceName && 
               formData.deviceMac && 
               formData.deviceApplicationKey && 
               formData.deviceApiKey && 
               formData.deviceType &&
               isValidMacAddress(formData.deviceMac);
      case 3:
        return true;
      default:
        return false;
    }
  };

  const isValidMacAddress = (mac: string) => {
    const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    return macRegex.test(mac);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <div className="flex items-start gap-3 mb-4">
                <PlayCircleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Configuración de Dispositivo EcoWitt</h3>
                  <p className="text-white/80 text-sm">
                    Antes de agregar tu dispositivo, necesitas configurarlo siguiendo estos pasos. 
                    Te recomendamos ver el video tutorial para una guía visual completa.
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="flex items-center gap-2 text-lg px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300"
                >
                  <PlayCircleIcon className="w-5 h-5" />
                  {showVideo ? 'Ocultar Video Tutorial' : 'Ver Video Tutorial'}
                </button>
              </div>

              {showVideo && (
                <div className="mb-6">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <iframe
                      src="https://www.youtube.com/embed/gIf-sgLexV8"
                      title="Configuración de Dispositivo EcoWitt"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-white mb-3">Resumen del Video:</h4>
                <div className="text-sm text-white/80 space-y-2">
                  <p>• Descarga la aplicación <strong>WS View Plus</strong> en tu dispositivo móvil</p>
                  <p>• Crea una cuenta en la aplicación</p>
                  <p>• Conecta tu dispositivo EcoWitt a la red WiFi</p>
                  <p>• Configura el dispositivo en la aplicación</p>
                  <p>• Obtén tu <strong>Application Key</strong> y <strong>API Key</strong></p>
                  <p>• Verifica que el dispositivo esté enviando datos</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Checklist de Configuración</h3>
              <p className="text-white/80 text-sm mb-4">
                Marca cada paso como completado una vez que lo hayas realizado:
              </p>
              
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label key={item.id} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                      className="mt-1 w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500/50"
                    />
                    <span className={`text-sm ${item.completed ? 'text-emerald-400 line-through' : 'text-white/80'}`}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-emerald-400 mb-1">Información Importante</p>
                  <p>
                    Asegúrate de tener a mano la dirección MAC, Application Key y API Key de tu dispositivo EcoWitt.
                    Estos datos los puedes encontrar en la aplicación WS View Plus.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Nombre del Dispositivo *
                </label>
                <input
                  type="text"
                  value={formData.deviceName}
                  onChange={(e) => handleInputChange('deviceName', e.target.value)}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Estación Central Campo Norte"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Tipo de Dispositivo *
                </label>
                <select
                  value={formData.deviceType}
                  onChange={(e) => handleInputChange('deviceType', e.target.value as 'Outdoor' | 'Indoor' | 'Hybrid')}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {deviceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Dirección MAC *
                </label>
                <input
                  type="text"
                  value={formData.deviceMac}
                  onChange={(e) => handleInputChange('deviceMac', e.target.value)}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="AA:BB:CC:DD:EE:FF"
                />
                {formData.deviceMac && !isValidMacAddress(formData.deviceMac) && (
                  <p className="text-red-400 text-sm mt-1">Formato de MAC inválido. Use formato AA:BB:CC:DD:EE:FF</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Application Key *
                </label>
                <input
                  type="password"
                  value={formData.deviceApplicationKey}
                  onChange={(e) => handleInputChange('deviceApplicationKey', e.target.value)}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Ingresa tu Application Key"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  API Key *
                </label>
                <input
                  type="password"
                  value={formData.deviceApiKey}
                  onChange={(e) => handleInputChange('deviceApiKey', e.target.value)}
                  className="w-full text-lg bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  placeholder="Ingresa tu API Key"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {/* Checklist de configuración */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Verificación de Configuración</h3>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.completed ? (
                      <CheckCircleIcon className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-red-400 rounded-full" />
                    )}
                    <span className={`text-sm ${item.completed ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Datos del dispositivo */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Datos del Dispositivo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-2">Información Básica</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Nombre:</span>
                      <span className="text-white">{formData.deviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Tipo:</span>
                      <span className="text-white">
                        {deviceTypes.find(t => t.value === formData.deviceType)?.label}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-2">Configuración</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">MAC:</span>
                      <span className="text-white font-mono">{formData.deviceMac}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Application Key:</span>
                      <span className="text-white font-mono">••••••••</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">API Key:</span>
                      <span className="text-white font-mono">••••••••</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircleIcon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-white/80">
                  <p className="font-medium text-emerald-400 mb-1">Listo para Agregar</p>
                  <p>
                    El dispositivo será agregado a tu cuenta y comenzará a enviar datos 
                    una vez que se complete la configuración inicial.
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
              Agregar Nuevo Dispositivo
            </h1>
            <p className="text-white/60 text-sm">
              Configura un nuevo dispositivo de telemetría paso a paso
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
                      <div className="text-xs text-white/60">
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
                        Agregando...
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="w-4 h-4" />
                        Agregar Dispositivo
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

export default AddDevicePage;

