export type SameSite = boolean | "lax" | "strict" | "none" | undefined;

export type ClassValidatorFieldError = {
    property: string;
    constraints?: Record<string, string>;
};