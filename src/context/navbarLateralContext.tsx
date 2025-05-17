"use client";
import { createContext, useState, ReactNode, useCallback } from 'react';

interface NavbarLateralContextType {
    isLateralOpen: boolean;
    onLateralToggle: () => void;
}

export const NavbarLateralContext = createContext<NavbarLateralContextType>({
    isLateralOpen: false,
    onLateralToggle: () => {},
});

export function NavbarLateralProvider({ children }: { children: ReactNode }) {
    const [isLateralOpen, setIsLateralOpen] = useState(false);

    const onLateralToggle = useCallback(() => {
        setIsLateralOpen(prevState => !prevState);
    }, []);

    return (
        <NavbarLateralContext.Provider value={{ isLateralOpen, onLateralToggle }}>
            {children}
        </NavbarLateralContext.Provider>
    );
} 