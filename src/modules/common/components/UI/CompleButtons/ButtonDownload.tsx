export default function ButtonDownload() {
    return (
        <button 
            className="p-2 rounded-lg hover:bg-emerald-400/20 
                text-white/90 hover:text-emerald-400
                transition-all duration-300"
        >
            <svg 
                className="w-4 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
            >
                <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
            </svg>
        </button>
    )
}
