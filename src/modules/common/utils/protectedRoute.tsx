"use client";
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push(`/signin?redirect=${pathname}`);
        }
    }, [pathname, router]);

return <>{children}</>;
}