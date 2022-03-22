import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../redux/reducers';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import hardSet from 'redux-persist/es/stateReconciler/hardSet';

const loggerMiddleware = createLogger();

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['authentication'],
    stateReconciler: hardSet,
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