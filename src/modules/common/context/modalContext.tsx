'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FileProps } from '@/modules/common/hooks/getFiles';

type ModalType = 'createdChat' | 'createdFile' | 'updateChat' | 'updateFile';
type ModalMode = 'create' | 'select' | 'preview' | 'edit';

interface ModalContextType {
    isOpen: boolean;
    type: ModalType;
    mode: ModalMode;
    initialValue: string;
    selectedFile?: FileProps;
    onEdit?: (value: string) => void;
    onFileSelect?: (file: FileProps) => void;
    openModal: (type: ModalType, mode: ModalMode, initialValue: string, onEdit?: (value: string) => void) => void;
    closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType>('createdChat');
    const [mode, setMode] = useState<ModalMode>('create');
    const [initialValue, setInitialValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<FileProps | undefined>(undefined);
    const [onEdit, setOnEdit] = useState<((value: string) => void) | undefined>(undefined);
    const [onFileSelect, setOnFileSelect] = useState<((file: FileProps) => void) | undefined>(undefined);

    const openModal = (type: ModalType, mode: ModalMode, initialValue: string, onEdit?: (value: string) => void) => {
        setType(type);
        setMode(mode);
        setInitialValue(initialValue);
        setOnEdit(() => onEdit);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setType('createdChat');
        setMode('create');
        setInitialValue('');
        setSelectedFile(undefined);
        setOnEdit(undefined);
        setOnFileSelect(undefined);
    };

    return (
        <ModalContext.Provider value={{ 
            isOpen, 
            type, 
            mode, 
            initialValue, 
            selectedFile,
            onEdit,
            onFileSelect,
            openModal, 
            closeModal 
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
} 