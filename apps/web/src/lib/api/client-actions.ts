import {
    CreatePaymentIntentInput, CreateUserAddressInput,
    CreateUserInput,
    LoginInput,
    Mutation,
    PlaceOrderInput,
    Product,
    Query
} from '@/types/generated/graphql';
import {fetchAuthGraphQL} from './client-graphql-fetch';
import {
    ADD_MY_ADDRESS,
    CREATE_PAYMENT_INTENT,
    CREATE_PRODUCT_CLIENT,
    GET_ADDRESS_DETAIL,
    GET_MY_ADDRESSES,
    GET_ORDER,
    GET_SELECTED_CART_ITEMS,
    GOOGLE_LOGIN,
    LOCAL_LOGIN,
    LOGOUT,
    ME_QUERY,
    PLACE_ORDER,
    REGISTER
} from '@/lib/graphql';
import {setStoredTokens} from '../auth/client-auth';
import {GraphQLResponse} from '@/types/graphql';

const handleGraphQLErrors = (response: GraphQLResponse<Mutation | Query>) => {
    if (response.errors) throw new Error(response.errors.map((e) => e.message).join(';'))
}
export const createProductClient = async (prevState: Product, formData: FormData) => {
    const formEntries = Object.fromEntries(formData.entries());
    const product = {
        ...prevState,
        ...formEntries,
        price: Number(formEntries.price)
    } as Product;
    const response = await fetchAuthGraphQL<Mutation>(CREATE_PRODUCT_CLIENT.loc?.source.body || '', {
        variables: {
            createProductInput: product
        }
    });

    const {createProduct} = response.data || {};
    if (!createProduct?.id) return product;
    return createProduct;
}

export const getMe = async () => {
    const response = await fetchAuthGraphQL<Query>(ME_QUERY.loc?.source.body || '');
    handleGraphQLErrors(response);
    return response.data?.me;
};

export const googleLogin = async (loginInput: LoginInput) => {
    const response = await fetchAuthGraphQL<Mutation>(GOOGLE_LOGIN.loc?.source.body || '', {
        variables: {input: loginInput}
    });
    handleGraphQLErrors(response);
    return response.data?.login;
};

export const logout = async () => {
    const response = await fetchAuthGraphQL<Mutation>(LOGOUT.loc?.source.body || '');
    handleGraphQLErrors(response);
    if (response.data?.logout) {
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
    }
    return response.data?.logout;
};

export const register = async (createUserInput: CreateUserInput) => {
    const response = await fetchAuthGraphQL<Mutation>(REGISTER.loc?.source.body || '', {
        variables: {createUserInput}
    });
    handleGraphQLErrors(response);
    return response.data?.createUser;
};

export async function localLogin(email: string, password: string) {
    try {
        const {data} = await fetchAuthGraphQL<{ login: { accessToken: string; refreshToken: string } }>(
            LOCAL_LOGIN.loc?.source.body || '',
            {
                variables: {
                    input: {
                        email,
                        password,
                        type: 'local',
                    },
                },
            }
        );

        if (data?.login) {
            await setStoredTokens(data.login.accessToken, data.login.refreshToken);
            return data.login;
        }

        // TODO find the best approach to handle error properly
        throw new Error('Login failed');
    } catch (error) {
        throw error;
    }
}

export const getSelectedCartItems = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_SELECTED_CART_ITEMS.loc?.source.body, {
        variables: {}
    });
    handleGraphQLErrors(response);
    return response.data?.selectedCartItems ?? [];
}

export const getMyAddresses = async () => {
    const response = await fetchAuthGraphQL<Query>(GET_MY_ADDRESSES.loc?.source.body, {
        variables: {}
    });
    handleGraphQLErrors(response);
    return response.data?.myAddresses ?? [];
}

export const getAddressDetail = async (addressText: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ADDRESS_DETAIL.loc?.source.body, {
        variables: {
            address: addressText
        }
    });
    handleGraphQLErrors(response);
    return response.data?.placeDetail;
}

export const addMyAddress = async (createUserAddressInput: CreateUserAddressInput) => {
    const response = await fetchAuthGraphQL<Mutation>(ADD_MY_ADDRESS.loc?.source.body, {
        variables: {
            input: createUserAddressInput
        }
    });
    handleGraphQLErrors(response);
    return response.data?.addMyAddress;
}

export const placeOrder = async (placeOrderInput: PlaceOrderInput) => {
    const response = await fetchAuthGraphQL<Mutation>(PLACE_ORDER.loc?.source.body, {
        variables: {placeOrderInput: placeOrderInput}
    });
    handleGraphQLErrors(response);
    return response.data?.placeOrder;
}

export const getOrder = async (id: string) => {
    const response = await fetchAuthGraphQL<Query>(GET_ORDER.loc?.source.body, {
        variables: {id}
    });
    handleGraphQLErrors(response);
    return response.data?.order;
}

export const createPaymentIntent = async (createPaymentIntentInput: CreatePaymentIntentInput) => {
    const response = await fetchAuthGraphQL<Mutation>(CREATE_PAYMENT_INTENT.loc?.source.body, {
        variables: {createPaymentIntentInput: createPaymentIntentInput}
    });
    handleGraphQLErrors(response);
    return response.data?.createPaymentIntent;
}