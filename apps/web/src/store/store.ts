import {configureStore} from '@reduxjs/toolkit';
import {apiStateReducer} from './slices';

const store = configureStore({
    reducer: {
        apiState: apiStateReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;