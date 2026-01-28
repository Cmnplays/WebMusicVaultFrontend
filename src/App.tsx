import { Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import Navbar from "./components/Navbar";
import MusicPage from "./pages/MusicPage.tsx";
import SearchSongs from "./pages/SearchSongs.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SongPage from "./pages/SongPage.tsx";
import About from "./pages/About.tsx";
import ShufflePlayer from "./pages/ShufflePlay.tsx";
import SecretConsole from "./pages/Experimental/SecretConsole.tsx";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper.tsx";
export default function App() {
  const hideNavbar = location.pathname === "/console";
  return (
    <>
      {/* Background Layer */}
      <div className="fixed inset-0 -z-10 bg-[#5520A5]" />
      {!hideNavbar && <Navbar />}

      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate replace to="/musics" />} />
        <Route
          path="/musics"
          element={
            <SmoothScrollWrapper>
              <MusicPage />
            </SmoothScrollWrapper>
          }
        />
        <Route path="/upload" element={<UploadPage />} />
        <Route
          path="/search-songs"
          element={
            <SmoothScrollWrapper>
              <SearchSongs />
            </SmoothScrollWrapper>
          }
        />
        <Route path="/shuffle-player" element={<ShufflePlayer />} />
        <Route path="/about" element={<About />} />
        <Route path="/song/:id" element={<SongPage />} />
        <Route path="/console" element={<SecretConsole />} />
      </Routes>
    </>
  );
}
