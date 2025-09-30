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
  statusText: string;
  repeat: repeatType;
  shuffle: boolean;
  playingSong: Song | null;
  sortChanged: boolean;
  page: number;
  sortOrder: "asc" | "desc";
  hasMoreSongs: boolean;
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
  statusText: "loading more songs...",
  repeat: "repeat",
  shuffle: false,
  playingSong: null,
  sortChanged: false,
  page: 1,
  sortOrder: "asc",
  hasMoreSongs: true,
};
const setSongsFn =
  (key: "songs" | "tempSongs") =>
  (state: initialStateType, action: PayloadAction<Song[]>) => {
    if (state.songs.length === 0) {
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
    incrPage: (state) => {
      state.page = state.page + 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
    deleteSong: (state, action: PayloadAction<string>) => {
      const filteredSongs = state.songs.filter(
        (song) => song._id !== action.payload
      );
      state.songs = filteredSongs;
    },
    setHasMoreSongs: (state, action: PayloadAction<boolean>) => {
      state.hasMoreSongs = action.payload;
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
  incrPage,
  setPage,
  setSortOrder,
  deleteSong,
  setHasMoreSongs,
} = songSlice.actions;
export default songSlice.reducer;
