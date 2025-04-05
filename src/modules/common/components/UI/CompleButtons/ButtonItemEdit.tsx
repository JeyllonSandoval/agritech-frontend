'use client';

import React, { useRef } from 'react';
import { IoMdMore } from 'react-icons/io';
import { useModal } from '@/modules/common/context/modalContext';
import { useMenu } from './GlobalMenu';

interface ButtonItemEditProps {
    onEdit?: (newName: string) => void;
    onRemove?: (e: React.MouseEvent) => void;
    className?: string;
    initialValue?: string;
    type?: 'updateFile' | 'updateChat';
    itemId: string;
}

export const ButtonItemEdit: React.FC<ButtonItemEditProps> = ({
    onEdit,
    onRemove,
    className = '',
    initialValue = '',
    type = 'updateChat',
    itemId
}) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const { openModal, openConfirmModal } = useModal();
    const { openMenu, closeMenu } = useMenu();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('ButtonItemEdit - Click:', {
            type,
            itemId,
            initialValue,
            hasOnRemove: !!onRemove
        });

        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            openMenu(
                { top: rect.top, left: rect.right + 10 },
                (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMenu();
                    console.log('ButtonItemEdit - Edit Option Selected:', {
                        type,
                        itemId,
                        initialValue
                    });
                    openModal(type, 'edit', initialValue, onEdit, itemId);
                },
                (e: React.MouseEvent) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMenu();
                    console.log('ButtonItemEdit - Remove Option Selected:', {
                        type,
                        itemId,
                        hasOnRemove: !!onRemove
                    });
                    handleRemove(e);
                }
            );
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        closeMenu();
        if (onRemove) {
            const message = type === 'updateFile' 
                ? 'Are you sure you want to delete this file? All related messages will be deleted.'
                : 'Are you sure you want to delete this chat? All related messages will be deleted.';
            openConfirmModal(message, () => onRemove(e));
        }
    };

    return (
        <div className={`relative ${className}`} ref={buttonRef}>
            <div
                onClick={handleClick}
                className="p-2 cursor-pointer rounded-full hover:bg-white/10 transition-colors"
                aria-label="Options"
            >
                <IoMdMore className="w-5 h-5 text-white/90 hover:text-emerald-400/70 transition-colors" />
            </div>
        </div>
    );
};
