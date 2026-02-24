import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../services/song.services";
export type repeatType = "repeat" | "noRepeat" | "single";
interface initialStateType {
  //only add the states which is to be shared in other file/files, other wise use it as a normal use state not as redux state
  songs: Song[];
  tempSongs: Song[];
  loading: boolean;
  duration: number;
  currentTime: number;
  playing: boolean;
  panelTrigger: number;
  panelOpen: boolean;
  downloading: boolean;
  deleting: boolean;
  mountDeleteConfirmation: boolean;
  mountDownloadConfirmation: boolean;
  mountShareModal: boolean;
  statusText: string;
  repeat: repeatType;
  shuffle: boolean;
  playingSong: Song | null;
  sortChanged: boolean;
  sortOrder: sortOrderT;
  sortBy: sortByT;
  hasMoreSongs: boolean;
  tempHasMoreSongs: boolean;
  nextCursor: cursorT;
  tempNextCursor: string | undefined;
  triggerFetch: boolean;
  tempTriggerFetch: boolean;
  navHeight: number;
}
const initialState: initialStateType = {
  songs: [],
  tempSongs: [],
  loading: false,
  duration: 0,
  currentTime: 0,
  playing: false,
  panelTrigger: 0,
  panelOpen: false,
  downloading: false,
  deleting: false,
  mountDeleteConfirmation: false,
  mountDownloadConfirmation: false,
  mountShareModal: false,
  statusText: "",
  repeat: "repeat",
  shuffle: false,
  playingSong: null,
  sortChanged: false,
  sortOrder: "asc",
  sortBy: "createdAt",
  hasMoreSongs: true,
  tempHasMoreSongs: true,
  nextCursor: undefined,
  tempNextCursor: undefined,
  triggerFetch: false,
  tempTriggerFetch: false,
  navHeight: 0,
};

const setSongsFn =
  (key: "songs" | "tempSongs") =>
  (state: initialStateType, action: PayloadAction<Song[]>) => {
    if (state[key].length === 0) {
      state[key] = action.payload;
    } else {
      const allSongs = [...state[key], ...action.payload];
      const uniqueSongMap = new Map<string, Song>();

      allSongs.forEach((song: Song) => {
        uniqueSongMap.set(song._id, song);
      });

      const finalSongs = Array.from(uniqueSongMap.values());
      state[key] = finalSongs;
    }
  };

const deleteSongFn =
  (key: "songs" | "tempSongs") =>
  (state: initialStateType, action: PayloadAction<string>) => {
    state[key] = state[key].filter((song) => song._id !== action.payload);
  };

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSongs: setSongsFn("songs"),
    setTempSongs: setSongsFn("tempSongs"),
    replaceTempSongs: (state, action: PayloadAction<Song[]>) => {
      state.tempSongs = action.payload;
    },
    handleSortByChange: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDownloading: (state, action: PayloadAction<boolean>) => {
      state.downloading = action.payload;
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
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
    setPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.panelOpen = action.payload;
    },
    setRepeat: (state, action: PayloadAction<repeatType>) => {
      state.repeat = action.payload;
    },
    setShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStatusText: (state, action: PayloadAction<string>) => {
      state.statusText = action.payload;
    },
    setDeleting: (state, action: PayloadAction<boolean>) => {
      state.deleting = action.payload;
    },
    setPlayingSong: (state, action: PayloadAction<Song | null>) => {
      state.playingSong = action.payload;
    },

    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setPanelTrigger: (state) => {
      state.panelTrigger = state.panelTrigger + 1;
    },
    setSortChanged: (state, action: PayloadAction<boolean>) => {
      state.sortChanged = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<sortOrderT>) => {
      state.sortOrder = action.payload;
    },
    setSortBy: (state, action: PayloadAction<sortByT>) => {
      state.sortBy = action.payload;
    },
    deleteSong: deleteSongFn("songs"),
    deleteTempSong: deleteSongFn("tempSongs"),
    setHasMoreSongs: (state, action: PayloadAction<boolean>) => {
      state.hasMoreSongs = action.payload;
    },
    setTempHasMoreSongs: (state, action: PayloadAction<boolean>) => {
      state.tempHasMoreSongs = action.payload;
    },
    setNextCursor: (state, action: PayloadAction<cursorT>) => {
      state.nextCursor = action.payload;
    },
    setTempNextCursor: (state, action: PayloadAction<string | undefined>) => {
      state.tempNextCursor = action.payload;
    },
    setTriggerFetch: (state) => {
      state.triggerFetch = !state.triggerFetch;
    },
    settempTriggerFetch: (state) => {
      state.tempTriggerFetch = !state.tempTriggerFetch;
    },
    setNavHeight: (state, action: PayloadAction<number>) => {
      state.navHeight = action.payload;
    },
  },
});
export const {
  setSongs,
  setTempSongs,
  replaceTempSongs,
  setCurrentTime,
  setDownloading,
  setMountDeleteConfirmation,
  setMountDownloadConfirmation,
  setMountShareModal,
  setPanelOpen,
  setRepeat,
  setShuffle,
  setLoading,
  setStatusText,
  setPlaying,
  setPlayingSong,
  setDuration,
  setPanelTrigger,
  setDeleting,
  handleSortByChange,
  setSortChanged,
  setSortOrder,
  setSortBy,
  deleteSong,
  deleteTempSong,
  setHasMoreSongs,
  setTempHasMoreSongs,
  setNextCursor,
  setTempNextCursor,
  setTriggerFetch,
  settempTriggerFetch,
  setNavHeight,
} = songSlice.actions;
export default songSlice.reducer;
