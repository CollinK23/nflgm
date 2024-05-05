import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
