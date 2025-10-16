import axios from "axios";
const apiBase = import.meta.env.VITE_API_URL;
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

export interface fetchReturnType {
  songs: Song[];
  hasMoreSongs: boolean;
  nextCursor: string;
}

interface fetchParams {
  limit?: number;
  cursor?: string | undefined;
  sortOrder?: "asc" | "desc";
}
const fetchAllSongs = async ({
  limit = 10,
  cursor,
  sortOrder = "asc",
}: fetchParams): Promise<fetchReturnType> => {
  const response = await axios.get<apiResponse<fetchReturnType>>(
    `${apiBase}/song`,
    {
      params: {
        limit,
        cursor,
        sortOrder,
      },
      timeout: 1000 * 100, //120seconds
    }
  );

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

const searchSong = async (
  query: string,
  page: number,
  limit: number
): Promise<Song[]> => {
  const response = await axios.get<apiResponse<Song[]>>(
    `${apiBase}/song/search`,
    {
      params: {
        searchQuery: query,
        page: page,
        limit: limit,
      },
      timeout: 1000 * 100, //120seconds
    }
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
export { fetchAllSongs, deleteSong, searchSong, getSongsLength };
