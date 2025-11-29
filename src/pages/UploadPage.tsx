import axios from "axios";
import React, { useRef, useState } from "react";
const apiBase = import.meta.env.VITE_API_URL;

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [statusText, setStatusText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [alreadyExistingSongs, setAlreadyExistingSongs] = useState<string[]>(
    []
  );

  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusText("");
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusText("");

    if (files.length === 0) {
      setStatusText("Please select at least one file.");
      return;
    }
    if (files.length > 3) {
      setStatusText("Please select less than 3 files.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("songs", file));
    setLoading(true);
    setIsUploading(true);
    try {
      const res = await axios.post(`${apiBase}/song/upload`, formData, {
        timeout: 1000 * 300,
      });

      if (res.data.messages.length > 0) {
        setAlreadyExistingSongs(res.data.messages);
      }
      setStatusText(res.data.message);
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err: unknown) {
      setStatusText("Upload failed. Please try again.");
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          setStatusText("Request timed out. Please try again later.");
        } else if (err.response) {
          const status = err.response.status;
          if (status === 409) {
            setStatusText("Upload failed: File already exists.");
          } else {
            setStatusText(
              `Upload failed: ${err.response.data?.message || "Unknown error"}`
            );
          }
        } else {
          setStatusText("Something went wrong. Please try again.");
        }
      } else if (err instanceof Error) {
        setStatusText("Unexpected error occurred. Please try again.");
      } else {
        setStatusText("An unknown error occurred.");
      }
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start p-4 bg-gradient-to-b from-purple-900 via-purple-800 to-purple-700">
      <div className="w-full max-w-md bg-purple-800 rounded-2xl shadow-xl p-6 mt-8 flex flex-col gap-4 text-white">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Upload Your Songs
        </h1>

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="flex flex-col gap-4"
        >
          <div
            onClick={handleFileClick}
            className="border-2 border-dashed border-purple-400 rounded-2xl p-6 cursor-pointer text-center text-purple-200 hover:border-orange-400 transition-colors"
          >
            {files.length > 0 ? (
              <div className="space-y-2">
                <p className="font-semibold text-white">Selected files:</p>
                <ul className="text-sm text-purple-100 max-h-32 overflow-auto">
                  {files.map((file, idx) => (
                    <li key={idx} className="truncate" title={file.name}>
                      {file.name}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-purple-300">
                  Click to change files
                </p>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold">
                  Click here to select files
                </p>
                <p className="text-xs text-purple-300">
                  (or drag and drop files here)
                </p>
              </>
            )}
            <input
              type="file"
              name="songs"
              accept="audio/*"
              multiple
              className="hidden"
              onChange={handleFilesChange}
              ref={inputRef}
            />
          </div>

          {statusText && (
            <p className="text-sm font-medium text-orange-400">{statusText}</p>
          )}

          {alreadyExistingSongs.length > 0 && (
            <div className="bg-red-50 border border-red-300 p-3 rounded-xl mt-2 text-red-700">
              <p className="font-semibold mb-1">Already existing songs:</p>
              <ul className="list-disc list-inside text-sm max-h-32 overflow-auto">
                {alreadyExistingSongs.map((title, idx) => (
                  <li key={idx} title={title} className="truncate">
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-gray-200 text-sm italic">
            Upload might take up to 2 minutes depending upon the number of
            songs, size, and connection.
          </p>

          <button
            type="submit"
            className="bg-pink-400 hover:bg-orange-500 text-white font-semibold py-2 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <p className="text-purple-200 text-sm text-center mt-2">
          Click the logo to return to your music library.
        </p>
      </div>

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
