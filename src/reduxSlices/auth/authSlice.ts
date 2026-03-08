import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  user: UserI | null;
  accessToken: string | null;
}

const initialState: initialStateType = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signup: (
      state,
      action: PayloadAction<{ user: UserI; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    login: (
      state,
      action: PayloadAction<{ user: UserI; accessToken: string }>,
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
    setUserData: (state, action: PayloadAction<UserI>) => {
      state.user = action.payload;
    },
  },
});

export const { login, clearAuth, signup, setAccessToken, setUserData } =
  authSlice.actions;
export default authSlice.reducer;
