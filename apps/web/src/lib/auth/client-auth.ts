// File: apps/web/src/lib/auth/auth-client.ts
'use client';

import {jwtDecode} from 'jwt-decode';
import {GRAPH_QL_API_URL, TOKEN_MODE} from '@/lib/config';
import {NetworkError, UnauthorizedException} from '@bunny/shared';
import {authManager} from './auth-manager';
import {REFRESH_TOKENS, REFRESH_TOKENS_BY_COOKIE} from '@/lib/graphql';
import {TokenOutput} from '@/types/generated/graphql'

interface DecodedToken {
    sub: string;
    email: string;
    exp: number;
}

let refreshPromise: Promise<void> | null = null;

export async function getStoredTokens(): Promise<TokenOutput> {
    return {
        accessToken: localStorage.getItem('ACCESS_TOKEN') ?? '',
        refreshToken: localStorage.getItem('REFRESH_TOKEN') ?? '',
    };
}

export async function setStoredTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('ACCESS_TOKEN', accessToken);
    localStorage.setItem('REFRESH_TOKEN', refreshToken);
}

export async function removeStoredTokens() {
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('REFRESH_TOKEN');
}

export function isTokenExpiringSoon(token: string, thresholdSeconds = 60): boolean {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.exp * 1000 - Date.now() < thresholdSeconds * 1000;
    } catch {
        return true;
    }
}

async function refreshViaCookie() {
    const res = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify({query: REFRESH_TOKENS_BY_COOKIE.loc?.source.body}),
    });

    if (!res.ok) throw new NetworkError('Failed to refresh token (cookie mode)', { status: res.status });
    const json = await res.json();
    if (!json.data?.refreshTokenByCookie?.accessToken) {
        throw new UnauthorizedException('Token refresh rejected by server');
    }
}

async function refreshViaStorage() {
    const {refreshToken} = await getStoredTokens();
    if (!refreshToken) throw new UnauthorizedException('No refresh token available');

    const res = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'omit',
        body: JSON.stringify({
            query: REFRESH_TOKENS.loc?.source.body,
            variables: {REFRESH_TOKEN: refreshToken},
        }),
    });

    if (!res.ok) throw new NetworkError('Failed to refresh token', { status: res.status });
    const json = await res.json();
    const newTokens = json.data?.refreshToken;

    if (!newTokens?.accessToken || !newTokens?.refreshToken) {
        throw new UnauthorizedException('Invalid tokens returned from server');
    }

    await setStoredTokens(newTokens.accessToken, newTokens.refreshToken);
}

export async function refreshTokens(): Promise<void> {
    if (!refreshPromise) {
        refreshPromise = (async () => {
            try {
                switch (TOKEN_MODE) {
                    case 'cookie':
                        await refreshViaCookie();
                        break;
                    case 'storage':
                        await refreshViaStorage();
                        break;
                    default:
                        throw new Error('TOKEN_MODE needs to be specified');
                }
            } catch (err: unknown) {
                if (err instanceof UnauthorizedException) {
                    authManager.triggerAuthFailure();
                    await removeStoredTokens();
                }
                throw err;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

export async function getValidAccessToken(): Promise<string | undefined> {
    const {accessToken} = await getStoredTokens();
    if (!accessToken || isTokenExpiringSoon(accessToken)) {
        await refreshTokens();
        const tokens = await getStoredTokens();
        return tokens.accessToken;
    }
    return accessToken;
}