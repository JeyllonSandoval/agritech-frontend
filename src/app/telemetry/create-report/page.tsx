'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelemetryForReports } from '@/hooks/useTelemetryForReports';
import { useReports } from '@/hooks/useReports';
import { useTranslation } from '@/hooks/useTranslation';
import { useLanguage } from '@/context/languageContext';
import { DeviceInfo, Group } from '@/types/telemetry';
import CreateReportSelector from '@/components/features/telemetry/CreateReportSelector';
import { 
  DocumentChartBarIcon, 
  ChatBubbleLeftRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface CreateReportPageProps {}

const CreateReportPage: React.FC<CreateReportPageProps> = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [reportType, setReportType] = useState<'device' | 'group'>('device');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [includeHistory, setIncludeHistory] = useState(false);
  const [historyRange, setHistoryRange] = useState<'hour' | 'day' | 'week' | 'month' | '3months'>('day');
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf');
  const [createChat, setCreateChat] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Hooks
  const {
    devices,
    groups,
    loading: telemetryLoading,
    error: telemetryError,
    fetchDevices,
    fetchGroups
  } = useTelemetryForReports();

  const {
    loading: reportLoading,
    error: reportError,
    success: reportSuccess,
    generatedReport,
    generateDeviceReport,
    generateGroupReport,
    navigateToChat,
    clearError,
    clearSuccess,
    clearReport
  } = useReports();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchDevices();
    fetchGroups();
  }, [fetchDevices, fetchGroups]);

  // Cargar traducciones
  useEffect(() => {
    // Aquí cargarías las traducciones específicas para esta página
  }, [language]);

  // Obtener el userId del token
  const getUserId = (): string => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.UserID;
      }
      return '';
    } catch {
      return '';
    }
  };

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleGenerateReport = async () => {
    if (!selectedTarget) {
      return;
    }

    const userId = getUserId();
    if (!userId) {
      return;
    }

    const request = {
      userId,
      includeHistory,
      format,
      createChat,
      ...(includeHistory && { historyRange: { type: historyRange } })
    };

    try {
      // Generar el reporte
      if (reportType === 'device') {
        await generateDeviceReport({ ...request, deviceId: selectedTarget });
      } else {
        await generateGroupReport({ ...request, groupId: selectedTarget });
      }
      
      // Mostrar el modal de éxito inmediatamente después de generar el reporte
      setShowSuccess(true);
    } catch (error) {
      // El error ya se maneja en el hook
      console.error('Error generating report:', error);
    }
  };

  const handleNavigateToChat = () => {
    if (generatedReport?.data.chat) {
      navigateToChat(generatedReport.data.chat.chatID);
    }
  };

  const handleBackToTelemetry = () => {
    router.push('/telemetry');
  };

  const handleCreateNewReport = () => {
    setShowSuccess(false);
    clearReport();
    clearSuccess();
    clearError();
    setSelectedTarget('');
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderReportTypeSelector = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        Tipo de Reporte
      </label>
      <div className="flex space-x-4">
        <button
          onClick={() => setReportType('device')}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
            reportType === 'device'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-lg'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium">Dispositivo Individual</span>
          </div>
        </button>
        
        <button
          onClick={() => setReportType('group')}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
            reportType === 'group'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-lg'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-medium">Grupo de Dispositivos</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderTargetSelector = () => {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-white mb-3">
          {reportType === 'device' ? 'Seleccionar Dispositivo' : 'Seleccionar Grupo'}
        </label>
        
        <CreateReportSelector
          devices={devices}
          groups={groups}
          selectedTarget={selectedTarget}
          onTargetChange={setSelectedTarget}
          reportType={reportType}
        />
      </div>
    );
  };

  const renderHistoryOptions = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white">
          Incluir Datos Históricos
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={includeHistory}
            onChange={(e) => setIncludeHistory(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
      
      {includeHistory && (
        <div className="mt-4 text-lg">
          <label className="block text-sm font-medium text-white mb-2">
            Rango de Tiempo
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setHistoryRange('hour')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                historyRange === 'hour'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              1 Hora
            </button>
            <button
              onClick={() => setHistoryRange('day')} 
              className={`px-3 py-1.5 rounded-lg transition-all ${
                historyRange === 'day'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              24 Horas
            </button>
            <button
              onClick={() => setHistoryRange('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                historyRange === 'week'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setHistoryRange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                historyRange === 'month'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              30 Días
            </button>
            <button
              onClick={() => setHistoryRange('3months')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                historyRange === '3months'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              90 Días
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderFormatOptions = () => (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        Formato del Reporte
      </label>
      <div className="flex space-x-4">
        <button
          onClick={() => setFormat('pdf')}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
            format === 'pdf'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-lg'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <DocumentChartBarIcon className="w-5 h-5" />
            <span className="text-sm font-medium">PDF</span>
          </div>
        </button>
        
        <button
          onClick={() => setFormat('json')}
          className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
            format === 'json'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-lg'
              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span className="text-sm font-medium">JSON</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderChatOptions = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <label className="text-sm font-medium text-white">
          Crear Chat Automático
        </label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={createChat}
            onChange={(e) => setCreateChat(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>
      
      {createChat && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-emerald-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-1">
                Chat Automático
              </h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Se creará automáticamente un chat llamado Analisis: Nombre del dispositivo y la fecha de generación, y se enviará el reporte generado para que puedas hacer consultas inteligentes sobre los datos.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSuccessMessage = () => {
    if (!generatedReport) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-white/20 shadow-2xl">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-8 h-8 text-emerald-400" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                ¡Reporte Generado!
              </h3>
              <p className="text-white/70 text-sm mb-6">
                {reportSuccess}
              </p>
              {generatedReport?.data?.format && (
                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-xs text-emerald-400">
                    Formato: <span className="font-medium">{generatedReport.data.format.toUpperCase()}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-3 text-lg">
              {generatedReport.data.chat && (
                <button
                  onClick={handleNavigateToChat}
                  className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Ir al Chat Automático
                </button>
              )}
              
              <button
                onClick={handleCreateNewReport}
                className="w-full bg-white/10 text-white py-3 px-6 rounded-lg font-medium hover:bg-white/20 transition-colors"
              >
                Crear Otro Reporte
              </button>
              
              <button
                onClick={handleBackToTelemetry}
                className="w-full bg-transparent text-white/70 py-3 px-6 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Volver a Telemetría
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  if (showSuccess) {
    return renderSuccessMessage();
  }

  return (
    <div className="min-h-screen">
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleBackToTelemetry}
            className="p-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-semibold text-white">
              Crear Reporte
            </h1>
            <p className="text-lg text-white/60">
              Genera reportes detallados de dispositivos y grupos
            </p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          {/* Error Display */}
          {reportError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-sm">{reportError}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <div>
            {renderReportTypeSelector()}
            {renderTargetSelector()}
            {renderHistoryOptions()}
            {renderFormatOptions()}
            {renderChatOptions()}

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={reportLoading || !selectedTarget}
              className="w-full text-lg bg-emerald-500 text-white py-4 px-6 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {reportLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando Reporte...
                </>
              ) : (
                <>
                  <DocumentChartBarIcon className="w-5 h-5" />
                  Generar Reporte
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage; 