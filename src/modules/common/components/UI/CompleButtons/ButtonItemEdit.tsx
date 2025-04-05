import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoMdMore } from 'react-icons/io';
import { MdEdit, MdDelete } from 'react-icons/md';

interface ButtonItemEditProps {
    onEdit?: () => void;
    onRemove?: () => void;
    className?: string;
}

export const ButtonItemEdit: React.FC<ButtonItemEditProps> = ({
    onEdit,
    onRemove,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleClick = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.top,
                left: rect.right + 10
            });
        }
        setIsOpen(!isOpen);
    };

    const Menu = () => (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 " />
            <div 
                className="fixed w-48 bg-white/5 backdrop-blur-sm
                    border border-white/10 shadow-lg shadow-black/20 rounded-lg z-40"
                style={{
                    top: menuPosition.top,
                    left: menuPosition.left
                }}
            >
                <div className="space-y-1 flex flex-col gap-1 m-1">
                    {onEdit && (
                        <button
                            onClick={() => {
                                onEdit();
                                setIsOpen(false);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-white/90 
                                hover:text-emerald-400/70 hover:bg-white/10 transition-colors rounded-lg"
                        >
                            <MdEdit className="w-4 h-4 mr-2" />
                            Edit
                        </button>
                    )}
                    {onRemove && (
                        <button
                            onClick={() => {
                                onRemove();
                                setIsOpen(false);
                            }}
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

    return (
        <div className={`relative ${className}`} ref={buttonRef}>
            <div
                onClick={handleClick}
                className="p-2 cursor-pointer rounded-full hover:bg-white/10 transition-colors"
                aria-label="Options"
            >
                <IoMdMore className="w-5 h-5 text-white/90 hover:text-emerald-400/70 transition-colors" />
            </div>
            {isOpen && createPortal(<Menu />, document.body)}
        </div>
    );
};
