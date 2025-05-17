import { create } from 'zustand';
import { FileProps } from '@/hooks/getFiles';
import { getFiles } from '@/hooks/getFiles';

interface FileStore {
files: FileProps[];
loading: boolean;
error: string | null;
fetchFiles: () => Promise<void>;
addFile: (file: FileProps) => void;
}

export const useFileStore = create<FileStore>((set) => ({
files: [],
loading: false,
error: null,
fetchFiles: async () => {
    set({ loading: true, error: null });
    try {
    const files = await getFiles();
    set({ files, loading: false });
    } catch (error) {
    set({ error: 'Error loading files', loading: false });
    }
},
addFile: (file) => set((state) => ({ files: [...state.files, file] })),
})); 