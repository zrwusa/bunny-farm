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
      skus {
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
      images {
        id
        url
      }
    }
  }
`;

export const ADD_ITEM_TO_CART = gql`
  mutation addItemToCart($addItemToCartInput: AddItemToCartInput!) {
    addToCart(addItemToCartInput: $addItemToCartInput) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        product {
          name
          images {
            position
            url
          }
        }
        sku {
          size
          color
          images {
            position
            url
          }
        }
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

export const UPDATE_ITEM_QUANTITY = gql`
  mutation updateItemQuantity($updateItemQuantityInput: UpdateItemQuantityInput!) {
    updateItemQuantity(updateItemQuantityInput: $updateItemQuantityInput) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        product {
          name
          images {
            position
            url
          }
        }
        sku {
          size
          color
          images {
            position
            url
          }
        }
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

export const REMOVE_ITEM_FROM_CART = gql`
  mutation removeItems($removeItemsInput: RemoveItemsInput!) {
    removeItems(removeItemsInput: $removeItemsInput) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        product {
          name
          images {
            position
            url
          }
        }
        sku {
          size
          color
          images {
            position
            url
          }
        }
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

export const CLEAR_CART = gql`
  mutation ClearCart($clientCartId: String) {
    clearCart(clientCartId: $clientCartId) {
      id
      items {
        id
        productId
        skuId
        quantity
        selected
        product {
          name
          images {
            position
            url
          }
        }
        sku {
          size
          color
          images {
            position
            url
          }
        }
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
      skus {
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



export const PLACE_ORDER = gql`
  mutation PlaceOrder($placeOrderInput: PlaceOrderInput!) {
    placeOrder(input: $placeOrderInput) {
      items {
        id
        quantity
        sku {
          id
          skuCode
        }
      }
    }
  }
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation PlaceOrder($createPaymentIntentInput: CreatePaymentIntentInput!) {
    createPaymentIntent(createPaymentIntentInput: $createPaymentIntentInput)
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

export const REGISTER = gql`
  mutation Register($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      username
      email
    }
  }
`;

export const LOCAL_LOGIN = gql`
  mutation LocalLogin($input: LoginInput!) {
    login(input: $input) {
      accessToken
      refreshToken
    }
  }
`;