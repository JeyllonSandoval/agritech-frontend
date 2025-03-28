import { useState } from 'react';

interface FileAnalysisResultProps {
    question: string;
    description: string;
    answer: string;
    isLoading?: boolean;
}

export default function FileAnalysisResult({ 
    question, 
    description, 
    answer, 
    isLoading 
}: FileAnalysisResultProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-gray-800/50 rounded-xl p-4 mb-4 border border-gray-700/30 hover:border-gray-600/50 transition-colors duration-200">
            <div 
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-white/90 group-hover:text-white transition-colors duration-200">
                        {question}
                    </h3>
                    <p className="text-sm text-white/50 group-hover:text-white/70 transition-colors duration-200">
                        {description}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-white/40">
                        {isExpanded ? 'Ocultar' : 'Ver más'}
                    </span>
                    <svg 
                        className={`w-5 h-5 text-white/50 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <div 
                className={`grid transition-all duration-200 ease-in-out ${
                    isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-gray-700/30' : 'grid-rows-[0fr] opacity-0'
                }`}
            >
                <div className="overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center space-x-2 py-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                        </div>
                    ) : (
                        <p className="text-white/80 whitespace-pre-wrap text-sm leading-relaxed">
                            {answer}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
} 