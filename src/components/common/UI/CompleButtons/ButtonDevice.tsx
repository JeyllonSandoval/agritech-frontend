import { DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface ButtonDeviceProps {
    onClick: () => void;
    disabled?: boolean;
    isActive?: boolean;
}

export default function ButtonDevice({ onClick, disabled, isActive = false }: ButtonDeviceProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center p-2
                text-white/70 transition-colors duration-300
                border rounded-lg
                ${isActive 
                    ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' 
                    : 'border-white/20 hover:text-white hover:border-white/40'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            type="button"
            title="Seleccionar dispositivo"
        >
            <DevicePhoneMobileIcon className="w-5 h-5" />
        </button>
    );
} 