import {gql} from '@apollo/client';
import {LoginInput} from '@/types/generated/graphql';

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

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      description
      images {
        id
        url
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
          validFrom
          validTo
        }
      }
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
          validFrom
          validTo
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

export const GET_MY_CART = gql`
  query GetMyCart($sessionId: String) {
    myCart(sessionId: $sessionId) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CART = gql`
  mutation CreateCart($createCartInput: CreateCartInput!, $sessionId: String) {
    createCart(createCartInput: $createCartInput, sessionId: $sessionId) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($updateCartInput: UpdateCartInput!) {
    updateCart(updateCartInput: $updateCartInput) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($id: String!) {
    clearCart(id: $id) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        createdAt
        updatedAt
      }
      user {
        id
        username
        email
      }
      createdAt
      updatedAt
    }
  }
`;

export const SUGGEST_PRODUCT_NAMES = gql`
  query SuggestProductNames($input: String!) {
    suggestProductNames(input: $input)
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
          validFrom
          validTo
        }
      }
    }
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      profile {
        avatarUrl
        displayName
      }
    }
  }
`;

export const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;