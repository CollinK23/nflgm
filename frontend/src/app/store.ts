import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { persistedUserReducer } from "../features/user/userSlice";

export const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use the persisted reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // redux-persist writes non-serializable values (like Promises) to storage
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
