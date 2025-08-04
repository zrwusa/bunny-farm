import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {fetchAuthGraphQL} from '@/lib/api/client-graphql-fetch';
import {Query} from '@/types/generated/graphql';


export const fetchData = createAsyncThunk(
    'fetchData',
    async ({requestInit, requestKey}: {
        requestInit: RequestInit & { body: string; },
        requestKey: string
    }, thunkAPI) => {
        const response = await fetchAuthGraphQL<Query>(requestInit.body, {
            variables: JSON.parse(requestInit.body).variables
        });
        if (response.errors && response.errors.length > 0) {
            return thunkAPI.rejectWithValue(response.errors);
        }
        return {requestKey, data: response.data};
    }
);

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