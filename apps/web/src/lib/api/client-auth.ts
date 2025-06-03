import {jwtDecode} from 'jwt-decode';
// import { cookies } from 'next/headers';

interface DecodedToken {
    sub: string;
    email: string;
    exp: number;
}

export const getStoredTokens = async () => {
    if (typeof window === 'undefined') return null;
    const accessToken = localStorage.getItem('access_token') ?? undefined;
    const refreshToken = localStorage.getItem('refresh_token') ?? undefined;
    return {accessToken, refreshToken};
};

export const setStoredTokens = async (accessToken: string, refreshToken: string) => {
    if (typeof window === 'undefined') return;
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