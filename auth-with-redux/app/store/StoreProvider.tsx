"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, AppDispatch, RootState } from "./store";
import { refreshAccessToken } from "./slice";

const TokenAutoRefresher = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authToken = useSelector((state: RootState) => state.auth.authToken);

  useEffect(() => {
    if (!authToken) return;

    const refreshInterval = setInterval(() => {
      dispatch(refreshAccessToken()).unwrap().catch(() => {});
    }, 10 * 60 * 1000); // Refresh every 10 minutes

    return () => clearInterval(refreshInterval);
  }, [authToken, dispatch]);

  return null;
};

const AuthInitializer = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshAccessToken()).unwrap().catch(() => {});
  }, [dispatch]);

  return null;
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <TokenAutoRefresher />
      {children}
    </Provider>
  );
};
