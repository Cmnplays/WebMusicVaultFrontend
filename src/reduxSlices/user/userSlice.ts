import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface User {
  username: string;
  password: string;
}
interface initialState {
  details: User;
  isLoggedIn: boolean;
}

const initialState: initialState = {
  details: {
    username: "",
    password: "",
  },
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.details.username = action.payload.username;
      state.details.password = action.payload.password;
      state.isLoggedIn = true;
    },
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
