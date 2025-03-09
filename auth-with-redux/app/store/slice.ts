import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  authToken: string | null;
}

const initialState: AuthState = {
  authToken: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials, { withCredentials: true });
      return response.data.authToken;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/refresh", {}, { withCredentials: true });
      dispatch(setAuthToken(response.data.authToken));
      return response.data.authToken;
    } catch (error: any) {
      dispatch(logout());
      return rejectWithValue(error.response?.data || "Token refresh failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      await axios.post("/api/auth/register", credentials);
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.authToken = null;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authToken = action.payload;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.authToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.authToken = null;
      });
  },
});

export const { logout, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
