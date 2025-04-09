'use client';

import { useModal } from '@/modules/common/context/modalContext';

export default function ButtonEditProfile() {
    const { openModal } = useModal();

    return (
        <button
            onClick={() => openModal('edit-profile', 'edit', '', undefined, undefined, undefined, undefined)}
            className="px-4 py-2 rounded-xl text-sm
                border border-emerald-400/20
                bg-gradient-to-r from-emerald-700/30 to-emerald-600/30
                hover:from-emerald-600/40 hover:to-emerald-500/40
                active:from-emerald-800/30 active:to-emerald-700/30
                backdrop-blur-sm
                text-emerald-100
                transition-all duration-300
                flex items-center gap-2"
        >
            <svg className="w-5 h-5 transition-transform duration-300
                hover:scale-105" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
        </button>
    );
}
