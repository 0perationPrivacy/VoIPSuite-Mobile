import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../redux/reducers';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const loggerMiddleware = createLogger();

const persistConfig = {
    key: 'root',
    storage : AsyncStorage,
    whitelist: ['authentication'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
    // rootReducer,
    persistedReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
let persistor = persistStore(store)
export { store, persistor }