import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
    exp: number;
}

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            // Token expirado
            const response = NextResponse.redirect(new URL('/auth/login', request.url));
            // Limpiar el token
            response.cookies.delete('token');
            // Limpiar cualquier otra cookie relacionada con la sesión
            response.cookies.delete('user');
            return response;
        }
    } catch {
        // Error al decodificar el token
        const response = NextResponse.redirect(new URL('/auth/login', request.url));
        response.cookies.delete('token');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Solo proteger la ruta del playground
        '/playground/:path*'
    ]
};