import { Middleware } from "@reduxjs/toolkit";
import { refreshAccessToken, logout } from "./slice";
import axios from "axios";

const authMiddleware: Middleware = (store) => (next) => async (action:any) => {
  if (action.type === "auth/refresh/rejected") {
    console.error("🔴 Refresh token expired, logging out...");
    store.dispatch(logout());
  }

  return next(action);
};

export default authMiddleware;
