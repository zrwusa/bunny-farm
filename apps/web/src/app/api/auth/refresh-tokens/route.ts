// apps/web/src/app/api/auth/refresh-tokens/route.ts

import {NextResponse} from 'next/server';
import {GRAPH_QL_API_URL} from '@/lib/config';
import {REFRESH_TOKENS_BY_COOKIE} from '@/lib/graphql';

export async function GET(request: Request) {
    console.log('💡 [API] /api/auth/refresh-tokens called');

    const cookie = request.headers.get('cookie') || '';

    const backendRes = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookie,
        },
        body: JSON.stringify({query: REFRESH_TOKENS_BY_COOKIE.loc?.source.body}),
    });

    console.log('💡 [API] backendRes.ok:', backendRes.ok);

    const url = new URL(request.url);
    const origin = url.origin;
    const nextPath = url.searchParams.get('next') || '/';
    const nextUrl = origin + nextPath;

    if (backendRes.ok) {
        const setCookie = backendRes.headers.get('set-cookie');

        const response = NextResponse.redirect(nextUrl);

        if (setCookie) {
            console.log('💡 [API] Passing Set-Cookie');
            response.headers.set('set-cookie', setCookie);
        }

        return response;
    }

    console.log('💡 [API] Refresh failed, redirecting to /login');
    return NextResponse.redirect(origin + '/auth/login');
}

