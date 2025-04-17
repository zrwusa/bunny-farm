import {configureStore} from '@reduxjs/toolkit';
import {apiStateReducer, authReducer, productReducer, cartReducer} from './slices';

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