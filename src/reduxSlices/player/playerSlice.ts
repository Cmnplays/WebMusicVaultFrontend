// redux/slices/playerSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../../services/song.services";

export type repeatType = "repeat" | "noRepeat" | "single";

interface PlayerState {
  playing: boolean;
  playingSong: Song | null;
  duration: number;
  currentTime: number;
  panelOpen: boolean;
  panelTrigger: number;
  repeat: repeatType;
  shuffle: boolean;
}

const initialState: PlayerState = {
  playing: false,
  playingSong: null,
  duration: 0,
  currentTime: 0,
  panelOpen: false,
  panelTrigger: 0,
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
    setPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.panelOpen = action.payload;
    },
    setPanelTrigger: (state) => {
      state.panelTrigger += 1;
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
  setPanelOpen,
  setPanelTrigger,
  setRepeat,
  setShuffle,
} = playerSlice.actions;

export default playerSlice.reducer;
