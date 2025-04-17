import {gql} from '@apollo/client';

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