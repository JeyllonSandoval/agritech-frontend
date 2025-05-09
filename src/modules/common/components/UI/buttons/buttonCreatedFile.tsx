import { useModal } from '@/modules/common/context/modalContext';

export default function ButtonCreated({ type }: { type: 'createdFile' | 'createdChat' }) {
    const { openModal } = useModal();

    return (
        <button 
            onClick={() => openModal(type, 'create', '')}
            className="text-white/70 px-6 py-3 rounded-xl text-sm
                border-2 border-green-200/20
                shadow-lg shadow-emerald-300/30
                bg-emerald-400/60 backdrop-blur-md
                hover:bg-emerald-400/90 hover:text-black
                hover:shadow-none hover:backdrop-blur-none
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
