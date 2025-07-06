import {AuthManager} from '@bunny/shared';

class WebAuthManager implements AuthManager {
    private handler: () => void = () => {
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname + window.location.search;
            const encoded = encodeURIComponent(currentPath);
            window.location.href = `/auth/login?redirect=${encoded}`;
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