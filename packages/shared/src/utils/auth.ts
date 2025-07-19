import { AUTH_EXEMPT_PATHS } from '../constants';

/**
 * Check if a pathname is in the auth-exempt whitelist.
 */
export function isAuthExemptPath(pathname: string): boolean {
    const isExempt = AUTH_EXEMPT_PATHS.some((publicPath) =>
        pathname.startsWith(publicPath)
    );
    console.log('---isAuthExemptPath pathname', pathname, isExempt);

    return isExempt;
}