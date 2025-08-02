import React from 'react';

const colorMap = {
  emerald: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30',
  blue: 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30',
  purple: 'bg-purple-500/20 border-purple-500/30 text-purple-400 hover:bg-purple-500/30',
  indigo: 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30',
  orange: 'bg-orange-500/20 border-orange-500/30 text-orange-400 hover:bg-orange-500/30',
  gray: 'bg-white/10 border-white/20 text-white/80 hover:bg-white/20',
};

interface ControlButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: keyof typeof colorMap;
  className?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, disabled, children, icon, color = 'gray', className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full border rounded-xl px-4 py-3 text-base font-semibold flex items-center gap-3 justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${colorMap[color]} ${className}`}
    style={{ minWidth: 180 }}
  >
    {icon && <span className="w-5 h-5 flex-shrink-0">{icon}</span>}
    <span>{children}</span>
  </button>
);

export default ControlButton; 