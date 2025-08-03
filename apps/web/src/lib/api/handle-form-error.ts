import { ApolloError } from '@apollo/client';
import { FieldValues, UseFormSetError, Path } from 'react-hook-form';
import {ClassValidatorFieldError} from '@bunny/shared';


function isClassValidatorFieldErrorArray(
    value: unknown
): value is ClassValidatorFieldError[] {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                typeof item === 'object' &&
                item !== null &&
                'property' in item &&
                typeof item.property === 'string'
        )
    );
}

export function handleFormError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>
) {
    if (error instanceof ApolloError) {
        for (const gqlErr of error.graphQLErrors) {
            const code = gqlErr.extensions?.code;
            const originalError = gqlErr.extensions?.originalError;

            const maybeValidationMessage = (originalError as Record<string, unknown>)?.message;

            if (code === 'BAD_REQUEST' && isClassValidatorFieldErrorArray(maybeValidationMessage)) {
                for (const fieldError of maybeValidationMessage) {
                    const field = fieldError.property;
                    const constraints = fieldError.constraints;
                    const messages = Object.values(constraints ?? {});
                    const firstMessage = messages[0];

                    if (field && firstMessage) {
                        setError(field as Path<T>, {
                            type: 'server',
                            message: firstMessage,
                        });
                    }
                }
            } else {
                setError('root.serverError', {
                    type: 'server',
                    message: gqlErr.message,
                });
            }
        }
    } else if (error instanceof Error) {
        setError('root.serverError', {
            type: 'server',
            message: error.message,
        });
    } else {
        setError('root.serverError', {
            type: 'server',
            message: 'Unexpected error occurred',
        });
    }
}

