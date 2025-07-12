import {NextRequest, NextResponse} from 'next/server';
import {GRAPH_QL_API_URL} from '@/lib/config';

const REFRESH_MUTATION = `
  mutation {
    refreshTokenByCookie {
      accessToken
      refreshToken
      tokenMeta {
        accessTokenMaxAge
        refreshTokenMaxAge
      }
    }
  }
`;

const ENABLE_MIDDLEWARE_REDIRECTED = process.env.ENABLE_MIDDLEWARE_REDIRECTED === 'true';

export async function middleware(request: NextRequest) {
    console.log('💡 [Middleware] Running for:', request.nextUrl.pathname);
    const {searchParams} = request.nextUrl;

    if (ENABLE_MIDDLEWARE_REDIRECTED && searchParams.get('middleware-redirected') === '1') {
        console.log('💡 [Middleware] Already middleware-redirected, skipping');
        return NextResponse.next();
    }

    const accessToken = request.cookies.get('access_token')?.value;
    console.log('💡 [Middleware] access_token:', accessToken ? 'Exists' : 'Missing');

    if (accessToken) {
        return NextResponse.next();
    }

    const refreshRes = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Cookie: request.headers.get('cookie') || '',
        },
        credentials: 'include',
        body: JSON.stringify({ query: REFRESH_MUTATION }),
    });

    console.log('💡 [Middleware] refreshRes.ok:', refreshRes.ok);

    if (refreshRes.ok) {
        const redirectedUrl = request.nextUrl;

        // The middleware-redirected parameter is added only if the switch is turned on
        if (ENABLE_MIDDLEWARE_REDIRECTED) {
            redirectedUrl.searchParams.set('middleware-redirected', '1');
        }

        const response = NextResponse.redirect(redirectedUrl);

        const setCookie = refreshRes.headers.get('set-cookie');
        if (setCookie) {
            const cookies = setCookie.split(/,(?=\s*\w+=)/);
            for (const cookie of cookies) {
                const [cookieNameValue, ...attrs] = cookie.split(';');
                const [name, value] = cookieNameValue.split('=').map((v) => v.trim());

                const cookieOptions: Record<string, unknown> = {};
                for (const attr of attrs) {
                    const [key, val] = attr.trim().split('=');
                    if (key.toLowerCase() === 'max-age') {
                        cookieOptions.maxAge = Number(val);
                    }
                    if (key.toLowerCase() === 'samesite') {
                        cookieOptions.sameSite = val;
                    }
                    if (key.toLowerCase() === 'httponly') {
                        cookieOptions.httpOnly = true;
                    }
                    if (key.toLowerCase() === 'secure') {
                        cookieOptions.secure = true;
                    }
                    if (key.toLowerCase() === 'domain') {
                        cookieOptions.domain = val;
                    }
                }

                response.cookies.set({
                    name,
                    value,
                    ...cookieOptions,
                });
            }
        }

        return response;
    }

    console.log('💡 [Middleware] Refresh failed, staying on page');
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*',
};
