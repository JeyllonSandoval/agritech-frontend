'use client';

import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

interface MenuOptionsProps {
    isOpen: boolean;
    position: { top: number; left: number };
    onClose: () => void;
    onEdit?: (e: React.MouseEvent) => void;
    onRemove?: (e: React.MouseEvent) => void;
}

export default function MenuOptions({ 
    isOpen, 
    position, 
    onClose, 
    onEdit, 
    onRemove 
}: MenuOptionsProps) {
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    useEffect(() => {
        if (isOpen) {
            const menuWidth = 192; // 48 * 4 (w-48)
            const menuHeight = 100; // Approximate height
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            let newLeft = position.left;
            let newTop = position.top;

            // Adjust horizontal position if menu would overflow right edge
            if (position.left + menuWidth > windowWidth) {
                newLeft = windowWidth - menuWidth - 16; // 16px padding from edge
            }

            // Adjust vertical position if menu would overflow bottom edge
            if (position.top + menuHeight > windowHeight) {
                newTop = position.top - menuHeight;
            }

            // Ensure menu doesn't go off the left edge
            newLeft = Math.max(16, newLeft);

            // Ensure menu doesn't go off the top edge
            newTop = Math.max(16, newTop);

            setAdjustedPosition({ top: newTop, left: newLeft });
        }
    }, [isOpen, position]);

    if (!isOpen) return null;

    return (
        <>
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                onClick={onClose}
            />
            <div 
                className="fixed w-48 bg-white/5 backdrop-blur-sm
                    border border-white/10 shadow-lg shadow-black/20 rounded-lg z-[101]
                    max-h-[calc(100vh-32px)] overflow-y-auto"
                style={{
                    top: adjustedPosition.top,
                    left: adjustedPosition.left
                }}
            >
                <div className="space-y-1 flex flex-col gap-1 m-1">
                    {onEdit && (
                        <button
                            onClick={onEdit}
                            className="flex items-center w-full px-4 py-2 text-sm text-white/90 
                                hover:text-emerald-400/70 hover:bg-white/10 transition-colors rounded-lg"
                        >
                            <MdEdit className="w-4 h-4 mr-2" />
                            Edit
                        </button>
                    )}
                    {onRemove && (
                        <button
                            onClick={onRemove}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-400/90 
                                hover:text-red-400 hover:bg-white/10 transition-colors rounded-lg"
                        >
                            <MdDelete className="w-4 h-4 mr-2" />
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </>
    );
} 