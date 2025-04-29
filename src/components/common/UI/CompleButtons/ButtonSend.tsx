interface ButtonSendProps {
    isLoading: boolean;
    disabled: boolean;
}

export default function ButtonSend({ isLoading, disabled }: ButtonSendProps) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="flex items-center justify-center p-2
                text-white/70 hover:text-white 
                border border-white/20 rounded-lg hover:border-white/40
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:border-white/20
                transition-all duration-300"
        >
            {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
            ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            )}
        </button>
    );
}
