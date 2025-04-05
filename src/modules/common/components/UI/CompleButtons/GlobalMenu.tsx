'use client';

import React, { createContext, useContext, useState } from 'react';
import MenuOptions from './MenuOptions';

interface MenuContextType {
    openMenu: (position: { top: number; left: number }, onEdit?: (e: React.MouseEvent) => void, onRemove?: (e: React.MouseEvent) => void) => void;
    closeMenu: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [onEdit, setOnEdit] = useState<((e: React.MouseEvent) => void) | undefined>(undefined);
    const [onRemove, setOnRemove] = useState<((e: React.MouseEvent) => void) | undefined>(undefined);

    const openMenu = (pos: { top: number; left: number }, edit?: (e: React.MouseEvent) => void, remove?: (e: React.MouseEvent) => void) => {
        setPosition(pos);
        setOnEdit(() => edit);
        setOnRemove(() => remove);
        setIsOpen(true);
    };

    const closeMenu = () => {
        setIsOpen(false);
        setOnEdit(undefined);
        setOnRemove(undefined);
    };

    return (
        <MenuContext.Provider value={{ openMenu, closeMenu }}>
            {children}
            <MenuOptions
                isOpen={isOpen}
                position={position}
                onClose={closeMenu}
                onEdit={onEdit}
                onRemove={onRemove}
            />
        </MenuContext.Provider>
    );
}

export function useMenu() {
    const context = useContext(MenuContext);
    if (context === undefined) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
} 