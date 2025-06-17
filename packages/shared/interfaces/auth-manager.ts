export interface AuthManager {
    setAuthFailureHandler(fn: () => void): void;
    triggerAuthFailure(): void;
}
