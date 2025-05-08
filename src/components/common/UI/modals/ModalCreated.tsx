'use client';
import { useModal } from '@/context/modalContext';
import SettingPanel from '@/components/features/Panels/SettingPanel';
import EditProfileForm from '@/components/features/forms/editProfileForm';

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
        <div className="fixed inset-0 flex items-center justify-center z-[9999]">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
            
            <div className="relative w-[95vw] sm:w-full max-w-2xl mx-2 sm:mx-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
                <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 backdrop-blur-sm py-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-white">{getTitle()}</h2>
                        <button
                            onClick={closeModal}
                            className="p-1.5 sm:p-2 rounded-xl hover:bg-white/10 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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