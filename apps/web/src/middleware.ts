// apps/web/src/middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import {isAuthExemptPath} from '@bunny/shared/dist/utils/auth';

export async function middleware(request: NextRequest) {
    console.log('💡 [Middleware] Running for:', request.nextUrl.pathname);
    if (isAuthExemptPath(request.nextUrl.pathname)) {
        console.log('[Middleware] Current path is auth exempt path');
        return NextResponse.next();
    }
    const accessToken = request.cookies.get('ACCESS_TOKEN')?.value;

    if (accessToken) {
        console.log('💡 [Middleware] Found ACCESS_TOKEN, continue');
        return NextResponse.next();
    }

    console.log('💡 [Middleware] No ACCESS_TOKEN, redirecting to /api/auth/refresh-tokens');

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
