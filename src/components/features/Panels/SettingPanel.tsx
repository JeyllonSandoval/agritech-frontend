'use client';

import { useState } from 'react';
import { useModal } from '@/context/modalContext';

export default function SettingPanel() {
    const { closeModal } = useModal();
    const [settings, setSettings] = useState({
        theme: 'dark',
        notifications: true,
        language: 'en'
    });

    const handleSave = () => {
        // Aquí iría la lógica para guardar las configuraciones
        console.log('Settings saved:', settings);
        closeModal();
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6">
            <div className="bg-emerald-600/20 border border-emerald-500/70 rounded-xl p-8 text-center">
                <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-emerald-400 mb-2">
                    Settings Coming Soon
                </h2>
                <p className="text-white/70 text-lg">
                    We're working on bringing you more customization options. Stay tuned for updates!
                </p>
            </div>
        </div>
    );
} 