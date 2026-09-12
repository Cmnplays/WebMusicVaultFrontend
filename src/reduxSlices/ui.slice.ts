// redux/slices/uiSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../services/song.services";
import type { Playlist } from "../services/playlist.services";

interface UIState {
  loading: boolean;
  downloading: boolean;
  downloadProgress: number | null;
  downloadTitle: string | null;
  deleting: boolean;
  statusText: string;
  mountDeleteConfirmation: boolean;
  mountDownloadConfirmation: boolean;
  mountShareModal: boolean;
  mountAuthPromptModal: boolean;
  navHeight: number;
  mountEditSongModal: boolean;
  mountCreatePlaylistModal: boolean;
  mountAddToPlaylistModal: boolean;
  actionSong: Song | null;
  actionPlaylist: Playlist | null;
  mountEditPlaylistModal: boolean;
  authPromptText: string;
}

const initialState: UIState = {
  loading: false,
  downloading: false,
  downloadProgress: null,
  downloadTitle: null,
  deleting: false,
  statusText: "",
  mountDeleteConfirmation: false,
  mountDownloadConfirmation: false,
  mountShareModal: false,
  mountAuthPromptModal: false,
  authPromptText: "like",
  navHeight: 0,
  mountEditSongModal: false,
  mountCreatePlaylistModal: false,
  mountAddToPlaylistModal: false,
  actionSong: null,
  actionPlaylist: null,
  mountEditPlaylistModal: false,
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
    // A download session begins: flip the global flag (disables every other
    // download button) and remember what is being downloaded for the card.
    startDownload: (state, action: PayloadAction<string>) => {
      state.downloading = true;
      state.downloadTitle = action.payload;
      state.downloadProgress = 0;
    },
    setDownloadProgress: (state, action: PayloadAction<number>) => {
      state.downloadProgress = action.payload;
    },
    finishDownload: (state) => {
      state.downloading = false;
      state.downloadProgress = null;
      state.downloadTitle = null;
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
    setMountEditSongModal: (state, action: PayloadAction<boolean>) => {
      state.mountEditSongModal = action.payload;
    },
    setMountCreatePlaylistModal: (state, action: PayloadAction<boolean>) => {
      state.mountCreatePlaylistModal = action.payload;
    },
    setMountAddToPlaylistModal: (state, action: PayloadAction<boolean>) => {
      state.mountAddToPlaylistModal = action.payload;
    },
    setMountEditPlaylistModal: (state, action: PayloadAction<boolean>) => {
      state.mountEditPlaylistModal = action.payload;
    },
    setActionSong: (state, action: PayloadAction<Song | null>) => {
      state.actionSong = action.payload;
    },
    setActionPlaylist: (state, action: PayloadAction<Playlist | null>) => {
      state.actionPlaylist = action.payload;
    },
    setAuthPromptString: (state, action: PayloadAction<string>) => {
      state.authPromptText = action.payload;
    },
  },
});

export const {
  setLoading,
  setDownloading,
  setDownloadProgress,
  startDownload,
  finishDownload,
  setDeleting,
  setStatusText,
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
  setMountShareModal,
  setMountAuthPromptModal,
  setNavHeight,
  setMountEditSongModal,
  setMountCreatePlaylistModal,
  setMountAddToPlaylistModal,
  setMountEditPlaylistModal,
  setActionSong,
  setActionPlaylist,
  setAuthPromptString,
} = uiSlice.actions;

export default uiSlice.reducer;
