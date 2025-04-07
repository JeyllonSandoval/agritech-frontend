'use client';

import { ModalProvider } from '@/modules/common/context/modalContext';
import { MenuProvider } from '@/modules/common/components/UI/CompleButtons/GlobalMenu';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            <MenuProvider>
                {children}
            </MenuProvider>
        </ModalProvider>
    );
} 