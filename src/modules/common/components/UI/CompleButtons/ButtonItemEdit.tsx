'use client';

import React, { useRef } from 'react';
import { IoMdMore } from 'react-icons/io';
import { useModal } from '@/modules/common/context/modalContext';
import { useMenu } from './GlobalMenu';

interface ButtonItemEditProps {
    onEdit?: (newName: string) => void;
    onRemove?: () => void;
    className?: string;
    initialValue?: string;
    type?: 'updateFile' | 'updateChat';
}

export const ButtonItemEdit: React.FC<ButtonItemEditProps> = ({
    onEdit,
    onRemove,
    className = '',
    initialValue = '',
    type = 'updateChat'
}) => {
    const buttonRef = useRef<HTMLDivElement>(null);
    const { openModal } = useModal();
    const { openMenu, closeMenu } = useMenu();

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            openMenu(
                { top: rect.top, left: rect.right + 10 },
                (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    closeMenu();
                    openModal(type, 'edit', initialValue, onEdit);
                },
                () => {
                    closeMenu();
                    onRemove?.();
                }
            );
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
