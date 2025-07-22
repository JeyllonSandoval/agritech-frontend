import React, { useState } from 'react';
import { DevicePhoneMobileIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface DeviceDataMessageProps {
    deviceName: string;
    deviceData: string;
    timestamp: string;
}

export default function DeviceDataMessage({ deviceName, deviceData, timestamp }: DeviceDataMessageProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4">
            {/* Header */}
            <div className="flex items-center justify-between">
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
                    onClick={toggleExpanded}
                    className="p-1 text-white/60 hover:text-white transition-colors"
                >
                    {isExpanded ? (
                        <ChevronUpIcon className="w-4 h-4" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
                <div className="border-t border-emerald-500/20 pt-3 mt-3">
                    <div className="prose prose-invert max-w-none">
                        <div 
                            className="text-base text-white/90 leading-relaxed"
                            dangerouslySetInnerHTML={{ 
                                __html: deviceData.replace(/\n/g, '<br>') 
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Summary when collapsed */}
            {!isExpanded && (
                <div className="text-xs text-white/60 mt-2">
                    Haz clic para ver los datos completos del dispositivo
                </div>
            )}
        </div>
    );
} 