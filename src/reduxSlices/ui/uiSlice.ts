// redux/slices/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  loading: boolean;
  downloading: boolean;
  deleting: boolean;
  statusText: string;
  mountDeleteConfirmation: boolean;
  mountDownloadConfirmation: boolean;
  mountShareModal: boolean;
  mountAuthPromptModal: boolean;
  navHeight: number;
}

const initialState: UIState = {
  loading: false,
  downloading: false,
  deleting: false,
  statusText: "",
  mountDeleteConfirmation: false,
  mountDownloadConfirmation: false,
  mountShareModal: false,
  mountAuthPromptModal: false,
  navHeight: 0,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDownloading: (state, action: PayloadAction<boolean>) => {
      state.downloading = action.payload;
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.deleting = action.payload;
    },
    setStatusText: (state, action: PayloadAction<string>) => {
      state.statusText = action.payload;
    },
    setMountDeleteConfirmation: (state, action: PayloadAction<boolean>) => {
      state.mountDeleteConfirmation = action.payload;
    },
    setMountDownloadConfirmation: (state, action: PayloadAction<boolean>) => {
      state.mountDownloadConfirmation = action.payload;
    },
    setMountShareModal: (state, action: PayloadAction<boolean>) => {
      state.mountShareModal = action.payload;
    },
    setMountAuthPromptModal: (state, action: PayloadAction<boolean>) => {
      state.mountAuthPromptModal = action.payload;
    },
    setNavHeight: (state, action: PayloadAction<number>) => {
      state.navHeight = action.payload;
    },
  },
});

export const {
  setLoading,
  setDownloading,
  setDeleting,
  setStatusText,
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
  setMountShareModal,
  setMountAuthPromptModal,
  setNavHeight,
} = uiSlice.actions;

export default uiSlice.reducer;
