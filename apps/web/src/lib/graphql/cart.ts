import {gql} from '@apollo/client';

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
  mutation ClearCart($id: ID!) {
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