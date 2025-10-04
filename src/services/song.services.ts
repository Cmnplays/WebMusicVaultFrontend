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

const fetchAllSongs = async (
  limit: number = 10,
  page: number = 1,
  sortOrder: "asc" | "desc" = "asc"
): Promise<Song[]> => {
  const response = await axios.get<apiResponse<Song[]>>(`${apiBase}/song`, {
    params: {
      limit,
      page,
      sortOrder,
    },
    timeout: 1000 * 100, //120seconds
  });

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
