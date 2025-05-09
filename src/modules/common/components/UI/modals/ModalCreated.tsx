'use client';
import { useModal } from '@/modules/common/context/modalContext';
import SettingPanel from '@/modules/common/components/Panels/SettingPanel';
import EditProfileForm from '../../forms/editProfileForm';

type ModalType = 'settings' | 'edit-profile';

interface ModalCreatedProps {
    type: ModalType;
    title?: string;
    content?: string;
}

export default function ModalCreated({ type, title, content }: ModalCreatedProps) {
    const { isOpen, closeModal } = useModal();

    if (!isOpen) return null;

    const getTitle = () => {
        switch (type) {
            case 'settings':
                return 'Settings';
            case 'edit-profile':
                return 'Edit Profile';
            default:
                return title || '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
            
            <div className="relative w-full max-w-2xl mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-white">{getTitle()}</h2>
                        <button
                            onClick={closeModal}
                            className="p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="text-white/70">
                        {type === 'settings' && <SettingPanel />}
                        {type === 'edit-profile' && <EditProfileForm />}
                    </div>
                </div>
            </div>
        </div>
    );
} 