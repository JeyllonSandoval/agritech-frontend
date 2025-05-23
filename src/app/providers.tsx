'use client';

import { ModalProvider } from '@/context/modalContext';
import { MenuProvider } from '@/components/common/UI/CompleButtons/GlobalMenu';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            <MenuProvider>
                {children}
            </MenuProvider>
        </ModalProvider>
    );
} 