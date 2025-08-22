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
    timeout: 120,
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

export { fetchAllSongs, deleteSong };
