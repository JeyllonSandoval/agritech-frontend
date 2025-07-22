import React, { useState } from 'react';
import { DevicePhoneMobileIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface DeviceDataMessageProps {
    deviceName: string;
    deviceData: string;
    timestamp: string;
}

export default function DeviceDataMessage({ deviceName, deviceData, timestamp }: DeviceDataMessageProps) {
    const [isExpanded, setIsExpanded] = useState(false); // Plegado por defecto

    // Logging para debugging
    console.log('🔍 [DeviceDataMessage] Renderizando componente:', {
        deviceName,
        deviceDataLength: deviceData.length,
        deviceDataPreview: deviceData.substring(0, 100) + '...',
        timestamp,
        isExpanded
    });

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className={`bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 hover:bg-emerald-500/15 hover:border-emerald-500/30 transition-all duration-300 ease-in-out ${
            isExpanded ? 'shadow-lg shadow-emerald-500/10' : ''
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between cursor-pointer" onClick={toggleExpanded}>
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20">
                        <DevicePhoneMobileIcon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-white">
                            Datos del Dispositivo: {deviceName}
                        </h4>
                        <p className="text-sm text-white/50">
                            {new Date(timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleExpanded();
                    }}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                >
                    <ChevronDownIcon 
                        className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                            isExpanded ? 'rotate-180' : 'rotate-0'
                        }`} 
                    />
                </button>
            </div>

            {/* Collapsible Content */}
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded 
                        ? 'max-h-[1000px] opacity-100 border-t border-emerald-500/20 pt-3 mt-3' 
                        : 'max-h-0 opacity-0'
                }`}
            >
                <div className="prose prose-invert max-w-none">
                    <div 
                        className="text-base text-white/90 leading-relaxed"
                        dangerouslySetInnerHTML={{ 
                            __html: deviceData.replace(/\n/g, '<br>') 
                        }}
                    />
                </div>
            </div>

            {/* Summary when collapsed */}
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    !isExpanded 
                        ? 'max-h-32 opacity-100 mt-2' 
                        : 'max-h-0 opacity-0'
                }`}
            >
                <div className="text-xs text-white/60">
                    <div className="mb-2">Haz clic para ver los datos completos del dispositivo</div>
                    <div className="text-white/70 text-xs max-h-16 overflow-hidden">
                        {(() => {
                            const lines = deviceData.split('\n').filter(line => line.trim());
                            const previewLines = lines.slice(0, 2);
                            return (
                                <>
                                    {previewLines.map((line, index) => (
                                        <div key={index} className="truncate">
                                            {line}
                                        </div>
                                    ))}
                                    {lines.length > 2 && (
                                        <div className="text-emerald-400 text-xs mt-1">
                                            +{lines.length - 2} líneas más...
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
} 