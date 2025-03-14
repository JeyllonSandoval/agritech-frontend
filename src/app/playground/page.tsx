import ProtectedRoute from '@/modules/common/utils/protectedRoute';

export default function Playground() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Playground</h1>
            </div>
        </ProtectedRoute>
    )
}
