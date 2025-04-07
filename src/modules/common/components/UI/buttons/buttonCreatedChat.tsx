'use client';

import { useModal } from '@/modules/common/context/modalContext';

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
            className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500
                hover:from-emerald-500 hover:to-emerald-400 text-white rounded-lg
                shadow-lg shadow-emerald-500/20 transition-all duration-300
                flex items-center justify-center gap-2 text-sm font-medium"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Chat
        </button>
    );
}
