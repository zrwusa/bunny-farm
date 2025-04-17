import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {requestKeys} from '@/lib/contants/request-keys';
import {fetchGraphQL, GraphQLResponse} from '@/lib/graphql-fetch';
import {Product} from '@/store/app';
import {Query} from '@/types/generated/graphql';

const authSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {}
});

export const authReducer = authSlice.reducer;

export const fetchData = createAsyncThunk(
    'fetchData',
    async ({url, requestInit, requestKey}: {
        url?: string,
        requestInit: RequestInit & { body: string; },
        requestKey: string
    }, thunkAPI) => {
        const response = await fetchGraphQL<Query>(requestInit.body, {
            variables: JSON.parse(requestInit.body).variables
        });
        if (response.errors && response.errors.length > 0) {
            return thunkAPI.rejectWithValue(response.errors);
        }
        return {requestKey, data: response.data};
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {products: [] as Product[]},
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.fulfilled, (state, action) => {
                if (action.payload.requestKey === requestKeys.FETCH_PRODUCTS)
                    state.products = action.payload.data.products;
            });
    },
});

export const productReducer = productSlice.reducer;

const apiStateSlice = createSlice({
    name: 'apiState',
    initialState: {
        loading: false,
        error: undefined,
    } as { loading: boolean, error?: string },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchData.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchData.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(fetchData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const apiStateReducer = apiStateSlice.reducer;