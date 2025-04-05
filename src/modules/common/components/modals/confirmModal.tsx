import { useModal } from '@/modules/common/context/modalContext';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 text-xl"
            onClick={onCancel}
        >
            <div 
                className="bg-gray-100/10 backdrop-blur-sm rounded-2xl 
                    border border-white/20 shadow-lg
                    p-8 relative w-full max-w-md
                    flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col gap-4">
                    <h2 className="text-xl font-semibold text-white">
                        Confirm delete
                    </h2>
                    <p className="text-white/70">
                        {message}
                    </p>
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg bg-white/10 text-white/70
                                hover:bg-white/20 transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400
                                hover:bg-red-500/30 transition-colors duration-300"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 