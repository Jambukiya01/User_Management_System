import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import authReducer from "./authSlice";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

const persistConfigUser = {
    key: "users",
    storage: AsyncStorage,
};

const persistConfigAuth = {
    key: "auth",
    storage: AsyncStorage,
};

const persistedUserReducer = persistReducer(persistConfigUser, userReducer);
const persistedAuthReducer = persistReducer(persistConfigAuth, authReducer);

export const store = configureStore({
    reducer: {
        users: persistedUserReducer,
        auth: persistedAuthReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),

});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;