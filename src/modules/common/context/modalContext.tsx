'use client';

import React, { createContext, useContext, useState } from 'react';
import { FileProps } from '@/modules/common/hooks/getFiles';

type ModalType = 'createdChat' | 'createdFile' | 'updateChat' | 'updateFile';
type ModalMode = 'create' | 'select' | 'preview' | 'edit';

interface ModalContextType {
    isOpen: boolean;
    type: ModalType;
    mode: ModalMode;
    initialValue: string;
    itemId: string;
    onEdit?: (value: string) => void;
    onFileSelect?: (file: FileProps) => void;
    selectedFile?: FileProps;
    openModal: (type: ModalType, mode: ModalMode, initialValue?: string, onEdit?: (value: string) => void, itemId?: string) => void;
    closeModal: () => void;
    setSelectedFile: (file: FileProps | undefined) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType>('createdChat');
    const [mode, setMode] = useState<ModalMode>('create');
    const [initialValue, setInitialValue] = useState('');
    const [itemId, setItemId] = useState('');
    const [onEdit, setOnEdit] = useState<((value: string) => void) | undefined>();
    const [onFileSelect, setOnFileSelect] = useState<((file: FileProps) => void) | undefined>();
    const [selectedFile, setSelectedFile] = useState<FileProps | undefined>();

    const openModal = (
        newType: ModalType,
        newMode: ModalMode,
        newInitialValue: string = '',
        newOnEdit?: (value: string) => void,
        newItemId: string = ''
    ) => {
        setType(newType);
        setMode(newMode);
        setInitialValue(newInitialValue);
        setOnEdit(() => newOnEdit);
        setItemId(newItemId);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        setOnEdit(undefined);
        setOnFileSelect(undefined);
        setSelectedFile(undefined);
        setItemId('');
    };

    return (
        <ModalContext.Provider
            value={{
                isOpen,
                type,
                mode,
                initialValue,
                itemId,
                onEdit,
                onFileSelect,
                selectedFile,
                openModal,
                closeModal,
                setSelectedFile
            }}
        >
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