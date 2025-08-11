import React, { useState, useRef, useEffect } from "react";
import { fetchAllSongs } from "../services/song.services";
import type { Song } from "../services/song.services";
import SongPlayerPanel from "../components/SongPlayerPanel";
import { formatDuration } from "../components/formatDuration";
import DeleteConfirmation from "../components/DeleteConfirmation";
import gsap from "gsap";

const MusicPage: React.FC = () => {
  const [playingSong, setPlayingSong] = useState<Song | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [panelTrigger, setPanelTrigger] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mountDeleteConfirmation, setMountDeleteConfirmation] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const panelRef = useRef<HTMLDivElement>(null);
  const [loadingText, setLoadingText] = useState("Loading more songs...");

  const Limit = 10;

  // Fetch songs on page or initial load
  useEffect(() => {
    const loadSongs = async () => {
      setLoading(true);
      try {
        if (page === 1) {
          if (sortOrder === "asc")
            setLoadingText(
              "Fetching songs... Newest to Oldest.\n(First load may take up to a minute as the server wakes up)"
            );
          else {
            setLoadingText("Fetching songs...Oldest to Newest");
          }
        } else {
          setLoadingText("Loading more songs...");
        }
        const newSongs = await fetchAllSongs(Limit, page, sortOrder);
        if (page === 1) return setSongs(newSongs);
        setSongs((prev) => {
          const combined = [...prev, ...newSongs];
          const uniqueSongsMap = new Map<string, Song>();
          combined.forEach((song) => uniqueSongsMap.set(song._id, song));
          return Array.from(uniqueSongsMap.values());
        });

        if (newSongs.length < Limit) {
          setHasMoreSongs(false);
        }
      } catch (error) {
        console.error("Failed to load songs", error);
      } finally {
        setLoading(false);
      }
    };
    loadSongs();
  }, [page, sortOrder]);

  // Play or pause audio based on playingSong change
  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (playingSong?.fileUrl) {
      if (audioEl.src !== playingSong.fileUrl) {
        audioEl.src = playingSong.fileUrl;
      }
      audioEl.currentTime = 0;
      audioEl.play().catch((err) => console.error("Audio play error", err));
    } else {
      audioEl.pause();
      audioEl.src = "";
    }
  }, [playingSong]);

  // Infinite scroll: load more songs when near bottom
  useEffect(() => {
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const handleScroll = () => {
      if (loading || !hasMoreSongs) return;

      if (debounceTimer) clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        const scrollPosition = window.innerHeight + window.scrollY;
        const bottomPosition = document.documentElement.offsetHeight;

        if (bottomPosition - scrollPosition < 150) {
          setPage((prev) => prev + 1);
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [loading, hasMoreSongs]);

  useEffect(() => {
    const song = audioRef.current;
    if (!song) {
      return;
    }
    const onLoadMetadata = () => {
      setDuration(song.duration ?? 0);
    };
    const onTimeUpdate = () => {
      setCurrentTime(song.currentTime ?? 0);
    };
    song.addEventListener("loadedmetadata", onLoadMetadata);
    song.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      song.removeEventListener("loadedmetadata", onLoadMetadata);
      song.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  // Handle play button click
  function handlePlayClick(song: Song) {
    if (playingSong?._id === song._id) {
      if (playing) {
        setPlaying(false);
        audioRef.current?.pause();
      } else {
        setPlaying(true);
        audioRef.current?.play();
        setPanelTrigger((prev) => prev + 1);
      }
    } else {
      if (!song.fileUrl) {
        alert("Audio not available for this song.");
        setPlaying(false);
        return;
      }
      if (!panelOpen) {
        setPanelTrigger((prev) => prev + 1);
      }
      setPlayingSong(song);
      setPlaying(true);
    }
  }

  // New: Handle when current song ends, play next if available
  function handleAudioEnded() {
    if (!playingSong) return;

    const currentIndex = songs.findIndex((s) => s._id === playingSong._id);
    if (currentIndex === -1) {
      setPlayingSong(null);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < songs.length) {
      setPlayingSong(songs[nextIndex]);
    } else {
      // No more songs in list
      setPlayingSong(null);
    }
  }

  const moveToNextSong = () => {
    const currentIndex = songs.findIndex((s) => s._id === playingSong?._id);
    if (currentIndex === -1) {
      setPlayingSong(null);
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < songs.length) {
      setPlayingSong(songs[nextIndex]);
    } else {
      // No more songs in list
      setPlayingSong(songs[0]);
    }
    setPlaying(true);
  };

  const moveToPreviousSong = () => {
    const currentIndex = songs.findIndex((s) => s._id === playingSong?._id);
    if (currentIndex === -1) {
      setPlayingSong(null);
    }
    const previousSong = currentIndex - 1;
    if (previousSong < 0) {
      setPlayingSong(songs[songs.length - 1]);
    } else {
      // No more songs in list
      setPlayingSong(songs[previousSong]);
    }
    setPlaying(true);
  };
  const fadeOutPanel = (
    panelElement: HTMLDivElement,
    onComplete?: () => void
  ) => {
    gsap.to(panelElement, {
      y: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
      onComplete,
    });
  };
  const handleSorting = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setSongs([]);
    setHasMoreSongs(true);
    setPage(1);
    if (panelRef.current) {
      fadeOutPanel(panelRef.current, () => {
        setPlayingSong(null);
        setPanelOpen(false);
      });
    }
  };

  return (
    <main className={`max-w-5xl mx-ACauto p-4 ${playing && "mb-[192px]"}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Your Music Collection
        </h2>
        <button
          onClick={handleSorting}
          className="inline-flex items-center justify-center p-1"
          aria-label="Sort toggle"
        >
          {sortOrder == "desc" ? (
            <i className="ri-sort-desc text-3xl leading-none" />
          ) : (
            <i className="ri-sort-asc text-3xl leading-none" />
          )}
        </button>
      </div>

      <ul className="space-y-4">
        {songs.map((song) => {
          const isCurrentSongPlaying = playingSong?._id === song._id && playing;

          return (
            <li
              key={song._id}
              onClick={() => handlePlayClick(song)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handlePlayClick(song);
                }
              }}
              aria-label={isCurrentSongPlaying ? "Pause" : "Play"}
              title={isCurrentSongPlaying ? "Pause" : "Play"}
              className="flex items-center gap-4 p-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white shadow focus:outline-none
                  ${
                    isCurrentSongPlaying
                      ? "bg-gradient-to-tr from-purple-700 to-purple-900"
                      : "bg-gradient-to-tr from-blue-400 to-purple-600"
                  }
                `}
              >
                {isCurrentSongPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="5" width="4" height="14" />
                    <rect x="14" y="5" width="4" height="14" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                  </svg>
                )}
              </div>

              <div className="flex-grow overflow-hidden">
                <h3
                  className="text-lg font-semibold text-gray-900 truncate"
                  title={song.title}
                >
                  {song.title}
                </h3>
              </div>

              <div className="flex-shrink-0 bg-blue-100 text-blue-800 text-xs font-mono font-semibold px-2 py-0.5 rounded-full select-none">
                {formatDuration(song.duration)}
              </div>
            </li>
          );
        })}
      </ul>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        preload="metadata"
        hidden
      />

      {loading && (
        <p className="text-center mt-4 text-gray-600 whitespace-pre-line">
          {loadingText}
        </p>
      )}
      {!hasMoreSongs && (
        <p className="text-center mt-4 text-gray-600">
          You have reached the end of the list.
        </p>
      )}
      {playingSong && (
        <SongPlayerPanel
          song={playingSong}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
          duration={duration}
          playing={playing}
          setPlaying={setPlaying}
          panelTrigger={panelTrigger}
          setPanelOpen={setPanelOpen}
          playingSong={playingSong}
          downloading={downloading}
          setDownloading={setDownloading}
          setMountDeleteConfirmation={setMountDeleteConfirmation}
          panelRef={panelRef}
          fadeOutPanel={fadeOutPanel}
          handlePlayPause={() => {
            if (!playing) {
              audioRef.current?.play();
              setPlaying(true);
              return;
            }
            audioRef.current?.pause();
            setPlaying(false);
          }}
          moveToNextSong={moveToNextSong}
          moveToPreviousSong={moveToPreviousSong}
        />
      )}
      {mountDeleteConfirmation && (
        <DeleteConfirmation
          title={playingSong!.title}
          songId={playingSong!._id}
          setDeleting={setDeleting}
          setMountDeleteConfirmation={setMountDeleteConfirmation}
          deleting={deleting}
          setSongs={setSongs}
          songs={songs}
          moveToNextSong={moveToNextSong}
        />
      )}
      {(downloading || deleting) && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </main>
  );
};

export default MusicPage;
