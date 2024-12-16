import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice"; // Adjust the path if needed
import { apiYmir } from "./apiYmir";
import { thunk } from "redux-thunk";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [apiYmir.reducerPath]: apiYmir.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: true,
    }).concat([apiSlice.middleware, apiYmir.middleware, thunk]),
});
