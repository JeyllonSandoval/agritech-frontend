import PlaygroundLayout from '@/components/features/layouts/playgroundLayout';
import ProtectedRoute from '@/utils/protectedRoute';

export default function Playground() {
    return (
        <ProtectedRoute>
            <PlaygroundLayout />
        </ProtectedRoute>
    )
}
