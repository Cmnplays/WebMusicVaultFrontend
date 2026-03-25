import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  user: UserProfileI | null;
  accessToken: string | null;
  shouldFetchUser: boolean;
  shouldAccessAuthLayer: boolean;
}

const initialState: initialStateType = {
  user: null,
  accessToken: null,
  shouldFetchUser: true,
  shouldAccessAuthLayer: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (
      state,
      action: PayloadAction<{ user: UserProfileI; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    login: (
      state,
      action: PayloadAction<{ user: UserProfileI; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserProfileI>) => {
      state.user = action.payload;
    },
    setShouldFetchUser: (state, action: PayloadAction<boolean>) => {
      state.shouldFetchUser = action.payload;
    },
    toggleShouldAccessAuthLayer: (state, action: PayloadAction<boolean>) => {
      state.shouldAccessAuthLayer = action.payload;
    }
  }
});

export const {
  login,
  clearAuth,
  signup,
  setAccessToken,
  setUserData,
  setShouldFetchUser,
  toggleShouldAccessAuthLayer,
} = authSlice.actions;
export default authSlice.reducer;
