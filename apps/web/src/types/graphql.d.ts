import {GraphQLError} from 'graphql/error';

export type FetchGraphQLOptions = {
    variables?: Record<string, unknown>;
    revalidate?: number;
};



export type ClientFetchGraphQLOptions = FetchGraphQLOptions & {
    accessToken?: string;
};


export  type GraphQLResponse<T> = {
    data?: T;
    errors?: GraphQLError[];
};