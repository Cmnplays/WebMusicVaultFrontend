import PlaylistList from "@/components/PlaylistPage/PlaylistList";

const mockPlaylists = [
  { _id: "1", name: "My Favourites", owner: "aaditya", songs: ["s1", "s2", "s3", "s4", "s5"] },
  { _id: "2", name: "Late Night Vibes", owner: "aaditya", songs: ["s1", "s2"] },
  { _id: "3", name: "Workout Mix", owner: "john", songs: ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"] },
];
const page = () => {
  return <div><PlaylistList playlists={mockPlaylists}></PlaylistList></div>;
};

export default page;
