import {gql} from '@apollo/client';

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
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
      variants {
        id
        sku
        color
        size
        prices {
          id
          price
          validFrom
          validTo
        }
      }
      images {
        id
        url
      }
    }
  }
`;

export const CREATE_PRODUCT_CLIENT = gql`
  mutation CreateProductClient($createProductInput: CreateProductInput!) {
    createProduct(createProductInput: $createProductInput) {
      id
      name
      description
      brand {
        id
        name
      }
      variants {
        id
        sku
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