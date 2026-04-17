import api from "../lib/api";

export interface Song {
  _id: string;
  title: string;
  fileUrl: string;
  duration: number;
  artist: string;
  isLiked: boolean;
  coverImageUrl: string;
  owner: {
    _id: string;
    username: string;
  };
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
  cursor?: cursorT | string;
  query: string;
  sortBy?: sortByT;
  sortOrder?: sortOrderT;
}
const getSongs = async ({
  limit = 10,
  cursor,
  sortOrder = "desc",
  sortBy = "createdAt",
}: getSongsParams): Promise<songsReturnType> => {
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

// const searchSong = async ({
//   limit = 10,
//   query,
//   cursor,
//   signal,
// }: searchParams): Promise<songsReturnType> => {
//   const response = await api.get<apiResponse<songsReturnType>>(`/song/search`, {
//     params: {
//       searchQuery: query,
//       cursor,
//       limit,
//     },
//     signal,
//     timeout: 1000 * 100, //120seconds
//   });
//   if (response.data.status !== 200) {
//     throw new Error(response.data.message || "Failed to fetch songs");
//   }
//   return response.data.data;
// };

const getSongsLength = async (): Promise<number> => {
  const response = await api.get(`/public/about`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get songs length");
  }
  return response.data.totalNumOfSongs;
};

const getRandomSong = async (): Promise<Song> => {
  const response = await api.get(`/song/random`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get random song");
  }
  return response.data.data;
};

const getSongWithId = async (id: string): Promise<Song> => {
  const response = await api.get(`/song/${id}`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get song with songId");
  }
  return response.data.data;
};
const toggleAddToFav = async (
  id: string,
): Promise<{ songId: string; isLiked: boolean }> => {
  const response = await api.post(`/like/${id}/toggle`);
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a error while adding song to favourites",
    );
  }
  return { songId: id, isLiked: response.data.data };
};
//without debounce
const searchSong = async ({
  limit = 10,
  cursor,
  query,
  sortOrder = "asc",
  sortBy = "createdAt",
}: searchParams): Promise<songsReturnType> => {
  const response = await api.get<apiResponse<songsReturnType>>(`/song`, {
    params: {
      query,
      limit,
      cursor: JSON.stringify(cursor),
      sortBy,
      sortOrder,
    },
    timeout: 1000 * 100,
  });
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const uploadSong = async (
  entry: {
    file: File;
    title: string;
    artist: string;
    coverImage?: File;
  },
  signal?: AbortSignal,
): Promise<void> => {
  const formData = new FormData();
  formData.append("song", entry.file);
  if (entry.title.trim()) formData.append("title", entry.title.trim());
  if (entry.artist.trim()) formData.append("artist", entry.artist.trim());
  if (entry.coverImage) formData.append("coverImage", entry.coverImage);

  const response = await api.post("/song", formData, {
    timeout: 1000 * 300,
    signal,
  });

  if (response.data.status !== 201) {
    throw new Error(response.data.message || "Upload failed");
  }
};

export {
  getSongs,
  deleteSong,
  searchSong,
  getSongsLength,
  getRandomSong,
  toggleAddToFav,
  getSongWithId,
  uploadSong,
};
