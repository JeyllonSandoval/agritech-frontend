import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const colorMap = {
  emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30',
  purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30',
  indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30',
  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30',
  gray: 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20',
};
const dropdownBgMap = {
  emerald: 'bg-emerald-900/95',
  blue: 'bg-blue-900/95',
  purple: 'bg-purple-900/95',
  indigo: 'bg-indigo-900/95',
  orange: 'bg-orange-900/95',
  gray: 'bg-neutral-900/95',
};

interface DropdownControlProps {
  label: string;
  options: { label: string; onClick: () => void; disabled?: boolean; icon?: React.ReactNode }[];
  color?: keyof typeof colorMap;
  className?: string;
}

const DropdownControl: React.FC<DropdownControlProps> = ({ label, options, color = 'gray', className = '' }) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (option: { label: string; onClick: () => void; disabled?: boolean }) => {
    if (!option.disabled) {
      option.onClick();
      setOpen(false);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Solo cerrar si el nuevo elemento no está dentro del dropdown
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} tabIndex={0} onBlur={handleBlur}>
      <button
        type="button"
        className={`w-full border rounded-full px-6 py-3 text-lg font-medium flex items-center gap-3 justify-between transition-all duration-200 shadow-sm ${colorMap[color]} focus:outline-none`}
        style={{ minWidth: 200 }}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="flex items-center gap-2">{label}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className={`absolute left-0 mt-2 w-full ${dropdownBgMap[color]} border border-white/20 rounded-xl shadow-lg z-50 overflow-hidden transition-all duration-200 ease-in-out`}>
          {options.map((option, idx) => (
            <button
              key={option.label}
              className={`w-full flex items-center gap-3 px-5 py-3 text-base text-left hover:bg-white/10 transition disabled:opacity-50 ${option.disabled ? 'cursor-not-allowed text-white/50' : 'text-white'}
                ${idx < options.length - 1 ? 'border-b border-white/10' : ''} 
                ${option.label === 'Pausar Actualización' ? 'text-red-400 bg-red-500/60 hover:bg-red-500/80 font-bold' : ''}`}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
              type="button"
            >
              {option.icon && (
                <span className={`w-5 h-5 flex-shrink-0 opacity-80 ${option.label === 'Pausar Actualización' ? 'text-red-100' : ''}`}>{option.icon}</span>
              )}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownControl; 