import PlaygroundLayout from '@/modules/common/components/layouts/playgroundLayout';
import ProtectedRoute from '@/modules/common/utils/protectedRoute';

export default function Playground() {
    return (
        <ProtectedRoute>
            <PlaygroundLayout />
        </ProtectedRoute>
    )
}
