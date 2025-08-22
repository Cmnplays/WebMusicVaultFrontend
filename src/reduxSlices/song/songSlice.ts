import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../services/song.services";
import type { repeatType } from "../../pages/MusicPage";
interface initialStateType {
  //only add the states which is to be shared in other file/files, other wise use it as a normal use state not as redux state
  songs: Song[];
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
}
const initialState: initialStateType = {
  songs: [],
  loading: false,
  duration: 0,
  currentTime: 0,
  playing: false,
  panelTrigger: 0,
  panelOpen: false,
  downloading: false,
  deleting: false,
  mountDeleteConfirmation: false,
  statusText: "status more songs...",
  repeat: "repeat",
  shuffle: false,
  playingSong: null,
  sortChanged: false,
  page: 1,
  sortOrder: "asc",
};

const songSlice = createSlice({
  name: "song",
  initialState,
  reducers: {
    setSongs: (state, action: PayloadAction<Song[]>) => {
      if (state.songs.length === 0) {
        state.songs = action.payload;
      } else {
        const allSongs = [...state.songs, ...action.payload];
        const uniqueSongMap = new Map<string, Song>();

        allSongs.forEach((song: Song) => {
          uniqueSongMap.set(song._id, song);
        });

        const finalSongs = Array.from(uniqueSongMap.values());
        state.songs = finalSongs;
      }
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
  },
});
export const {
  setSongs,
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
} = songSlice.actions;
export default songSlice.reducer;
