import { configureStore } from "@reduxjs/toolkit";
import reservationReducer from "./reservationSlice";
import storageSession from "redux-persist/lib/storage/session";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const persistConfig = {
  key: "reservation",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, reservationReducer);

export const store = configureStore({
  reducer: {
    reservation: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
