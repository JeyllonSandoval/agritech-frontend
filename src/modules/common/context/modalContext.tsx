'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { FileProps } from '@/modules/common/hooks/getFiles';

type ModalType = 'createdChat' | 'createdFile' | 'updateChat' | 'updateFile' | 'settings' | 'edit-profile';
type ModalMode = 'create' | 'select' | 'preview' | 'edit';

interface ModalContextType {
    isOpen: boolean;
    type: ModalType;
    mode: ModalMode;
    initialValue: string;
    onEdit?: (value: string) => void;
    onFileSelect?: (file: FileProps) => void;
    selectedFile: FileProps | null;
    itemId: string | undefined;
    contentURL: string | undefined;
    closeModal: () => void;
    openModal: (type: ModalType, mode: ModalMode, initialValue?: string, onEdit?: (value: string) => void, itemId?: string, onFileSelect?: (file: FileProps) => void, contentURL?: string) => void;
    setOnFileSelect: (callback: (file: FileProps) => void) => void;
    isConfirmOpen: boolean;
    confirmMessage: string;
    onConfirm?: () => void;
    openConfirmModal: (message: string, onConfirm: () => void) => void;
    closeConfirmModal: () => void;
    setSelectedFile: (file: FileProps | null) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState<ModalType>('createdChat');
    const [mode, setMode] = useState<ModalMode>('create');
    const [initialValue, setInitialValue] = useState('');
    const [onEdit, setOnEdit] = useState<((value: string) => void) | undefined>(undefined);
    const [onFileSelect, setOnFileSelect] = useState<((file: FileProps) => void) | undefined>(undefined);
    const [selectedFileState, setSelectedFileState] = useState<FileProps | null>(null);
    const [itemId, setItemId] = useState<string | undefined>(undefined);
    const [contentURL, setContentURL] = useState<string | undefined>(undefined);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>(undefined);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setType('createdChat');
        setMode('create');
        setInitialValue('');
        setOnEdit(undefined);
        setOnFileSelect(undefined);
        setSelectedFileState(null);
        setItemId(undefined);
        setContentURL(undefined);
    }, []);

    const openModal = useCallback((
        type: ModalType,
        mode: ModalMode,
        initialValue = '',
        onEdit?: (value: string) => void,
        itemId?: string,
        onFileSelect?: (file: FileProps) => void,
        contentURL?: string
    ) => {
        setType(type);
        setMode(mode);
        setInitialValue(initialValue);
        setOnEdit(() => onEdit);
        setOnFileSelect(() => onFileSelect);
        setItemId(itemId);
        setContentURL(contentURL);
        setIsOpen(true);
    }, []);

    const openConfirmModal = useCallback((message: string, onConfirm: () => void) => {
        setConfirmMessage(message);
        setOnConfirm(() => onConfirm);
        setIsConfirmOpen(true);
    }, []);

    const closeConfirmModal = useCallback(() => {
        setIsConfirmOpen(false);
        setConfirmMessage('');
        setOnConfirm(undefined);
    }, []);

    const setSelectedFile = useCallback((file: FileProps | null) => {
        setSelectedFileState(file);
    }, []);

    const value = {
        isOpen,
        type,
        mode,
        initialValue,
        onEdit,
        onFileSelect,
        selectedFile: selectedFileState,
        itemId,
        contentURL,
        closeModal,
        openModal,
        setOnFileSelect,
        isConfirmOpen,
        confirmMessage,
        onConfirm,
        openConfirmModal,
        closeConfirmModal,
        setSelectedFile
    };

    return (
        <ModalContext.Provider value={value}>
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