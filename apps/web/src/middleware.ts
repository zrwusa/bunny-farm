import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    console.log('💡 [Middleware] Running for:', request.nextUrl.pathname);

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
