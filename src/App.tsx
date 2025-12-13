import { Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import Navbar from "./components/Navbar";
import MusicPage from "./pages/MusicPage.tsx";
import SearchSongs from "./pages/SearchSongs.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SongPage from "./pages/SongPage.tsx";
import About from "./pages/About.tsx";
import ShufflePlayer from "./pages/ShufflePlay.tsx";
export default function App() {
  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#3A1A8A] via-[#5520A5] to-[#7A2CA0]" />
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate replace to="/musics" />} />
        <Route path="/musics" element={<MusicPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/search-songs" element={<SearchSongs />} />
        <Route path="/shuffle-player" element={<ShufflePlayer />} />
        <Route path="/about" element={<About />} />
        <Route path="/song/:id" element={<SongPage />} />
      </Routes>
    </>
  );
}
