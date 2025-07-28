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
  fileUrl?: string; // full URL to audio file
  duration: number;
}

const fetchAllSongs = async (
  limit: number = 10,
  page: number = 1
): Promise<Song[]> => {
  try {
    const response = await axios.get<apiResponse<Song[]>>(`${apiBase}/song`, {
      params: {
        limit,
        page,
      },
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (response.data.status !== 200) {
      console.log(response.data);
      throw new Error(response.data.message || "Failed to fetch songs");
    }
    return response.data.data;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
};

const uploadSongs = async (): Promise<void> => {};

export { fetchAllSongs, uploadSongs };
