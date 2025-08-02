import {GraphQLResponse} from '@/types/graphql';

export function serverHandleGraphqlErrors<T>(response: GraphQLResponse<T>): void {
    const errors = response.errors;

    if (!errors || errors.length === 0) return;

    // cases, aggregate and throw as a single Error
    const combinedMessage = errors.map((e) => e.message).join('; ');
    throw new Error(combinedMessage);
}