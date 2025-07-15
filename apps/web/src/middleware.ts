import { NextRequest, NextResponse } from 'next/server';
import {isAuthExemptPath} from '@bunny/shared/dist/utils/auth';

export async function middleware(request: NextRequest) {
    console.log('💡 [Middleware] Running for:', request.nextUrl.pathname);
    if (isAuthExemptPath(request.nextUrl.pathname)) {
        console.log('[Middleware] Current path is auth exempt path');
        return NextResponse.next();
    }
    const accessToken = request.cookies.get('access_token')?.value;

    if (accessToken) {
        console.log('💡 [Middleware] Found access_token, continue');
        return NextResponse.next();
    }

    console.log('💡 [Middleware] No access_token, redirecting to /api/auth/refresh-tokens');

    // Always build an absolute URL for redirect
    const refreshUrl = request.nextUrl.clone();
    refreshUrl.pathname = '/api/auth/refresh-tokens';
    refreshUrl.searchParams.set(
        'next',
        request.nextUrl.pathname + request.nextUrl.search
    );

    const absoluteRefreshUrl = refreshUrl.toString();

    return NextResponse.redirect(absoluteRefreshUrl);
}

export const config = {
    matcher: ['/cms/:path*', '/shopping/:path*'],
};
