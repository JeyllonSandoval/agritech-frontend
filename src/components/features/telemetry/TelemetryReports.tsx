// ============================================================================
// TELEMETRY REPORTS
// Component for generating and viewing telemetry reports
// ============================================================================

import React, { useState } from 'react';
import { DeviceInfo, Group } from '../../../types/telemetry';
import { ReportRequest } from '../../../services/reportService';
import { useReports } from '../../../hooks/useReports';
import { useTranslation } from '../../../hooks/useTranslation';
import { useModal } from '../../../context/modalContext';
import { useRouter } from 'next/navigation';
import { DocumentChartBarIcon, CalendarIcon, ChartBarIcon, ClockIcon, XMarkIcon, DocumentArrowDownIcon, UserGroupIcon, DevicePhoneMobileIcon, FolderIcon } from '@heroicons/react/24/outline';

interface TelemetryReportsProps {
  devices: DeviceInfo[];
  groups?: Group[];
  selectedDevice?: DeviceInfo | null;
  selectedGroup?: Group | null;
  onClose?: () => void;
}

interface ReportOption {
  id: string;
  name: string;
  type: 'device' | 'group';
  description: string;
}

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

/**
 * Custom Switch Component
 */
const Switch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}> = ({ checked, onChange, label, className = "" }) => (
  <div className={`flex items-center gap-3 p-3  ${className}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-emerald-500' : 'bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
    {label && (
      <span className="text-white text-lg font-medium">{label}</span>
    )}
  </div>
);

/**
 * Header component for the reports modal
 */
const ReportHeader: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <DocumentChartBarIcon className="w-6 h-6 text-emerald-400" />
      <h2 className="text-xl font-semibold text-white">
        Generar Reportes
      </h2>
    </div>
    {onClose && (
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white transition-colors"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    )}
  </div>
);

/**
 * Alert component for displaying success and error messages
 */
const AlertMessage: React.FC<{
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
}> = ({ type, message, onClose }) => {
  const styles = {
    success: 'bg-green-500/20 border-green-500/40 text-green-400',
    error: 'bg-red-500/20 border-red-500/40 text-red-400'
  };

  const hoverStyles = {
    success: 'text-green-400 hover:text-green-300',
    error: 'text-red-400 hover:text-red-300'
  };

  return (
    <div className={`mb-4 p-3 border rounded-lg ${styles[type]}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className={hoverStyles[type]}>
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/**
 * Report type selection component
 */
const ReportTypeSelector: React.FC<{
  reportType: 'device' | 'group';
  onTypeChange: (type: 'device' | 'group') => void;
}> = ({ reportType, onTypeChange }) => (
  <div>
    <h3 className="text-lg font-medium text-white mb-3">
      Tipo de Reporte
    </h3>
    <div className="flex gap-2">
      <button
        onClick={() => onTypeChange('device')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          reportType === 'device'
            ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
            : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
        }`}
      >
        <DevicePhoneMobileIcon className="w-5 h-5" />
        Dispositivo Individual
      </button>
      <button
        onClick={() => onTypeChange('group')}
        className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
          reportType === 'group'
            ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
            : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
        }`}
      >
        <UserGroupIcon className="w-5 h-5" />
        Grupo de Dispositivos
      </button>
    </div>
  </div>
);

/**
 * Target selection component (devices or groups)
 */
const TargetSelector: React.FC<{
  reportType: 'device' | 'group';
  devices: DeviceInfo[];
  groups: Group[];
  selectedTarget: string;
  onTargetSelect: (targetId: string) => void;
}> = ({ reportType, devices, groups, selectedTarget, onTargetSelect }) => (
  <div>
    <h3 className="text-lg font-medium text-white mb-3">
      {reportType === 'device' ? 'Seleccionar Dispositivo' : 'Seleccionar Grupo'}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
      {reportType === 'device' ? (
        devices.map(device => (
          <button
            key={device.DeviceID}
            onClick={() => onTargetSelect(device.DeviceID)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedTarget === device.DeviceID
                ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            <div>
              <h4 className="font-medium text-sm">{device.DeviceName}</h4>
              <p className="text-xs opacity-70">{device.DeviceType}</p>
            </div>
          </button>
        ))
      ) : (
        groups.map(group => (
          <button
            key={group.DeviceGroupID}
            onClick={() => onTargetSelect(group.DeviceGroupID)}
            className={`p-3 rounded-lg border text-left transition-all ${
              selectedTarget === group.DeviceGroupID
                ? 'border-emerald-400 bg-emerald-400/10 text-emerald-400'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
            }`}
          >
            <div>
              <h4 className="font-medium text-sm">{group.GroupName}</h4>
              <p className="text-xs opacity-70">{group.Description}</p>
            </div>
          </button>
        ))
      )}
    </div>
  </div>
);

/**
 * History options component with improved layout
 */
const HistoryOptions: React.FC<{
  includeHistory: boolean;
  historyRange: 'hour' | 'day' | 'week' | 'month' | '3months';
  onIncludeHistoryChange: (include: boolean) => void;
  onHistoryRangeChange: (range: 'hour' | 'day' | 'week' | 'month' | '3months') => void;
}> = ({ includeHistory, historyRange, onIncludeHistoryChange, onHistoryRangeChange }) => (
  <div>
    <h3 className="text-lg font-medium text-white mb-3">
      Opciones de Datos Históricos
    </h3>
    <div className="flex items-center gap-4">
      <Switch
        checked={includeHistory}
        onChange={onIncludeHistoryChange}
        label="Incluir datos históricos"
        className="text-lg"
      />
      
      {includeHistory && (
        <div className="flex items-center gap-2 text-lg">
          <label className="font-medium text-white">
            Rango:
          </label>
          <select
            value={historyRange}
            onChange={(e) => onHistoryRangeChange(e.target.value as any)}
            className="px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:border-emerald-400 focus:outline-none"
          >
            <option value="hour" className="bg-black text-emerald-600">1 Hora</option>
            <option value="day" className="bg-black text-emerald-600">1 Día</option>
            <option value="week" className="bg-black text-emerald-600">1 Semana</option>
            <option value="month" className="bg-black text-emerald-600">1 Mes</option>
            <option value="3months" className="bg-black text-emerald-600">3 Meses</option>
          </select>
        </div>
      )}
    </div>
  </div>
);

/**
 * Format selection component
 */
const FormatSelector: React.FC<{
  format: 'pdf' | 'json';
  onFormatChange: (format: 'pdf' | 'json') => void;
}> = ({ format, onFormatChange }) => (
  <div>
    <label className="block text-sm font-medium text-white mb-2">
      Formato del Reporte
    </label>
    <div className="flex gap-2">
      <button
        onClick={() => onFormatChange('pdf')}
        className={`px-3 py-2 rounded-lg transition-all ${
          format === 'pdf'
            ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/40'
            : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10'
        }`}
      >
        PDF
      </button>
    </div>
  </div>
);

/**
 * Generated report display component with modal integration
 */
const GeneratedReportDisplay: React.FC<{
  report: any;
  onView: () => void;
  onDownload: () => void;
  onNavigateToFiles: () => void;
}> = ({ report, onView, onDownload, onNavigateToFiles }) => (
  <div className="mt-6 p-4 bg-white/5 border border-white/20 rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-white">
        Reporte Generado
      </h3>
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all flex items-center gap-2 shadow-sm shadow-emerald-500/20"
        >
          <DocumentChartBarIcon className="w-4 h-4" />
          Ver
        </button>
        <button
          onClick={onDownload}
          className="px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 rounded-lg transition-all flex items-center gap-2"
        >
          <DocumentArrowDownIcon className="w-4 h-4" />
          Descargar
        </button>
        <button
          onClick={onNavigateToFiles}
          className="px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/40 rounded-lg transition-all flex items-center gap-2"
        >
          <FolderIcon className="w-4 h-4" />
          Ver en Archivos
        </button>
      </div>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="text-white/70">Archivo:</p>
        <p className="text-white font-medium">{report.data.fileName}</p>
      </div>
      <div>
        <p className="text-white/70">Formato:</p>
        <p className="text-white font-medium">{report.data.format.toUpperCase()}</p>
      </div>
      {report.data.report.hasHistoricalData !== undefined && (
        <div>
          <p className="text-white/70">Datos históricos:</p>
          <p className="text-white font-medium">
            {report.data.report.hasHistoricalData ? 'Incluidos' : 'No disponibles'}
          </p>
        </div>
      )}
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const TelemetryReports: React.FC<TelemetryReportsProps> = ({
  devices,
  groups = [],
  selectedDevice,
  selectedGroup,
  onClose
}) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const router = useRouter();
  const [reportType, setReportType] = useState<'device' | 'group'>('device');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [includeHistory, setIncludeHistory] = useState(false);
  const [historyRange, setHistoryRange] = useState<'hour' | 'day' | 'week' | 'month' | '3months'>('day');
  const [format, setFormat] = useState<'pdf' | 'json'>('pdf');
  
  const {
    loading,
    error,
    success,
    generatedReport,
    generateDeviceReport,
    generateGroupReport,
    downloadReport,
    viewReport,
    clearError,
    clearSuccess,
    clearReport
  } = useReports();

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

    const request: ReportRequest = {
      userId,
      includeHistory,
      format,
      ...(includeHistory && { historyRange: { type: historyRange } })
    };

    if (reportType === 'device') {
      request.deviceId = selectedTarget;
      await generateDeviceReport(request);
    } else {
      request.groupId = selectedTarget;
      await generateGroupReport(request);
    }
  };

  const handleDownloadReport = async () => {
    if (!generatedReport) return;
    await downloadReport(generatedReport.data.fileURL, generatedReport.data.fileName);
  };

  const handleViewReport = () => {
    if (!generatedReport) return;
    // Open the report in a modal using the existing modal system
    openModal(
      'createdFile', 
      'preview', 
      generatedReport.data.fileName, 
      undefined, 
      undefined, 
      undefined, 
      generatedReport.data.fileURL
    );
  };

  const handleNavigateToFiles = () => {
    // Navigate to the files section
    router.push('/playground/files');
  };

  const handleReportTypeChange = (type: 'device' | 'group') => {
    setReportType(type);
    setSelectedTarget('');
  };

  const handleTargetSelect = (targetId: string) => {
    setSelectedTarget(targetId);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg mt-10 text-lg">
      {/* Header */}
      <ReportHeader onClose={onClose} />

      {/* Alert Messages */}
      {error && (
        <AlertMessage
          type="error"
          message={error}
          onClose={clearError}
        />
      )}

      {success && (
        <AlertMessage
          type="success"
          message={success}
          onClose={clearSuccess}
        />
      )}

      {/* Configuration */}
      <div className="space-y-6">
        {/* Report Type Selection */}
        <ReportTypeSelector
          reportType={reportType}
          onTypeChange={handleReportTypeChange}
        />

        {/* Target Selection */}
        <TargetSelector
          reportType={reportType}
          devices={devices}
          groups={groups}
          selectedTarget={selectedTarget}
          onTargetSelect={handleTargetSelect}
        />

        {/* History Options */}
        <HistoryOptions
          includeHistory={includeHistory}
          historyRange={historyRange}
          onIncludeHistoryChange={setIncludeHistory}
          onHistoryRangeChange={setHistoryRange}
        />

        {/* Format Selection */}
        <FormatSelector
          format={format}
          onFormatChange={setFormat}
        />

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={loading || !selectedTarget}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all"
        >
          <ChartBarIcon className="w-5 h-5" />
          {loading ? 'Generando...' : 'Generar Reporte'}
        </button>
      </div>

      {/* Generated Report */}
      {generatedReport && (
        <GeneratedReportDisplay
          report={generatedReport}
          onView={handleViewReport}
          onDownload={handleDownloadReport}
          onNavigateToFiles={handleNavigateToFiles}
        />
      )}
    </div>
  );
};

export default TelemetryReports; 