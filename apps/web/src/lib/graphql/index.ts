import { gql } from '@apollo/client';

// Import generated types
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

// Products
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      images {
        id
        url
        position
      }
      brand {
        id
        name
      }
      variants {
        id
        prices {
          id
          price
        }
      }
    }
  }
`;

export const SEARCH_PRODUCTS = gql`
  query SearchProducts($keyword: String!) {
    searchProducts(keyword: $keyword) {
      id
      name
      description
      images {
        id
        url
        position
      }
      brand {
        id
        name
      }
      category {
        id
        name
      }
      variants {
        id
        size
        sku
        color
        prices {
          id
          price
          validFrom
          validTo
        }
        inventories {
          id
          quantity
          warehouse {
            id
            name
            location
          }
        }
        inventoryRecords {
          id
          changeQuantity
          type
          reason
        }
        reviews {
          id
          rating
          comment
        }
      }
      reviews {
        id
        rating
        comment
      }
    }
  }
`;

export const SUGGEST_PRODUCT_NAMES = gql`
  query SuggestProductNames($input: String!) {
    suggestProductNames(input: $input)
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    product(id: $id) {
      id
      name
      description
      brand {
        id
        name
      }
      category {
        id
        name
      }
      images {
        id
        url
        position
      }
      variants {
        id
        inventories {
          id
          quantity
          warehouse {
            id
            name
          }
        }
        inventoryRecords {
          id
          type
          changeQuantity
        }
        size
        sku
        color
        prices {
          id
          price
          validFrom
          validTo
        }
        reviews {
          id
          rating
          comment
          user {
            id
            username
          }
        }
      }
      reviews {
        id
        rating
        comment
      }
    }
  }
`;

// Auth
export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($loginInput: LoginInput!) {
    login(input: $loginInput) {
      accessToken
      refreshToken
    }
  }
`;

// User
export const ME_QUERY = gql`
  query Me {
    me {
      id
      username
      email
      provider
      profile {
        displayName
        avatarUrl
      }
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      provider
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      images {
        id
        url
        position
      }
      brand {
        id
        name
      }
      variants {
        id
        color
        size
        prices {
          id
          price
        }
        inventories {
          id
          quantity
          warehouse {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_IDS = gql`
  query GetProductIds {
    products {
      id
    }
  }
`;

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

export * from './mutations';
export * from './queries';
export * from './cart';