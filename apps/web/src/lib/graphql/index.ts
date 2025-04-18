import {
  GetProductsQuery,
  GetProductsQueryVariables,
  SearchProductsQuery,
  SearchProductsQueryVariables,
  SuggestProductNamesQuery,
  SuggestProductNamesQueryVariables,
  GetProductByIdQuery,
  GetProductByIdQueryVariables,
  GoogleLoginMutation,
  GoogleLoginMutationVariables,
  MeQuery,
  MeQueryVariables,
} from '@/types/generated/graphql';

// Export types
export type {
  GetProductsQuery,
  GetProductsQueryVariables,
  SearchProductsQuery,
  SearchProductsQueryVariables,
  SuggestProductNamesQuery,
  SuggestProductNamesQueryVariables,
  GetProductByIdQuery,
  GetProductByIdQueryVariables,
  GoogleLoginMutation,
  GoogleLoginMutationVariables,
  MeQuery,
  MeQueryVariables,
};

// Export queries and mutations
export {
  GET_PRODUCTS,
  SEARCH_PRODUCTS,
  SUGGEST_PRODUCT_NAMES,
  GET_PRODUCT,
  ME_QUERY,
} from './queries';

export {
  CREATE_PRODUCT,
  CREATE_PRODUCT_CLIENT,
  GOOGLE_LOGIN,
  LOGOUT,
} from './mutations';