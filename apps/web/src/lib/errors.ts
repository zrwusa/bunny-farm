export class NetworkError extends Error {
    public status?: number;

    constructor(message: string, status?: number) {
        super(message);
        this.name = 'NetworkError';
        this.status = status;
    }
}


export class AuthError extends Error {
    constructor(message = 'Authentication error') {
        super(message);
        this.name = 'AuthError';
    }
}

export class ValidationError extends Error {
    public fieldErrors: Record<string, string>;

    constructor(fieldErrors: Record<string, string>) {
        super('Validation failed');
        this.name = 'ValidationError';
        this.fieldErrors = fieldErrors;
    }
}

export class BusinessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BusinessError';
    }
}
