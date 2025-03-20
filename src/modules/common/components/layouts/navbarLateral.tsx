import { useEffect, useState } from "react";
import { getChats } from "@/modules/common/services/getChats";
import type { GetChatsProps } from "@/modules/common/services/getChats";

interface NavbarLateralProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    setActivePanel: (panel: 'welcome' | 'files' | 'chat') => void;
}

export default function NavbarLateral({ isSidebarOpen, setIsSidebarOpen, setActivePanel }: NavbarLateralProps) {
    const [chats, setChats] = useState<GetChatsProps[]>([]);

    useEffect(() => {
        const loadChats = async () => {
            const userChats = await getChats();
            setChats(userChats);
        };

        loadChats();
    }, []);

    return (
        <section>
            <div
                className={`fixed left-0 top-24 h-full py-15 bg-gray-800 text-white p-4 flex flex-col gap-4 text-2xl transition-all duration-300 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                style={{ width: "300px" }}
            >
                <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="mb-4 text-lg text-right"
                >
                    Hide Menu
                </button>
                <button 
                    onClick={() => setActivePanel('files')}
                    className="w-full mb-2 bg-blue-500 text-white rounded-md p-2"
                >
                    File PDF
                </button>
                <button 
                    onClick={() => setActivePanel('chat')}
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
            {!isSidebarOpen && (
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 bg-gray-700 text-white m-2 rounded-md text-lg fixed top-4 left-4 z-[20]"
                >
                    Menu
                </button>
            )}
        </section>
    );
}
