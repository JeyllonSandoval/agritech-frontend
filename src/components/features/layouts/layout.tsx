'use client';

import React from 'react';
import { ModalProvider } from '@/context/modalContext';
import { MenuProvider } from '@/components/common/UI/CompleButtons/GlobalMenu';
import ModalCreated from '../modals/modalCreated';

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