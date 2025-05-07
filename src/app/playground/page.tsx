import ProtectedRoute from '@/utils/protectedRoute';

export default function Playground() {
    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center h-full">
                <h2 className="text-4xl">Welcome</h2>
            </div>
        </ProtectedRoute>
    );
}
