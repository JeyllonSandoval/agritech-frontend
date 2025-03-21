import { useEffect, useState } from "react";
import { getChats } from "@/modules/common/services/getChats";
import type { GetChatsProps } from "@/modules/common/services/getChats";

interface NavbarLateralProps {
    isOpen: boolean;
    onToggle: () => void;
    activePanel: 'welcome' | 'files' | 'chat';
    onPanelChange: (panel: 'welcome' | 'files' | 'chat') => void;
    onCreateChat: () => void;
}

export default function NavbarLateral({ isOpen, onToggle, ...props }: NavbarLateralProps) {
    const [chats, setChats] = useState<GetChatsProps[]>([]);

    useEffect(() => {
        const loadChats = async () => {
            const userChats = await getChats();
            setChats(userChats);
        };

        loadChats();
    }, []);

    return (
        <>
            {/* Botón independiente para mostrar el menú */}
            <button
                onClick={onToggle}
                className={`fixed left-0 top-[90px] z-50 text-4xl text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-r-md ${
                    isOpen ? 'hidden' : 'block'
                }`}
            >
                {'>'}
            </button>

            {/* Navbar lateral */}
            <nav className={`fixed left-0 top-[80px] bottom-0 bg-gray-800 transition-all duration-300 text-2xl ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{ width: "300px" }}
            >
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-300">Quick access</h1>
                    <button
                        onClick={onToggle}
                        className="text-4xl text-gray-400 hover:text-white transition-colors"
                    >
                        {'<'}
                    </button>
                </div>

                <div className="flex flex-col gap-4 p-4">
                    <button 
                        onClick={() => props.onPanelChange('files')}
                        className="w-full mb-2 bg-blue-500 text-white rounded-md p-2"
                    >
                        File PDF
                    </button>
                    <button 
                        onClick={props.onCreateChat}
                        className="w-full mb-2 bg-green-500 text-white rounded-md p-2"
                    >
                        Create Chat
                    </button>
                    <div className="flex flex-col gap-2 mt-4 justify-center items-center">
                        <h2 className="text-lg">View Chats</h2>
                        {chats.length > 0 ? (
                            chats.map((chat) => (
                                <button 
                                    key={chat.ChatID}
                                    className="w-full p-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
                                >
                                    {chat.chatname}
                                </button>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">Empty chats</p>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}
