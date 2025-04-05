import React from 'react';
import { ModalProvider } from '@/modules/common/context/modalContext';
import ModalCreated from '@/modules/common/components/modals/modalCreated';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            {children}
            <ModalCreated />
        </ModalProvider>
    );
} 