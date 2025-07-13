import { NextResponse } from 'next/server';
import { GRAPH_QL_API_URL } from '@/lib/config';
import { REFRESH_TOKENS_BY_COOKIE } from '@/lib/graphql';
import { SameSite } from '@bunny/shared';

export async function GET(request: Request) {
    const cookieHeader = request.headers.get('cookie') || '';
    const url = new URL(request.url);
    const origin = url.origin; // https://yourdomain.com
    const nextPath = url.searchParams.get('next') || '/';

    const backendRes = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
        body: JSON.stringify({ query: REFRESH_TOKENS_BY_COOKIE.loc?.source.body }),
    });

    const json = await backendRes.json();
    const payload = json.data?.refreshTokenByCookie;
    console.log('---payload', payload);

    if (!backendRes.ok || !payload?.accessToken) {
        return NextResponse.redirect(new URL('/auth/login', origin));
    }

    // 🔑 Always use absolute URL for redirect
    const redirectUrl = new URL(nextPath, origin);

    const response = NextResponse.redirect(redirectUrl);

    // set cookies using meta from payload
    const metaA = payload.accessTokenMeta;
    console.log('---metaA', metaA);
    response.cookies.set({
        name: 'access_token',
        value: payload.accessToken,
        httpOnly: metaA.httpOnly,
        secure: metaA.secure,
        sameSite: metaA.sameSite as SameSite,
        maxAge: metaA.maxAge,
        domain: metaA.domain,
        path: '/',
    });

    const metaR = payload.refreshTokenMeta;
    console.log('---metaR', metaR);
    if (payload.refreshToken) {
        response.cookies.set({
            name: 'refresh_token',
            value: payload.refreshToken,
            httpOnly: metaR.httpOnly,
            secure: metaR.secure,
            sameSite: metaR.sameSite as SameSite,
            maxAge: metaR.maxAge,
            domain: metaR.domain,
            path: '/',
        });
    }

    return response;
}
