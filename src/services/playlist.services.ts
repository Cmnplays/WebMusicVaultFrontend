import api from "@/lib/api";
import { Song } from "./song.services";
export interface Playlist {
  name: string;
  owner: {
    username: string;
    _id: string;
  };
  songs: Song[];
  description?: string;
  status: "private" | "public";
  isDefault: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaylistSong {
  _id: string;
  title: string;
  duration: number;
  artist: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
  playCount: number;
  owner: {
    _id: string;
    username: string;
  };
}

export interface PlaylistWithSongs {
  _id: string;
  name: string;
  owner: string;
  songs: PlaylistSong[];
  description?: string;
  status: "private" | "public";
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const getPlaylistSongs = async (
  playlistId: string,
): Promise<PlaylistWithSongs> => {
  const response = await api.get(`/playlist/${playlistId}`);
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting playlist songs",
    );
  }
  return response.data.data;
};
const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get("/playlist");
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

export { getPlaylists, getPlaylistSongs };
