import { useRef, useState, useEffect } from "react";
import axios from "axios";
import ConsoleNav from "./ConsoleNav";
import type { ConsoleSection } from "./consoleNav.types";
import ModalViewer from "./ModalViewer";

type Tab = "text" | "photo" | "audio" | "video";
type ConsoleMode = "text" | "photo" | "audio" | "video";

interface ConsoleFile {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface ConsoleEntryType {
  _id: string;
  mode: ConsoleMode;
  timestamp: string;
  text?: string;
  photos?: ConsoleFile[];
  audio?: ConsoleFile;
  video?: ConsoleFile;
}

interface SavedPayloadBase {
  mode: Tab;
  timestamp: string;
}

interface TextPayload extends SavedPayloadBase {
  mode: "text";
  text: string;
}

interface PhotoPayload extends SavedPayloadBase {
  mode: "photo";
  photos: File[];
}

interface AudioPayload extends SavedPayloadBase {
  mode: "audio";
  audio: File;
}

interface VideoPayload extends SavedPayloadBase {
  mode: "video";
  video: File;
}

type SavedPayload = TextPayload | PhotoPayload | AudioPayload | VideoPayload;

const BACKEND_URL = import.meta.env.VITE_API_URL;

export default function SecretConsole() {
  // Unlock logic
  const [triggered, setTriggered] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const SECRET_PASS = import.meta.env.VITE_SECRET_CONSOLE_PASS;
  const pressTimer = useRef<number | null>(null);

  const startPress = () => {
    pressTimer.current = window.setTimeout(() => setTriggered(true), 3000);
  };
  const endPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };
  const verifyPassword = () => {
    if (passwordInput === SECRET_PASS) setUnlocked(true);
    else alert("Wrong password");
  };

  // Console section
  const [section, setSection] = useState<ConsoleSection>("upload");

  // Upload state
  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [textValue, setTextValue] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const [status, setStatus] = useState("Ready");
  const [savedData, setSavedData] = useState<SavedPayload | null>(null);
  const [sendStatus, setSendStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [sendMessage, setSendMessage] = useState<string | null>(null);

  // Entries
  const [entries, setEntries] = useState<ConsoleEntryType[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "photo" | "video" | "audio" | null
  >(null);
  const [modalSrc, setModalSrc] = useState("");

  const openModal = (type: "photo" | "video" | "audio", src: string) => {
    setModalType(type);
    setModalSrc(src);
    setModalOpen(true);
  };

  // File handlers
  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert("Max 5 photos allowed");
      return;
    }
    setPhotoFiles(files);
  };

  const handleSave = () => {
    setStatus("Saving...");
    const timestamp = new Date().toISOString();

    let payload: SavedPayload | null = null;
    if (activeTab === "text")
      payload = { mode: "text", timestamp, text: textValue };
    if (activeTab === "photo")
      payload = { mode: "photo", timestamp, photos: photoFiles };
    if (activeTab === "audio" && audioFile)
      payload = { mode: "audio", timestamp, audio: audioFile };
    if (activeTab === "video" && videoFile)
      payload = { mode: "video", timestamp, video: videoFile };

    if (!payload) {
      setStatus("Ready");
      alert("Nothing to save");
      return;
    }

    setSavedData(payload);
    setStatus("Saved");
    setTimeout(() => setStatus("Ready"), 1000);
  };

  const handleSend = async () => {
    if (!savedData) {
      setSendStatus("error");
      setSendMessage("Save first");
      return;
    }

    setSendStatus("sending");
    const form = new FormData();
    form.append("mode", savedData.mode);
    form.append("timestamp", savedData.timestamp);

    if (savedData.mode === "text") form.append("text", savedData.text);
    if (savedData.mode === "photo")
      savedData.photos.forEach((p) => form.append("photos", p));
    if (savedData.mode === "audio") form.append("audio", savedData.audio);
    if (savedData.mode === "video") form.append("video", savedData.video);

    try {
      await axios.post(`${BACKEND_URL}/console/upload`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setSendStatus("sent");
      setSendMessage("Sent successfully");
      setEntries([]);
      setCursor(null);
      setHasMore(true);
      setSavedData(null);
      setTextValue("");
      setVideoFile(null);
      setAudioFile(null);
      setPhotoFiles([]);
      fetchEntries();
    } catch {
      setSendStatus("error");
      setSendMessage("Error sending");
    }
  };

  const fetchEntries = async (append = false) => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {
        limit: 20,
        sort: "newest",
      };

      if (append && cursor) params.cursor = cursor;

      const res = await axios.get(`${BACKEND_URL}/console/entries`, {
        params,
        withCredentials: true,
      });

      const data = res.data.data;

      setEntries((prev) =>
        append ? [...prev, ...data.entries] : data.entries
      );
      setCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setEntries([]);
    setCursor(null);
    setHasMore(true);
    fetchEntries();
  };

  useEffect(() => {
    if (unlocked) fetchEntries();
  }, [unlocked]);

  // ✅ UNLOCKED UI
  if (unlocked) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold">WMV Console</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 flex items-center justify-center"
              title="Refresh"
            >
              <span
                className={`inline-block text-lg transition-transform ${
                  loading ? "animate-spin" : ""
                }`}
              >
                ⟳
              </span>
            </button>

            <span className="text-xs text-slate-400">{status}</span>
          </div>
        </div>
        <ConsoleNav section={section} setSection={setSection} />

        {/* ✅ UPLOAD SECTION */}
        {section === "upload" && (
          <>
            <div className="flex gap-2 pb-2">
              {(["text", "photo", "audio", "video"] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 text-xs rounded-lg border ${
                    activeTab === t
                      ? "bg-purple-600 border-purple-400"
                      : "bg-slate-900 border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 max-h-[60vh] overflow-auto">
              {activeTab === "text" && (
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  className="w-full h-full bg-slate-950/70 border border-slate-800 rounded-lg p-3 text-sm"
                  placeholder="Type text..."
                />
              )}

              {activeTab === "photo" && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotosChange}
                  />
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {photoFiles.map((f, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(f)}
                        className="w-full h-24 object-cover rounded border border-slate-700"
                      />
                    ))}
                  </div>
                </>
              )}

              {activeTab === "audio" && (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                  />
                  {audioFile && (
                    <audio
                      controls
                      src={URL.createObjectURL(audioFile)}
                      className="w-full mt-3"
                    />
                  )}
                </>
              )}

              {activeTab === "video" && (
                <>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                  />
                  {videoFile && (
                    <video
                      controls
                      src={URL.createObjectURL(videoFile)}
                      className="w-full mt-3 rounded-lg"
                    />
                  )}
                </>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-slate-800 rounded-lg border border-slate-600"
              >
                Save
              </button>
              <button
                onClick={handleSend}
                disabled={sendStatus === "sending"}
                className={`px-4 py-2 rounded-lg border ${
                  sendStatus === "sending"
                    ? "bg-purple-900 border-purple-700 text-slate-300"
                    : "bg-purple-600 border-purple-400 hover:bg-purple-500"
                }`}
              >
                {sendStatus === "sending" ? "Sending..." : "Send"}
              </button>
            </div>

            {sendMessage && (
              <p
                className={`text-xs mt-1 ${
                  sendStatus === "error" ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {sendMessage}
              </p>
            )}
          </>
        )}

        {/* ✅ VIEW SECTION */}
        {section === "view" && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 max-h-[70vh] overflow-auto text-xs">
            {entries.map((entry) => (
              <div key={entry._id} className="border-b border-slate-800 py-2">
                <div className="text-purple-400 font-semibold">
                  {entry.mode.toUpperCase()}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>

                {entry.mode === "text" && (
                  <p className="mt-1 text-slate-300">{entry.text}</p>
                )}

                {entry.mode === "photo" && entry.photos && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {entry.photos.map((p, i) => (
                      <img
                        key={i}
                        src={p.url}
                        onClick={() => openModal("photo", p.url)}
                        className="w-full h-20 object-cover rounded border border-slate-700 cursor-pointer"
                      />
                    ))}
                  </div>
                )}

                {entry.mode === "audio" && entry.audio && (
                  <audio
                    controls
                    src={entry.audio.url}
                    onClick={() => openModal("audio", entry.audio!.url)}
                    className="w-full mt-2 cursor-pointer"
                  />
                )}

                {entry.mode === "video" && entry.video && (
                  <video
                    controls
                    src={entry.video.url}
                    onClick={() => openModal("video", entry.video!.url)}
                    className="w-full mt-2 rounded border border-slate-700 cursor-pointer"
                  />
                )}
              </div>
            ))}

            <div className="mt-3 flex justify-center">
              {loading && (
                <span className="text-[11px] text-slate-400">Loading...</span>
              )}

              {!loading && hasMore && (
                <button
                  onClick={() => fetchEntries(true)}
                  className="px-3 py-1 text-[11px] bg-slate-800 border border-slate-600 rounded hover:bg-slate-700"
                >
                  Load more
                </button>
              )}

              {!loading && !hasMore && (
                <span className="text-[11px] text-slate-500">
                  No more entries.
                </span>
              )}
            </div>
          </div>
        )}

        {/* ✅ SETTINGS SECTION */}
        {section === "settings" && (
          <div className="text-slate-400 text-sm">
            <p>Settings coming soon...</p>
          </div>
        )}

        {/* ✅ MODAL VIEWER */}
        <ModalViewer
          open={modalOpen}
          type={modalType}
          src={modalSrc}
          onClose={() => setModalOpen(false)}
        />
      </div>
    );
  }

  // ✅ PASSWORD SCREEN
  if (triggered) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-slate-900/70 border border-white/10 rounded-xl p-6">
          <h1 className="text-xl font-semibold mb-4">Enter Password</h1>

          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4"
            placeholder="Password"
          />

          <button
            onClick={verifyPassword}
            className="w-full py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
          >
            Unlock
          </button>
        </div>
      </div>
    );
  }

  // ✅ FAKE 404 (long press unlock)
  return (
    <div
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
      className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6"
    >
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-slate-300 text-lg mb-6">Page not found.</p>

      <a
        href="/"
        className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-500"
      >
        Go Home
      </a>
    </div>
  );
}
