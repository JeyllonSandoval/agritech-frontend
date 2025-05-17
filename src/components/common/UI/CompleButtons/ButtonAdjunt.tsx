interface ButtonAdjuntProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function ButtonAdjunt({ onClick, disabled }: ButtonAdjuntProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center p-2
                text-white/70 transition-colors duration-300
                border border-white/20 rounded-lg
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:border-white/40'}
            `}
            type="button"
        >
            <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                />
            </svg>
        </button>
    );
}

