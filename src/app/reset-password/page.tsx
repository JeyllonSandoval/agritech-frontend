import { Suspense } from 'react';
import ResetPasswordForm from "@/components/features/forms/resetPasswordForm";

export default function ResetPasswordPage() {
    return (
        <main className="max-h-screen flex items-center justify-center">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full border-t-2 border-b-2 border-emerald-400"></div>
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
} 