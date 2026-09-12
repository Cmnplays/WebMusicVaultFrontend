// redux/slices/songSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Song } from "../services/song.services";
import { login, signup, clearAuth } from "./auth.slice";
import {
  PlaylistsResponse,
  Playlist,
} from "@/services/playlist.services";

interface SongState {
  songs: Song[];
  tempSongs: Song[];
  pinnedSongs: Song[];
  hasMoreSongs: boolean;
  tempHasMoreSongs: boolean;
  nextCursor: cursorT | undefined;
  tempNextCursor: cursorT | string | undefined;
  triggerFetch: number;
  tempTriggerFetch: number;
  sortBy: sortByT;
  sortOrder: sortOrderT;
  sortChanged: boolean;
  tempSortBy: sortByT;
  tempSortOrder: sortOrderT;
  tempSortChanged: boolean;
  playlists: PlaylistsResponse;
  songsType: "songs" | "tempSongs";
  editableSong: editableSongT | null;
}

const initialState: SongState = {
  songs: [],
  tempSongs: [],
  pinnedSongs: [],
  hasMoreSongs: true,
  tempHasMoreSongs: true,
  nextCursor: undefined,
  tempNextCursor: undefined,
  triggerFetch: 0,
  tempTriggerFetch: 0,
  sortBy: "createdAt",
  sortOrder: "desc",
  sortChanged: false,
  tempSortBy: "relevance",
  tempSortOrder: "desc",
  tempSortChanged: false,
  playlists: {
    defaultPlaylists: [],
    personalPlaylists: [],
  },
  songsType: "songs",
  editableSong: null,
};

type setSongLikedByT = {
  songId: string;
  isLiked: boolean;
};

type songChangesT = Partial<{
  songId: string;
  title: string;
  artist: string;
  coverImageUrl: string | null;
  removeCoverImage?: boolean;
  isTemp?: boolean;
}>;

type editableSongT = Song & { isTemp?: boolean };
type songTypes = "songs" | "tempSongs";
const setSongsFn =
  (key: "songs" | "tempSongs") =>
    (state: SongState, action: PayloadAction<Song[]>) => {
      if (state[key].length === 0) {
        state[key] = action.payload;
      } else {
        const allSongs = [...state[key], ...action.payload];
        const uniqueSongMap = new Map<string, Song>();
        allSongs.forEach((song: Song) => uniqueSongMap.set(song._id, song));
        state[key] = Array.from(uniqueSongMap.values());
      }
    };


const likeSongFn =
  (key: "songs" | "tempSongs") =>
    (state: SongState, action: PayloadAction<setSongLikedByT>) => {
      const { songId, isLiked } = action.payload;
      const songIndex = state[key].findIndex((song) => song._id === songId);
      if (songIndex !== -1) state[key][songIndex].isLiked = isLiked;
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
    replaceSongs: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    handleSortByChange: (state, action: PayloadAction<Song[]>) => {
      state.songs = action.payload;
    },
    deleteSong: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.songs = state.songs.filter((song) => song._id !== id);
      state.tempSongs = state.tempSongs.filter((song) => song._id !== id);
      state.pinnedSongs = state.pinnedSongs.filter((song) => song._id !== id);
    },
    deleteTempSong: (state, action: PayloadAction<string>) => {
      state.tempSongs = state.tempSongs.filter(
        (song) => song._id !== action.payload,
      );
    },
    setSongLikedBy: likeSongFn("songs"),
    setTempSongLikedBy: likeSongFn("tempSongs"),
    setHasMoreSongs: (state, action: PayloadAction<boolean>) => {
      state.hasMoreSongs = action.payload;
    },
    setTempHasMoreSongs: (state, action: PayloadAction<boolean>) => {
      state.tempHasMoreSongs = action.payload;
    },
    setNextCursor: (state, action: PayloadAction<cursorT>) => {
      state.nextCursor = action.payload;
    },
    setTempNextCursor: (state, action: PayloadAction<cursorT | string>) => {
      state.tempNextCursor = action.payload;
    },
    setTriggerFetch: (state) => {
      state.triggerFetch += 1;
    },
    setTempTriggerFetch: (state) => {
      state.tempTriggerFetch += 1;
    },
    setSortBy: (state, action: PayloadAction<sortByT>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<sortOrderT>) => {
      state.sortOrder = action.payload;
    },
    setSortChanged: (state, action: PayloadAction<boolean>) => {
      state.sortChanged = action.payload;
    },
    setTempSortBy: (state, action: PayloadAction<sortByT>) => {
      state.tempSortBy = action.payload;
    },
    setTempSortOrder: (state, action: PayloadAction<sortOrderT>) => {
      state.tempSortOrder = action.payload;
    },
    setTempSortChanged: (state, action: PayloadAction<boolean>) => {
      state.tempSortChanged = action.payload;
    },
    setPlaylists: (state, action: PayloadAction<PlaylistsResponse>) => {
      state.playlists = action.payload;
    },
    updatePlaylist: (state, action: PayloadAction<Playlist>) => {
      const updated = action.payload;
      const index = state.playlists.personalPlaylists.findIndex(
        (p) => p._id === updated._id,
      );
      if (index !== -1) {
        const previous = state.playlists.personalPlaylists[index];
        state.playlists.personalPlaylists[index] = {
          ...previous,
          ...updated,
          // PUT /playlist/:id serializes `owner` as a bare ObjectId string
          // (not populated), which blanked the username shown on
          // PlaylistCard until the next full fetch. Keep the populated owner
          // unless the response genuinely ships a populated object.
          owner:
            updated.owner &&
            typeof updated.owner === "object" &&
            "username" in updated.owner
              ? updated.owner
              : previous.owner,
        };
      }
    },
    setSongsType: (state, action: PayloadAction<songTypes>) => {
      state.songsType = action.payload;
    },
    updatePlaylistSongCount: (
      state,
      action: PayloadAction<{ isLiked: boolean }>,
    ) => {
      const { isLiked } = action.payload;
      const likedSongsPlaylist = state.playlists.defaultPlaylists.find(
        (p) => p.isDefault,
      );
      if (likedSongsPlaylist) {
        likedSongsPlaylist.songs = Math.max(
          0,
          Number(likedSongsPlaylist.songs) + (isLiked ? 1 : -1),
        );
      }
    },
    incrementPlaylistSongCount: (state, action: PayloadAction<string>) => {
      const playlist = state.playlists.personalPlaylists.find(
        (p) => p._id === action.payload,
      );
      if (playlist) {
        playlist.songs = Number(playlist.songs) + 1;
      }
    },
    decrementPlaylistSongCount: (state, action: PayloadAction<string>) => {
      const playlist = state.playlists.personalPlaylists.find(
        (p) => p._id === action.payload,
      );
      if (playlist) {
        playlist.songs = Math.max(0, Number(playlist.songs) - 1);
      }
    },
    setEditableSong: (state, action: PayloadAction<editableSongT | null>) => {
      state.editableSong = action.payload;
    },
    updateSong: (state, action: PayloadAction<songChangesT>) => {
      const { songId, title, artist, coverImageUrl, removeCoverImage } =
        action.payload;
      const updateItem = (song: Song) => {
        if (title) song.title = title;
        if (artist) song.artist = artist;
        if (removeCoverImage || coverImageUrl === null || coverImageUrl === "") {
          song.coverImageUrl = undefined;
        } else if (coverImageUrl) {
          song.coverImageUrl = coverImageUrl;
        }
      };

      state.songs.filter((s) => s._id === songId).forEach(updateItem);
      state.tempSongs.filter((s) => s._id === songId).forEach(updateItem);
      state.pinnedSongs.filter((s) => s._id === songId).forEach(updateItem);
    },

    setPinnedSongs: (state, action: PayloadAction<Song[]>) => {
      state.pinnedSongs = action.payload;
    },
    pinSong: (state, action: PayloadAction<Song>) => {
      state.pinnedSongs.push(action.payload);
    },
    unpinSong: (state, action: PayloadAction<string>) => {
      state.pinnedSongs = state.pinnedSongs.filter(
        (song) => song._id !== action.payload,
      );
    },
  },
  extraReducers: (builder) => {
    const clearSongsState = (state: SongState) => {
      state.songs = [];
      state.tempSongs = [];
      state.hasMoreSongs = true;
      state.tempHasMoreSongs = true;
      state.nextCursor = undefined;
      state.tempNextCursor = undefined;
      state.triggerFetch = 0;
      state.tempTriggerFetch = 0;
      // Playlists belong to a specific user - stale cached playlists (e.g. a
      // guest's view with only the owner's favourites) must not survive a
      // login/logout, or the playlist page would keep showing them and never
      // refetch the authenticated list.
      state.playlists = { defaultPlaylists: [], personalPlaylists: [] };
    };

    builder
      .addCase(login, clearSongsState)
      .addCase(signup, clearSongsState)
      .addCase(clearAuth, clearSongsState);
  },
});

export const {
  setSongs,
  setTempSongs,
  replaceTempSongs,
  handleSortByChange,
  deleteSong,
  deleteTempSong,
  setSongLikedBy,
  setTempSongLikedBy,
  setHasMoreSongs,
  setTempHasMoreSongs,
  setNextCursor,
  setTempNextCursor,
  setTriggerFetch,
  setTempTriggerFetch,
  setSortBy,
  setSortOrder,
  setSortChanged,
  setTempSortBy,
  setTempSortChanged,
  setTempSortOrder,
  setPlaylists,
  updatePlaylist,
  setSongsType,
  updatePlaylistSongCount,
  incrementPlaylistSongCount,
  decrementPlaylistSongCount,
  setEditableSong,
  updateSong,
  setPinnedSongs,
  replaceSongs,
  pinSong,
  unpinSong,
} = songSlice.actions;

export default songSlice.reducer;
