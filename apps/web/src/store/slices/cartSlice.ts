import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {CachedCart} from '@/types/generated/graphql';

interface CartState {
    cart: CachedCart | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cart: null,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartSession: (state, action: PayloadAction<CachedCart>) => {
            state.cart = action.payload;
            state.loading = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        },
        clearCart: (state) => {
            state.cart = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {setCartSession, setLoading, setError, clearCart} = cartSlice.actions;
export default cartSlice.reducer;