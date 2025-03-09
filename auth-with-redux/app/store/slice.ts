import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  authToken: string | null;
  email: string | null;
}

const initialState: AuthState = {
  authToken: null,
  email: null,
};

// **Login Thunk**
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/login", credentials);
      return response.data; // { authToken, email }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

// **Refresh Token Thunk**
export const refreshAccessToken = createAsyncThunk(
  "auth/refresh",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/refresh");

      dispatch(setAuthToken(response.data.authToken)); // Store new access token
      return response.data;
    } catch (error: any) {
      dispatch(logout());
      return rejectWithValue(error.response?.data || "Token refresh failed");
    }
  }
);

// **Check for persisted auth session**
export const persistedAuthCheck = createAsyncThunk(
  "auth/check",
  async (_, { dispatch }) => {
    await dispatch(refreshAccessToken()); // Try to refresh auth token
  }
);

// **Register User Thunk**
export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", credentials);
      return response.data; // { email }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// **Auth Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.authToken = null;
      state.email = null;
    },
    setAuthToken: (state, action) => {
      state.authToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.authToken = action.payload.authToken;
      state.email = action.payload.email;
    });

    builder.addCase(refreshAccessToken.fulfilled, (state, action) => {
      state.authToken = action.payload.authToken;
    });

    builder.addCase(refreshAccessToken.rejected, (state) => {
      state.authToken = null;
      state.email = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.email = action.payload.email;
    });
  },
});

// **Export Actions & Reducer**
export const { logout, setAuthToken } = authSlice.actions;
export default authSlice.reducer;
