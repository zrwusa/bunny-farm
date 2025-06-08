"use client"

import {jwtDecode} from 'jwt-decode';
import {GRAPH_QL_API_URL, TOKEN_MODE} from '@/lib/config';
import {AuthError, NetworkError} from '@/lib/errors';

interface DecodedToken {
    sub: string;
    email: string;
    exp: number;
}

export const getStoredTokens = async () => {
    const accessToken = localStorage.getItem('access_token') ?? undefined;
    const refreshToken = localStorage.getItem('refresh_token') ?? undefined;
    return {accessToken, refreshToken};
};

export const setStoredTokens = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
};

export const removeStoredTokens = async () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const isTokenExpiringSoon = (token: string, thresholdSeconds: number = 60): boolean => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const expirationTime = decoded.exp * 1000;
        const currentTime = Date.now();
        return expirationTime - currentTime < thresholdSeconds * 1000;
    } catch {
        return true;
    }
};

export const getUserIdFromToken = (token: string): string | null => {
    try {
        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.sub;
    } catch {
        return null;
    }
};

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

export async function refreshTokens(): Promise<void> {
    if (TOKEN_MODE === 'cookie') {
        // In Cookie mode: Just trigger the background refresh interface, and the browser will automatically receive new Set-Cookies.
        if (isRefreshing) return refreshPromise!;
        isRefreshing = true;

        refreshPromise = (async () => {
            try {
                const response = await fetch(GRAPH_QL_API_URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({
                        query: `
              mutation {
                refreshTokenByCookie {
                   accessToken
                   refreshToken
                }
              }
            `,
                    }),
                });

                if (!response.ok) throw new NetworkError('Failed to refresh token (cookie mode)');

                const json = await response.json();
                if (!json.data?.refreshTokenByCookie?.ok) {
                    throw new AuthError('Token refresh rejected by server');
                }
            } catch (error) {
                console.error('Token refresh (cookie) failed:', error);
                throw error;
            } finally {
                isRefreshing = false;
                refreshPromise = null;
            }
        })();

        return refreshPromise;
    }

    // Storage mode
    if (isRefreshing) return refreshPromise!;
    isRefreshing = true;

    refreshPromise = (async () => {
        try {
            const tokens = await getStoredTokens();
            if (!tokens?.refreshToken) throw new AuthError('No refresh token available');

            const response = await fetch(GRAPH_QL_API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
                    variables: {
                        refreshToken: tokens.refreshToken,
                    },
                }),
            });

            if (!response.ok) throw new NetworkError('Failed to refresh token');

            const json = await response.json();
            const newTokens = json.data?.refreshToken;
            if (!newTokens?.accessToken || !newTokens?.refreshToken) {
                throw new AuthError('Invalid tokens returned from server');
            }

            await setStoredTokens(newTokens.accessToken, newTokens.refreshToken);
        } catch (error) {
            console.error('Token refresh (storage) failed:', error);
            await removeStoredTokens();
            throw error;
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}
