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

export const GET_MY_CART = gql`
  query GetMyCart {
    myCart {
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
  mutation CreateCart($createCartInput: CreateCartInput!) {
    createCart(createCartInput: $createCartInput) {
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