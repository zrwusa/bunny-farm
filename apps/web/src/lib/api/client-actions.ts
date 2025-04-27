import { objToGraphQLString } from '@/utils';
import { Product } from '@/types/generated/graphql';
import { fetchGraphQL } from './graphql-fetch';
import { Mutation, Query, LoginInput, CreateUserInput } from '@/types/generated/graphql';
import { ME_QUERY } from '@/lib/graphql';
import { GOOGLE_LOGIN, LOGOUT, CREATE_PRODUCT_CLIENT, REGISTER, LOCAL_LOGIN } from '@/lib/graphql/mutations';
import { setStoredTokens } from './auth';

export const createProductClient = async (prevState: Product, formData: FormData) => {
    const formEntries = Object.fromEntries(formData.entries());
    const product = {
        ...prevState,
        ...formEntries,
        price: Number(formEntries.price)
    } as Product;
    const response = await fetchGraphQL<Mutation>(CREATE_PRODUCT_CLIENT.loc?.source.body || '', {
        variables: {
            createProductInput: product
        }
    });

    const { createProduct } = response.data || {};
    if (!createProduct?.id) return product;
    return createProduct;
}

export const getMe = async () => {
    const response = await fetchGraphQL<Query>(ME_QUERY.loc?.source.body || '');
    return response.data?.me;
};

export const googleLogin = async (loginInput: LoginInput) => {
    const response = await fetchGraphQL<Mutation>(GOOGLE_LOGIN.loc?.source.body || '', {
        variables: { input: loginInput }
    });
    return response.data?.login;
};

export const logout = async () => {
    const response = await fetchGraphQL<Mutation>(LOGOUT.loc?.source.body || '');
    if (response.data?.logout) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
    return response.data?.logout;
};

export const register = async (createUserInput: CreateUserInput) => {
    const response = await fetchGraphQL<Mutation>(REGISTER.loc?.source.body || '', {
        variables: { createUserInput }
    });
    return response.data?.createUser;
};

export async function localLogin(email: string, password: string) {
  try {
    const { data } = await fetchGraphQL<{ login: { accessToken: string; refreshToken: string } }>(
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
      setStoredTokens(data.login.accessToken, data.login.refreshToken);
      return data.login;
    }

    // TODO find the best approach to handle error properly
    throw new Error('Login failed');
  } catch (error) {
    throw error;
  }
}