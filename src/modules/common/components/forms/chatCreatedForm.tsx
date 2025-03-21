interface ChatCreatedFormProps {
    onClose: () => void;
}

export default function ChatCreatedForm({ onClose }: ChatCreatedFormProps) {
    return (
        <form className="flex flex-col gap-4">
            <input 
            type="text" 
            placeholder="Chat Name"
            className="w-full p-2 rounded-md border-2 border-gray-300"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">Create</button>
        </form>
    );
}
