interface PlaygroundPanelProps {
    isSidebarOpen: boolean;
}

export default function PlaygroundPanel({ isSidebarOpen }: PlaygroundPanelProps) {
    return (
        <div className={`flex-grow transition-all duration-300 ${
            isSidebarOpen ? 'ml-[300px]' : 'ml-0'
        }`}>
            <div className="flex items-center justify-center h-full bg-gray-500">
                <h2 className="text-4xl">Welcome</h2>
            </div>
        </div>
    );
}
