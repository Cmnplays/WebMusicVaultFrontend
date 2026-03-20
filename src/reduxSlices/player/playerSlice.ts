// redux/slices/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../services/song.services";

export type repeatType = "repeat" | "noRepeat" | "single";

interface PlayerState {
  playing: boolean;
  playingSong: Song | null;
  duration: number;
  currentTime: number;
  expandedPanelOpen: boolean;
  expandedPanelTrigger: number;
  miniPanelTrigger: number;
  miniPanelOpen: boolean;
  repeat: repeatType;
  shuffle: boolean;
}

const initialState: PlayerState = {
  playing: false,
  playingSong: null,
  duration: 0,
  currentTime: 0,
  expandedPanelOpen: false,
  expandedPanelTrigger: 0,
  miniPanelTrigger: 0,
  miniPanelOpen: false,
  repeat: "repeat",
  shuffle: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setPlayingSong: (state, action: PayloadAction<Song | null>) => {
      state.playingSong = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setExpandedPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.expandedPanelOpen = action.payload;
    },
    setExpandedPanelTrigger: (state) => {
      state.expandedPanelTrigger += 1;
    },
    setMiniPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.miniPanelOpen = action.payload;
    },
    setMiniPanelTrigger: (state) => {
      state.miniPanelTrigger += 1;
    },
    setRepeat: (state, action: PayloadAction<repeatType>) => {
      state.repeat = action.payload;
    },
    setShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
  },
});

export const {
  setPlaying,
  setPlayingSong,
  setDuration,
  setCurrentTime,
  setExpandedPanelOpen,
  setExpandedPanelTrigger,
  setRepeat,
  setShuffle,
  setMiniPanelOpen,
  setMiniPanelTrigger,
} = playerSlice.actions;

export default playerSlice.reducer;
