'use client';

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface HelpButtonProps {
    onClick: () => void;
    title?: string;
    className?: string;
}

export default function HelpButton({ onClick, title = "Ayuda", className = "" }: HelpButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`p-2 md:p-3 rounded-full bg-white/10 text-white/70
                hover:bg-white/20 hover:text-emerald-400
                transition-all duration-300 group ${className}`}
            title={title}
        >
            <QuestionMarkCircleIcon className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform duration-300" />
        </button>
    );
} 