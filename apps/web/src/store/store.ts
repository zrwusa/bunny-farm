import {configureStore} from '@reduxjs/toolkit';
import {apiStateReducer, authReducer, productReducer} from './slices';
import cartReducer from './slices/cartSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        product: productReducer,
        apiState: apiStateReducer,
        cart: cartReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;