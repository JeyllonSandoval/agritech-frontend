import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useAuth } from '@/hooks/useAuth';
import { useModal } from '@/context/modalContext';
import SettingPanel from '@/components/features/Panels/SettingPanel';

interface DropNavbarProps {
    onLogout: () => void;
    onClose: () => void;
}

interface TokenPayload {
    UserID: string;
    Email: string;
    FirstName?: string;
}

export default function DropNavbar({ onLogout, onClose }: DropNavbarProps) {
    const [userInfo, setUserInfo] = useState<{ Email: string; FirstName?: string }>({ Email: '' });
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { openModal } = useModal();

    const updateUserInfo = () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode<TokenPayload>(token);
                setUserInfo({
                    Email: decoded.Email,
                    FirstName: decoded.FirstName
                });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    };

    useEffect(() => {
        updateUserInfo();

        // Listen for both profile and token updates
        window.addEventListener('profile-updated', updateUserInfo);
        window.addEventListener('token-updated', updateUserInfo);

        return () => {
            window.removeEventListener('profile-updated', updateUserInfo);
            window.removeEventListener('token-updated', updateUserInfo);
        };
    }, []);

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    const handleProfileClick = () => {
        router.push('/profile');
        onClose();
    };

    const handleSettingsClick = () => {
        openModal('settings', 'create', '', undefined, undefined, undefined, undefined);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
        >
            <div className="absolute right-8 top-14 w-48 py-2 mt-6 
                bg-white/10 backdrop-blur-xl rounded-2xl 
                border border-white/20 shadow-lg overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-4 py-2 border-b border-white/20">
                    <p className="text-sm text-white">Signed in as</p>
                    <p className="text-sm font-medium text-white truncate">
                        {userInfo.FirstName || userInfo.Email}
                    </p>
                    {userInfo.FirstName && (
                        <p className="text-xs text-white truncate">
                            {userInfo.Email}
                        </p>
                    )}
                </div>
                <ul className="mt-2 flex flex-col gap-1 text-sm lg:text-lg">
                    <li>
                        <button 
                            onClick={handleProfileClick}
                            className="w-full px-4 py-2 text-left text-white
                                hover:bg-emerald-400/90 hover:text-black 
                                transition-all duration-300 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={handleSettingsClick}
                            className="w-full px-4 py-2 text-left text-white
                                hover:bg-emerald-400/90 hover:text-black 
                                transition-all duration-300 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                    </li>
                    <li className="border-t border-white/20 mt-1">
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2 text-left text-red-500 
                                hover:bg-red-400/90 hover:text-white 
                                transition-all duration-300 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}
