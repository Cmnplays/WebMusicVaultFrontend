import { configureStore } from "@reduxjs/toolkit";

import songSlice from "../reduxSlices/song/songSlice";
const store = configureStore({
  reducer: {
    song: songSlice,
  },
  devTools: true,
});

export default store;
