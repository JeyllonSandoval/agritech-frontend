"use client";
import { createContext, useState, ReactNode, useCallback } from 'react';

interface NavbarLateralContextType {
    isLateralOpen: boolean;
    isCollapsed: boolean;
    navbarWidth: number;
    onLateralToggle: () => void;
    onCollapseToggle: () => void;
}

export const NavbarLateralContext = createContext<NavbarLateralContextType>({
    isLateralOpen: true,
    isCollapsed: false,
    navbarWidth: 300, // w-[300px] - Modo desplegado por defecto
    onLateralToggle: () => {},
    onCollapseToggle: () => {},
});

export function NavbarLateralProvider({ children }: { children: ReactNode }) {
    const [isLateralOpen, setIsLateralOpen] = useState(true);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const onLateralToggle = useCallback(() => {
        setIsLateralOpen(prevState => !prevState);
    }, []);

    const onCollapseToggle = useCallback(() => {
        setIsCollapsed(prevState => !prevState);
    }, []);

    // Calcular el ancho del navbar según el estado
    const getNavbarWidth = () => {
        if (isLateralOpen && !isCollapsed) return 300; // w-[300px] - Modo desplegado
        return 100; // w-25 = 25 * 4px = 100px - Modo simplificado
    };

    return (
        <NavbarLateralContext.Provider value={{ 
            isLateralOpen, 
            isCollapsed, 
            navbarWidth: getNavbarWidth(),
            onLateralToggle, 
            onCollapseToggle 
        }}>
            {children}
        </NavbarLateralContext.Provider>
    );
} 