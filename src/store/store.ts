import { configureStore } from "@reduxjs/toolkit";

import songSlice from "@/reduxSlices/song/songSlice";
import authSlice from "@/reduxSlices/auth/authSlice";
const store = configureStore({
  reducer: {
    song: songSlice,
    auth: authSlice,
  },
  devTools: true,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
