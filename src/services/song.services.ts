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
  try {
    const res = await axios.delete(`${apiBase}/song/${id}`);
    return res.data.status;
  } catch (error) {
    console.error("Error deleting song", error);
    return 500;
  }
};

const searchSong = async (query: string): Promise<Song[]> => {
  const response = await axios.get<apiResponse<Song[]>>(
    `${apiBase}/song/search`,
    {
      params: {
        searchQuery: query,
      },
      timeout: 1000 * 100, //120seconds
    }
  );
  console.log(response.data.data);
  if (response.data.status !== 200) {
    throw new Error(response.data.message || "Failed to fetch songs");
  }
  return response.data.data;
};
export { fetchAllSongs, deleteSong, searchSong };
