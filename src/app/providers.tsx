'use client';

import { ModalProvider } from '@/context/modalContext';
import { MenuProvider } from '@/components/common/UI/CompleButtons/GlobalMenu';
import { LanguageProvider } from '@/context/languageContext';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ModalProvider>
                <MenuProvider>
                    {children}
                </MenuProvider>
            </ModalProvider>
        </LanguageProvider>
    );
} 