import api from "@/lib/api";
import { Song } from "./song.services";
export interface Playlist {
  name: string;
  owner: {
    username: string;
    _id: string;
  };
  songs: Song[];
  description?: string;
  status: "private" | "public";
  isDefault: boolean;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
const getPlaylists = async (): Promise<Playlist[]> => {
  const response = await api.get("/playlist");
  if (response.data.status !== 200) {
    throw new Error(
      response.data.message ||
        "There was a problem while getting username suggestions",
    );
  }
  return response.data.data;
};

export { getPlaylists };
