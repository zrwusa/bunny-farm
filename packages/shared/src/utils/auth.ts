import { AUTH_EXEMPT_PATHS } from '../constants';

/**
 * Check if a pathname is in the auth-exempt whitelist.
 */
export function isAuthExemptPath(pathname: string): boolean {
    return AUTH_EXEMPT_PATHS.some((publicPath) =>
        pathname.startsWith(publicPath)
    );
}