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
  query cart($clientCartId: String) {
    cart(clientCartId: $clientCartId) {
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