export default function ButtonSelectFile({ setIsModalOpen }: { setIsModalOpen: (isOpen: boolean) => void }) {
    return (
        <div className="flex justify-center">
        <button
            onClick={() => setIsModalOpen(true)}
            className="group relative px-8 py-4
                bg-gradient-to-r from-emerald-600/80 to-emerald-500/80
                hover:from-emerald-500/80 hover:to-emerald-400/80
                active:from-emerald-700/80 active:to-emerald-600/80
                backdrop-blur-sm rounded-xl
                border border-white/10
                shadow-lg shadow-emerald-500/20
                transition-all duration-300
                text-white"
        >
            <div className="flex items-center gap-3">
                <svg 
                    className="w-6 h-6 transition-transform duration-300
                        group-hover:scale-110 group-hover:rotate-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                </svg>
                <span className="text-lg font-medium">
                    Select the file you want to analyze
                </span>
            </div>
            
            {/* Efecto de hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 
                blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            </div>
        </button>
    </div>
    )
}
