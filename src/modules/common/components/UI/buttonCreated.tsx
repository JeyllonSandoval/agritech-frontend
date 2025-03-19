import { useState } from 'react';
import ModalCreated from '../modals/modalCreated';

export default function ButtonCreated() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-700 text-white px-4 py-2 rounded-3xl text-4xl hover:bg-blue-600 transition-colors duration-300"
            >
                Create
            </button>
            <ModalCreated 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}
