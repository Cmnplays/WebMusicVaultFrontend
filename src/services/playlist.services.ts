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
  isLiked: boolean;
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

export interface GetPlaylistSongsOptions {
  limit?: number;
  cursor?: string;
}

const getPlaylistSongs = async (
  playlistId: string,
  options?: GetPlaylistSongsOptions,
): Promise<PlaylistWithSongs> => {
  const { limit = 10, cursor } = options || {};
  let url = `/playlist/${playlistId}?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${cursor}`;
  }
  const response = await api.get(url);
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

const getLikedSongs = async (
  userId: string,
  options?: GetPlaylistSongsOptions,
): Promise<PlaylistWithSongs> => {
  const { limit = 10, cursor } = options || {};
  console.log(limit)
  let url = `/like/${userId}?limit=${limit}`;
  if (cursor) {
    url += `&cursor=${cursor}`;
  }
  const response = await api.get(url);
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ??
        "There was a problem while getting liked songs",
    );
  }
  return response.data.data;
};

export { getPlaylists, getPlaylistSongs, getLikedSongs };
