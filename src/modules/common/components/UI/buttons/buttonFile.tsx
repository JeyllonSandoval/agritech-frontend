interface ButtonFileProps {
    onClick: () => void;
}

export default function ButtonFile({ onClick }: ButtonFileProps) {
    return (
        <button 
            onClick={onClick}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500
                hover:from-blue-500 hover:to-blue-400 text-white rounded-lg
                shadow-lg shadow-blue-500/20 transition-all duration-300
                flex items-center justify-center gap-2 text-sm font-medium"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            File PDF
        </button>
    );
}