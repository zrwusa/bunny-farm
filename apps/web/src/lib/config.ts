import {TokenMode} from '@/types/config';

export const TOKEN_MODE = (process.env.NEXT_PUBLIC_TOKEN_MODE === 'storage' ? 'storage' : 'cookie') as
   TokenMode;

export const GRAPH_QL_API_URL = process.env.NEXT_PUBLIC_GRAPH_QL_API_URL ?? 'http://localhost:8080/graphql';
