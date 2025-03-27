import { create } from 'zustand';
import { FileProps } from '@/modules/common/hooks/getFiles';
import { getFiles } from '@/modules/common/hooks/getFiles';

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
    set({ loading: true, error: null, files: [] });
    try {
    const files = await getFiles();
    set({ files, loading: false });
    } catch (error) {
    set({ error: 'Error loading files', loading: false, files: [] });
    }
},
addFile: (file) => set((state) => ({ files: [...state.files, file] })),
})); 