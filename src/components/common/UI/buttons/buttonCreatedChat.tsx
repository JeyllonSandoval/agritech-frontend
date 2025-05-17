'use client';

import { useModal } from '@/context/modalContext';

interface ButtonCreatedChatProps {
    onClick?: () => void;
}

export default function ButtonCreatedChat({ onClick }: ButtonCreatedChatProps) {
    const { openModal } = useModal();

    const handleClick = () => {
        openModal('createdChat', 'create', '');
        onClick?.();
    };

    return (
        <button 
            onClick={handleClick}
            className="text-white/90 px-6 py-3 rounded-xl text-sm
                bg-gradient-to-br from-emerald-400/40 to-emerald-600/40
                border border-emerald-400/30
                shadow-lg shadow-emerald-400/20
                backdrop-blur-md
                hover:from-emerald-400/60 hover:to-emerald-600/60
                hover:border-emerald-400/50 hover:text-white
                hover:shadow-emerald-400/30
                active:scale-95
                transition-all duration-300
                flex items-center gap-2 w-full justify-center"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Chat
        </button>
    );
}
