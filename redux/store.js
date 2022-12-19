import { configureStore } from "@reduxjs/toolkit";
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../redux/reducers';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['authentication', 'profile', 'settings'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

let store = configureStore({
    reducer: persistedReducer,
    // devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunkMiddleware]
});

let persistor = persistStore(store)
export { store, persistor }