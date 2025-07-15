// File: apps/web/src/lib/auth/auth-manager.ts
import { AuthManager } from '@bunny/shared';
import { isAuthExemptPath } from '@bunny/shared/dist/utils/auth';

class WebAuthManager implements AuthManager {
    private handler: () => void = () => {
        if (typeof window !== 'undefined') {

            const currentPath = window.location.pathname;
            if (isAuthExemptPath(currentPath)) {
                console.warn('Skipping auth redirect on public path');
                return;
            }
            const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
            window.location.href = `/auth/login?redirect=${redirectTo}`;
        }
    };

    setAuthFailureHandler(fn: () => void) {
        this.handler = fn;
    }

    triggerAuthFailure() {
        this.handler();
    }
}

export const authManager = new WebAuthManager();