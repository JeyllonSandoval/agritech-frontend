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
import { DocumentChartBarIcon, CalendarIcon, ChartBarIcon, ClockIcon, XMarkIcon, DocumentArrowDownIcon, UserGroupIcon, DevicePhoneMobileIcon, FolderIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface TelemetryReportsProps {
  devices: DeviceInfo[];
  groups?: Group[];
  selectedDevice?: DeviceInfo | null;
  selectedGroup?: Group | null;
  onClose?: () => void;
}

// ============================================================================
// REPORT TYPE SELECTOR
// ============================================================================

const ReportTypeSelector: React.FC<{
  reportType: 'device' | 'group';
  onTypeChange: (type: 'device' | 'group') => void;
}> = ({ reportType, onTypeChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        {t('reports.type')}
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onTypeChange('device')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            reportType === 'device'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <DevicePhoneMobileIcon className="w-5 h-5" />
          {t('reports.device')}
        </button>
        <button
          onClick={() => onTypeChange('group')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            reportType === 'group'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <UserGroupIcon className="w-5 h-5" />
          {t('reports.group')}
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// TARGET SELECTOR
// ============================================================================

const TargetSelector: React.FC<{
  reportType: 'device' | 'group';
  devices: DeviceInfo[];
  groups: Group[];
  selectedTarget: string;
  onTargetChange: (target: string) => void;
}> = ({ reportType, devices, groups, selectedTarget, onTargetChange }) => {
  const { t } = useTranslation();

  const options = reportType === 'device' ? devices : groups;

  // Helper function to get ID and name for both DeviceInfo and Group
  const getOptionId = (option: DeviceInfo | Group): string => {
    if ('DeviceID' in option) return option.DeviceID;
    if ('DeviceGroupID' in option) return option.DeviceGroupID;
    return '';
  };

  const getOptionName = (option: DeviceInfo | Group): string => {
    if ('DeviceName' in option) return option.DeviceName;
    if ('GroupName' in option) return option.GroupName;
    return '';
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        {reportType === 'device' ? t('reports.selectDevice') : t('reports.selectGroup')}
      </label>
      <select
        value={selectedTarget}
        onChange={(e) => onTargetChange(e.target.value)}
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        <option value="">{t('reports.selectOption')}</option>
        {options.map((option) => (
          <option key={getOptionId(option)} value={getOptionId(option)}>
            {getOptionName(option)}
          </option>
        ))}
      </select>
    </div>
  );
};

// ============================================================================
// HISTORY OPTIONS
// ============================================================================

const HistoryOptions: React.FC<{
  includeHistory: boolean;
  onIncludeHistoryChange: (include: boolean) => void;
  historyRange: 'hour' | 'day' | 'week' | 'month' | '3months';
  onHistoryRangeChange: (range: 'hour' | 'day' | 'week' | 'month' | '3months') => void;
}> = ({ includeHistory, onIncludeHistoryChange, historyRange, onHistoryRangeChange }) => {
  const { t } = useTranslation();

  const rangeOptions = [
    { value: 'hour', label: t('reports.hour'), icon: ClockIcon },
    { value: 'day', label: t('reports.day'), icon: CalendarIcon },
    { value: 'week', label: t('reports.week'), icon: ChartBarIcon },
    { value: 'month', label: t('reports.month'), icon: DocumentChartBarIcon },
    { value: '3months', label: t('reports.3months'), icon: FolderIcon },
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <input
          type="checkbox"
          id="includeHistory"
          checked={includeHistory}
          onChange={(e) => onIncludeHistoryChange(e.target.checked)}
          className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2"
        />
        <label htmlFor="includeHistory" className="text-sm font-medium text-white">
          {t('reports.includeHistory')}
        </label>
      </div>

      {includeHistory && (
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            {t('reports.historyRange')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {rangeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => onHistoryRangeChange(option.value as any)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
                    historyRange === option.value
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FORMAT OPTIONS
// ============================================================================

const FormatOptions: React.FC<{
  format: 'pdf' | 'json';
  onFormatChange: (format: 'pdf' | 'json') => void;
}> = ({ format, onFormatChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white mb-3">
        {t('reports.format')}
      </label>
      <div className="flex gap-3">
        <button
          onClick={() => onFormatChange('pdf')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            format === 'pdf'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <DocumentChartBarIcon className="w-5 h-5" />
          PDF
        </button>
        <button
          onClick={() => onFormatChange('json')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            format === 'json'
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <DocumentArrowDownIcon className="w-5 h-5" />
          JSON
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// CHAT OPTIONS
// ============================================================================

const ChatOptions: React.FC<{
  createChat: boolean;
  onCreateChatChange: (create: boolean) => void;
}> = ({ createChat, onCreateChatChange }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="createChat"
          checked={createChat}
          onChange={(e) => onCreateChatChange(e.target.checked)}
          className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-500 focus:ring-2"
        />
        <label htmlFor="createChat" className="text-sm font-medium text-white">
          {t('reports.createChat')}
        </label>
      </div>
      <p className="text-xs text-white/60 mt-2">
        {t('reports.createChatDescription')}
      </p>
    </div>
  );
};

// ============================================================================
// SUCCESS MESSAGE
// ============================================================================

const SuccessMessage: React.FC<{
  success: string;
  generatedReport: any;
  onNavigateToChat: (chatID: string) => void;
  onViewReport: (fileURL: string) => void;
  onDownloadReport: (fileURL: string, fileName: string) => void;
}> = ({ success, generatedReport, onNavigateToChat, onViewReport, onDownloadReport }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-emerald-400 font-medium mb-2">{t('reports.success')}</h3>
          <p className="text-white/90 text-sm mb-4">{success}</p>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onViewReport(generatedReport.data.fileURL)}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
            >
              <DocumentChartBarIcon className="w-4 h-4" />
              {t('reports.viewReport')}
            </button>
            
            <button
              onClick={() => onDownloadReport(generatedReport.data.fileURL, generatedReport.data.fileName)}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              {t('reports.downloadReport')}
            </button>
            
            {generatedReport.data.chat && (
              <button
                onClick={() => onNavigateToChat(generatedReport.data.chat.chatID)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" />
                {t('reports.openChat')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [createChat, setCreateChat] = useState(true);
  
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
    clearReport,
    navigateToChat
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
      createChat, // Nueva funcionalidad
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

  const handleClose = () => {
    clearError();
    clearSuccess();
    clearReport();
    onClose?.();
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center text-lg z-50">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto scrollbar">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <DocumentChartBarIcon className="w-8 h-8 text-emerald-400" />
            <h2 className="text-xl md:text-2xl font-semibold text-white">{t('reports.title')}</h2>
          </div>
          
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-2"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {success && generatedReport && (
          <SuccessMessage
            success={success}
            generatedReport={generatedReport}
            onNavigateToChat={navigateToChat}
            onViewReport={viewReport}
            onDownloadReport={downloadReport}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-red-400 font-medium mb-2">{t('reports.error')}</h3>
                <p className="text-white/90 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleGenerateReport(); }}>
          <ReportTypeSelector
            reportType={reportType}
            onTypeChange={setReportType}
          />

          <TargetSelector
            reportType={reportType}
            devices={devices}
            groups={groups}
            selectedTarget={selectedTarget}
            onTargetChange={setSelectedTarget}
          />

          <HistoryOptions
            includeHistory={includeHistory}
            onIncludeHistoryChange={setIncludeHistory}
            historyRange={historyRange}
            onHistoryRangeChange={setHistoryRange}
          />

          <FormatOptions
            format={format}
            onFormatChange={setFormat}
          />

          <ChatOptions
            createChat={createChat}
            onCreateChatChange={setCreateChat}
          />

          {/* Generate Button */}
          <button
            type="submit"
            disabled={loading || !selectedTarget}
            className="w-full bg-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('reports.generating')}
              </>
            ) : (
              <>
                <DocumentChartBarIcon className="w-5 h-5" />
                {t('reports.generate')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TelemetryReports; 