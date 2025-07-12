// apps/web/src/lib/auth/client-auth.ts
'use client';

import { jwtDecode } from 'jwt-decode';
import { GRAPH_QL_API_URL, TOKEN_MODE } from '@/lib/config';
import { AuthError, NetworkError } from '@/lib/errors';
import { authManager } from '@/lib/auth-manager';

interface DecodedToken {
    sub: string;
    email: string;
    exp: number;
}

export const getStoredTokens = async () => {
    return {
        accessToken: localStorage.getItem('access_token') ?? undefined,
        refreshToken: localStorage.getItem('refresh_token') ?? undefined,
    };
};

export const setStoredTokens = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const removeStoredTokens = async () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};

export const isTokenExpiringSoon = (token: string, thresholdSeconds: number = 60): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.exp * 1000 - Date.now() < thresholdSeconds * 1000;
    } catch {
        return true;
    }
};

let refreshPromise: Promise<void> | null = null;

export async function refreshTokens(): Promise<void> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        if (TOKEN_MODE === 'cookie') {
            // Cookie mode: server sends Set-Cookie, browser auto saves.
            try {
                const res = await fetch(GRAPH_QL_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        query: `mutation { refreshTokenByCookie { accessToken refreshToken } }`,
                    }),
                });

                if (!res.ok) throw new NetworkError('Failed to refresh token (cookie mode)');
                const json = await res.json();
                if (!json.data?.refreshTokenByCookie?.accessToken) {
                    authManager?.triggerAuthFailure?.();
                    throw new AuthError('Token refresh rejected by server');
                }
            } catch (err) {
                console.error('Token refresh (cookie mode) failed:', err);
                throw err;
            } finally {
                refreshPromise = null;
            }
            return;
        }

        // Storage mode: update localStorage
        try {
            const tokens = await getStoredTokens();
            if (!tokens?.refreshToken) throw new AuthError('No refresh token available');

            const res = await fetch(GRAPH_QL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'omit',
                body: JSON.stringify({
                    query: `
            mutation RefreshToken($refreshToken: String!) {
              refreshToken(refreshToken: $refreshToken) {
                accessToken
                refreshToken
              }
            }
          `,
                    variables: { refreshToken: tokens.refreshToken },
                }),
            });

            if (!res.ok) throw new NetworkError('Failed to refresh token');

            const json = await res.json();
            const newTokens = json.data?.refreshToken;
            if (!newTokens?.accessToken || !newTokens?.refreshToken) {
                throw new AuthError('Invalid tokens returned from server');
            }

            await setStoredTokens(newTokens.accessToken, newTokens.refreshToken);

        } catch (err) {
            console.error('Token refresh (storage mode) failed:', err);
            await removeStoredTokens();
            throw err;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}


