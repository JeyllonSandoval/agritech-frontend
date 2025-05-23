import { Suspense } from 'react';
import ResetPasswordForm from "@/components/features/forms/resetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-green-950/90 via-black to-green-950/90">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-400"></div>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
} 