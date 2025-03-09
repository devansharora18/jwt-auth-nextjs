import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice";
import authMiddleware from "./middleware"; // Redux middleware (not Next.js middleware)

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }) // Prevents Redux warnings for non-serializable values
      .concat(authMiddleware), // Correctly attaches Redux middleware
});

// Typed versions of Redux state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
