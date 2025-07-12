// apps/web/src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log('💡 [Middleware] Running for:', request.nextUrl.pathname);

    const accessToken = request.cookies.get('access_token')?.value;

    if (accessToken) {
        console.log('💡 [Middleware] Found access_token, continue');
        return NextResponse.next();
    }

    console.log('💡 [Middleware] No access_token, redirecting to /api/refresh');

    // Redirect to /api/refresh?next=originalPath
    const refreshUrl = request.nextUrl.clone();
    refreshUrl.pathname = '/api/auth/refresh-tokens';
    refreshUrl.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);

    return NextResponse.redirect(refreshUrl);
}

export const config = {
    matcher: ['/cms/:path*', '/shopping/:path*'], // Protect your protected routes
};
