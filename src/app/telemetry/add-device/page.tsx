// ============================================================================
// ADD DEVICE PAGE
// Multi-step form for adding new telemetry devices
// ============================================================================

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, DevicePhoneMobileIcon, WifiIcon, Cog6ToothIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface DeviceFormData {
  deviceName: string;
  deviceType: string;
  location: string;
  description: string;
  apiKey: string;
  deviceId: string;
  connectionType: 'wifi' | 'cellular' | 'ethernet';
  timezone: string;
}

const AddDevicePage: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<DeviceFormData>({
    deviceName: '',
    deviceType: '',
    location: '',
    description: '',
    apiKey: '',
    deviceId: '',
    connectionType: 'wifi',
    timezone: 'America/Mexico_City'
  });

  const steps = [
    {
      id: 1,
      title: 'Información Básica',
      description: 'Datos principales del dispositivo',
      icon: DevicePhoneMobileIcon
    },
    {
      id: 2,
      title: 'Configuración de Red',
      description: 'Configuración de conectividad',
      icon: WifiIcon
    },
    {
      id: 3,
      title: 'Configuración Avanzada',
      description: 'Parámetros adicionales',
      icon: Cog6ToothIcon
    },
    {
      id: 4,
      title: 'Confirmación',
      description: 'Revisar y confirmar',
      icon: CheckCircleIcon
    }
  ];

  const deviceTypes = [
    { value: 'weather_station', label: 'Estación Meteorológica' },
    { value: 'soil_sensor', label: 'Sensor de Suelo' },
    { value: 'irrigation_controller', label: 'Controlador de Riego' },
    { value: 'camera', label: 'Cámara de Monitoreo' },
    { value: 'gateway', label: 'Gateway IoT' }
  ];

  const connectionTypes = [
    { value: 'wifi', label: 'WiFi', icon: '📶' },
    { value: 'cellular', label: 'Cellular', icon: '📱' },
    { value: 'ethernet', label: 'Ethernet', icon: '🔌' }
  ];

  const timezones = [
    { value: 'America/Mexico_City', label: 'Ciudad de México (UTC-6)' },
    { value: 'America/New_York', label: 'Nueva York (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'Los Ángeles (UTC-8)' },
    { value: 'Europe/Madrid', label: 'Madrid (UTC+1)' }
  ];

  const handleInputChange = (field: keyof DeviceFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Enviando datos del dispositivo:', formData);
      
      // Simular delay de envío
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirigir a la página de telemetría
      router.push('/telemetry');
    } catch (error) {
      console.error('Error al agregar dispositivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.deviceName && formData.deviceType && formData.location;
      case 2:
        return formData.apiKey && formData.deviceId;
      case 3:
        return true; // Configuración opcional
      case 4:
        return true; // Confirmación
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nombre del Dispositivo *
              </label>
              <input
                type="text"
                value={formData.deviceName}
                onChange={(e) => handleInputChange('deviceName', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Ej: Estación Central Campo Norte"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tipo de Dispositivo *
              </label>
              <select
                value={formData.deviceType}
                onChange={(e) => handleInputChange('deviceType', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                <option value="">Seleccionar tipo...</option>
                {deviceTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Ej: Campo Norte, Sector A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Descripción opcional del dispositivo..."
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                API Key *
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => handleInputChange('apiKey', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Ingresa tu API key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                ID del Dispositivo *
              </label>
              <input
                type="text"
                value={formData.deviceId}
                onChange={(e) => handleInputChange('deviceId', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                placeholder="Ej: WS-001-2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Tipo de Conexión
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {connectionTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('connectionType', type.value)}
                    className={`p-4 rounded-lg border transition-all duration-300 ${
                      formData.connectionType === type.value
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Zona Horaria
              </label>
              <select
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              >
                {timezones.map(tz => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div className="text-sm text-white/80">
                  <p className="font-medium text-blue-400 mb-1">Configuración Avanzada</p>
                  <p>
                    Estas configuraciones son opcionales y pueden ser modificadas posteriormente 
                    desde el panel de configuración del dispositivo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-white/10 border border-white/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Resumen del Dispositivo</h3>
              
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
                    <div className="flex justify-between">
                      <span className="text-white/70">Ubicación:</span>
                      <span className="text-white">{formData.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white/60 mb-2">Configuración</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">ID:</span>
                      <span className="text-white">{formData.deviceId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Conexión:</span>
                      <span className="text-white">
                        {connectionTypes.find(t => t.value === formData.connectionType)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Zona Horaria:</span>
                      <span className="text-white">
                        {timezones.find(t => t.value === formData.timezone)?.label.split(' ')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {formData.description && (
                <div className="mt-4 pt-4 border-t border-white/20">
                  <h4 className="text-sm font-medium text-white/60 mb-2">Descripción</h4>
                  <p className="text-sm text-white/80">{formData.description}</p>
                </div>
              )}
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            <p className="text-white/60">
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

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/20">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/telemetry')}
                  className="px-6 py-3 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                >
                  Cancelar
                </button>

                {currentStep < steps.length ? (
                  <button
                    onClick={handleNext}
                    disabled={!isStepValid(currentStep)}
                    className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !isStepValid(currentStep)}
                    className="px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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