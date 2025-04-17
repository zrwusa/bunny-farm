import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import { CartSession } from '@/types/generated/graphql';

interface CartState {
    cartSession: CartSession | null;
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    cartSession: null,
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCartSession: (state, action: PayloadAction<CartSession>) => {
            state.cartSession = action.payload;
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
            state.cartSession = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {setCartSession, setLoading, setError, clearCart} = cartSlice.actions;
export default cartSlice.reducer;