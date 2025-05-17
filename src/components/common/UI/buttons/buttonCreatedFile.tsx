import { useModal } from '@/context/modalContext';

export default function ButtonCreated({ type }: { type: 'createdFile' | 'createdChat' }) {
    const { openModal } = useModal();

    return (
        <button 
            onClick={() => openModal(type, 'create', '')}
            className="text-white/90 px-4 py-2 rounded-xl text-sm lg:text-xl
                bg-gradient-to-br from-emerald-400/40 to-emerald-600/40
                border border-emerald-400/30
                shadow-lg shadow-emerald-400/20
                backdrop-blur-md
                hover:from-emerald-400/60 hover:to-emerald-600/60
                hover:border-emerald-400/50 hover:text-white
                hover:shadow-emerald-400/30
                active:scale-95
                transition-all duration-300
                flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M12 4v16m8-8H4"/>
            </svg>
            Create
        </button>
    );
}
