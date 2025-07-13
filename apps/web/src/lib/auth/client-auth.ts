// File: apps/web/src/lib/auth/auth-client.ts
'use client';

import { jwtDecode } from 'jwt-decode';
import { GRAPH_QL_API_URL, TOKEN_MODE } from '@/lib/config';
import { AuthError, NetworkError } from '@/lib/errors';
import { authManager } from './auth-manager';
import { REFRESH_TOKENS, REFRESH_TOKENS_BY_COOKIE } from '@/lib/graphql';

interface DecodedToken {
    sub: string;
    email: string;
    exp: number;
}

type Tokens = { accessToken?: string; refreshToken?: string };

let refreshPromise: Promise<void> | null = null;

export async function getStoredTokens(): Promise<Tokens> {
    return {
        accessToken: localStorage.getItem('access_token') ?? undefined,
        refreshToken: localStorage.getItem('refresh_token') ?? undefined,
    };
}

export async function setStoredTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
}

export async function removeStoredTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ query: REFRESH_TOKENS_BY_COOKIE.loc?.source.body }),
    });

    if (!res.ok) throw new NetworkError('Failed to refresh token (cookie mode)');
    const json = await res.json();
    if (!json.data?.refreshTokenByCookie?.accessToken) {
        throw new AuthError('Token refresh rejected by server');
    }
}

async function refreshViaStorage() {
    const { refreshToken } = await getStoredTokens();
    if (!refreshToken) throw new AuthError('No refresh token available');

    const res = await fetch(GRAPH_QL_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify({
            query: REFRESH_TOKENS.loc?.source.body,
            variables: { refresh_token: refreshToken },
        }),
    });

    if (!res.ok) throw new NetworkError('Failed to refresh token');
    const json = await res.json();
    const newTokens = json.data?.refreshToken;

    if (!newTokens?.accessToken || !newTokens?.refreshToken) {
        throw new AuthError('Invalid tokens returned from server');
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
                        console.log('TOKEN_MODE needs to be specified');
                }
            } catch (err) {
                authManager.triggerAuthFailure();
                await removeStoredTokens();
                throw err;
            } finally {
                refreshPromise = null;
            }
        })();
    }

    return refreshPromise;
}

export async function getValidAccessToken(): Promise<string | undefined> {
    const { accessToken } = await getStoredTokens();
    if (!accessToken || isTokenExpiringSoon(accessToken)) {
        await refreshTokens();
        const tokens = await getStoredTokens();
        return tokens.accessToken;
    }
    return accessToken;
}