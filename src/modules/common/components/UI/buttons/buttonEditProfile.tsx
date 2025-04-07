'use client';

import { useModal } from '@/modules/common/context/modalContext';

export default function ButtonEditProfile() {
    const { openModal } = useModal();

    return (
        <button
            onClick={() => openModal('edit-profile', 'edit', '', undefined, undefined, undefined, undefined)}
            className="px-4 py-2 rounded-xl text-sm
                border-2 border-emerald-400/20
                shadow-lg shadow-emerald-300/30
                bg-emerald-400/60 backdrop-blur-md
                hover:bg-emerald-400/90 hover:text-black
                hover:shadow-none hover:backdrop-blur-none
                transition-all duration-300
                flex items-center gap-2"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
        </button>
    );
}
