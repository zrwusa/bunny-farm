import {gql} from '@apollo/client';
import {LoginInput} from '@/types/generated/graphql';

export const GET_PRODUCTS = gql`
    query getProducts {
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
            category {
                id
                name
            }
            variants {
                id
                prices {
                    price
                }
            }
        }
    }
`;

export const SEARCH_PRODUCTS = gql`
    query searchProducts($keyword: String!) {
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
    query suggestProductNames($input: String!) {
        suggestProductNames(input: $input) 
    }
`;

export const GET_PRODUCT_BY_ID = gql`
    query GetProduct($id: String!) {
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

export const GOOGLE_LOGIN = gql`
    mutation googleLogin($loginInput: LoginInput!) {
        login(input: $loginInput) {
            accessToken
            refreshToken
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

export const GET_PRODUCTS_PURE = `query {
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
`