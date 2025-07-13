// File: apps/web/src/lib/auth/auth-manager.ts
import { AuthManager } from '@bunny/shared';

class WebAuthManager implements AuthManager {
    private handler: () => void = () => {
        if (typeof window !== 'undefined') {
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