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

export const GET_MY_ADDRESSES = gql`
    query GetMyAddresses {
        myAddresses {
            id
            isDefault
            addressLine1
            addressLine2
            postalCode
            city
            country
        }
    }
`

export const GET_ADDRESS_DETAIL = gql`
    query PlaceDetail($address: String!) {
        placeDetail(address: $address) {
            components {
                suburb
                city
                country
                continent
                country_code
                postcode
                road
                state_code
            }
        }
    }
`
export const GET_SELECTED_CART_ITEMS = gql`
    query GetSelectedCartItems {
        selectedCartItems {
            skuId
            productId
            quantity
            selected
            product {
                name
                images {
                    url
                }
            }
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


export const GET_ORDER = gql`
    query GetOrder($id: String!) {
        order(id: $id) {
            id
            totalPrice
            paymentMethod
            shippingStatus
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

export const TOGGLE_ITEM_SELECTION = gql`
    mutation ToggleItemSelection($toggleItemSelectionInput: ToggleItemSelectionInput!) {
        toggleItemSelection(toggleItemSelection: $toggleItemSelectionInput) {
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
    mutation RemoveItems($removeItemsInput: RemoveItemsInput!) {
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
            id
            totalPrice
            paymentMethod
            shippingStatus
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
    mutation CreatePaymentIntent($createPaymentIntentInput: CreatePaymentIntentInput!) {
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