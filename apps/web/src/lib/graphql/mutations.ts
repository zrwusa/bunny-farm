import {gql} from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      price
      name
      brand {
        id
        name
      }
      description
    }
  }
`;

export const CREATE_PRODUCT_CLIENT = gql`
  mutation CreateProductClient($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      price
      name
      brand
      description
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

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;