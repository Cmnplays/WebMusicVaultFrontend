import axios from "axios";
const apiBase = process.env.NEXT_PUBLIC_API_URL;

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
  const response = await axios.get<apiResponse<songsReturnType>>(
    `${apiBase}/song`,
    {
      params: {
        limit,
        cursor: JSON.stringify(cursor),
        sortOrder,
        sortBy,
      },
      timeout: 1000 * 100, //120seconds
    },
  );
  console.log(response.data);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const deleteSong = async (id: string): Promise<number> => {
  const response = await axios.delete(`${apiBase}/song/${id}`);
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
  const response = await axios.get<apiResponse<songsReturnType>>(
    `${apiBase}/song/search`,
    {
      params: {
        searchQuery: query,
        cursor,
        limit,
      },
      signal,
      timeout: 1000 * 100, //120seconds
    },
  );
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};

const getSongsLength = async (): Promise<number> => {
  const response = await axios.get(`${apiBase}/about`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get songs length");
  }
  return response.data.totalNumOfSongs;
};

const getRandomSong = async (): Promise<Song> => {
  const response = await axios.get(`${apiBase}/song/rand`);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to get random song");
  }
  return response.data.data;
};
export { getSongs, deleteSong, searchSong, getSongsLength, getRandomSong };
