import api from "@/lib/api";

export interface Playlist {
  name: string;
  owner: {
    username: string;
    _id: string;
  };
  songs: number;
  description?: string;
  status: "private" | "public";
  isDefault: boolean;
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PlaylistsResponse {
  defaultPlaylists: Playlist[];
  personalPlaylists: Playlist[];
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
      response.data.message ??
        "There was a problem while getting playlist songs",
    );
  }
  return response.data.data;
};

const getPlaylists = async (): Promise<PlaylistsResponse> => {
  const response = await api.get("/playlist");
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ?? "There was a problem while getting playlists",
    );
  }
  return response.data.data;
};

export { getPlaylists, getPlaylistSongs };
