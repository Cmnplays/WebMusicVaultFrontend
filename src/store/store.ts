import { configureStore } from "@reduxjs/toolkit";

import songSlice from "../reduxSlices/song/songSlice";
const store = configureStore({
  reducer: {
    song: songSlice,
  },
  devTools: true,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
