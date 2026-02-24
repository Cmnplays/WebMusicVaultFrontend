import api from "./api";
interface apiResponse<K> {
  status: number;
  message: string;
  data: K;
}
export interface Song {
  _id: string;
  title: string;
  fileUrl?: string;
  duration: number;
}

export interface songsReturnType {
  songs: Song[];
  hasMoreSongs: boolean;
  nextCursor: cursorT;
}

interface getSongsParams {
  limit?: number;
  cursor?: cursorT;
  sortBy?: sortByT;
  sortOrder?: sortOrderT;
}
interface searchParams {
  limit?: number;
  cursor?: string | undefined;
  query: string;
  signal: AbortSignal;
}
const getSongs = async ({
  limit = 10,
  cursor,
  sortOrder = "asc",
  sortBy = "createdAt",
}: getSongsParams): Promise<songsReturnType> => {
  console.log({
    params: {
      limit,
      cursor: JSON.stringify(cursor),
      sortOrder,
      sortBy,
    },
  });
  const response = await api.get<apiResponse<songsReturnType>>(`/song`, {
    params: {
      limit,
      cursor: JSON.stringify(cursor),
      sortOrder,
      sortBy,
    },
    timeout: 1000 * 100, //120seconds
  });
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const deleteSong = async (id: string): Promise<number> => {
  const response = await api.delete(`song/${id}`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const searchSong = async ({
  limit = 10,
  query,
  cursor,
  signal,
}: searchParams): Promise<songsReturnType> => {
  const response = await api.get<apiResponse<songsReturnType>>(`/song/search`, {
    params: {
      searchQuery: query,
      cursor,
      limit,
    },
    signal,
    timeout: 1000 * 100, //120seconds
  });
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const getSongsLength = async (): Promise<number> => {
  const response = await api.get(`/about`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get songs length");
  }
  return response.data.totalNumOfSongs;
};

const getRandomSong = async (): Promise<Song> => {
  const response = await api.get(`/song/rand`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get random song");
  }
  return response.data.data;
};

const toggleAddToFav = async (id: string): Promise<void> => {
  const response = await api.post(`/song/${id}/fav`);
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a error while adding song to favourites",
    );
  }
};

const checkIsSongFav = async (id: string): Promise<boolean> => {
  const response = await api.get(`/song/${id}/fav`);
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a error while fetching isFavourite status",
    );
  }
  return response.data.data;
};
export {
  getSongs,
  deleteSong,
  searchSong,
  getSongsLength,
  getRandomSong,
  toggleAddToFav,
  checkIsSongFav,
};
