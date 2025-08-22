import { Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import Navbar from "./components/Navbar";
import MusicPage from "./pages/MusicPage.tsx";
import SearchSongs from "./pages/SearchSongs.tsx";
import Playlists from "./pages/Playlists.tsx";
import SignUp from "./pages/SignUp.tsx";
import Login from "./pages/Login.tsx";
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate replace to="/musics" />} />
        <Route path="/musics" element={<MusicPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/search-songs" element={<SearchSongs />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
