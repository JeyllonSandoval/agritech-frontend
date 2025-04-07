'use client';

import React from 'react';
import { ModalProvider } from '@/modules/common/context/modalContext';
import { MenuProvider } from '@/modules/common/components/UI/CompleButtons/GlobalMenu';
import ModalCreated from '@/modules/common/components/modals/modalCreated';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ModalProvider>
            <MenuProvider>
                {children}
                <ModalCreated />
            </MenuProvider>
        </ModalProvider>
    );
} 