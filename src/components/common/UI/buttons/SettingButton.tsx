import React from 'react';

interface SettingButtonProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    variant?: 'danger' | 'default' | 'inactive';
}

export default function SettingButton({ icon, title, description, onClick, variant = 'default' }: SettingButtonProps) {
    const baseClasses = "w-full p-4 rounded-xl transition-all duration-300 flex items-start gap-4";
    const variantClasses = variant === 'danger' 
        ? "bg-gradient-to-br from-red-500/10 to-red-600/20 hover:from-red-500/20 hover:to-red-600/30 border border-red-500/30 shadow-lg shadow-red-500/5" 
        : variant === 'inactive'
        ? "bg-gradient-to-br from-gray-500/10 to-gray-600/20 hover:from-gray-500/20 hover:to-gray-600/30 border border-gray-500/30 shadow-lg shadow-gray-500/5"
        : "bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 hover:from-emerald-500/20 hover:to-emerald-600/30 border border-emerald-500/30 shadow-lg shadow-emerald-500/5";

    return (
        <button 
            onClick={onClick}
            className={`${baseClasses} ${variantClasses} group`}
        >
            <div className="text-2xl p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors duration-300">
                {icon}
            </div>
            <div className="text-left flex-1">
                <h3 className={`text-lg font-semibold ${variant === 'inactive' ? 'text-white/50 group-hover:text-white/70' : 'text-white'} transition-colors duration-300`}>{title}</h3>
                <p className={`text-sm ${variant === 'inactive' ? 'text-white/40 group-hover:text-white/60' : 'text-white/70 group-hover:text-white/90'} transition-colors duration-300`}>{description}</p>
            </div>
        </button>
    );
} 