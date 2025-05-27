import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import {Product, User} from '@/types/generated/graphql';

// API State Slice
interface ApiState {
    loading: boolean;
    error: string | null;
}

const apiStateInitialState: ApiState = {
    loading: false,
    error: null,
};

const apiStateSlice = createSlice({
    name: 'apiState',
    initialState: apiStateInitialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {setLoading: setApiLoading, setError: setApiError} = apiStateSlice.actions;
export const apiStateReducer = apiStateSlice.reducer;

// Auth Slice
interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
}

const authInitialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState: authInitialState,
    reducers: {
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
    },
});

export const {setAuthenticated, setUser} = authSlice.actions;
export const authReducer = authSlice.reducer;

// Product Slice
interface ProductState {
    products: Product[];
    selectedProduct: Product | null;
}

const productInitialState: ProductState = {
    products: [],
    selectedProduct: null,
};

const productSlice = createSlice({
    name: 'product',
    initialState: productInitialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.products = action.payload;
        },
        setSelectedProduct: (state, action: PayloadAction<Product>) => {
            state.selectedProduct = action.payload;
        },
    },
});

export const {setProducts, setSelectedProduct} = productSlice.actions;
export const productReducer = productSlice.reducer;

// Export cart reducer
export {cartReducer};