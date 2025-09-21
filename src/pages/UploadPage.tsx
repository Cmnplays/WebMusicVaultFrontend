import axios from "axios";
import React, { useRef, useState } from "react";
const apiBase = import.meta.env.VITE_API_URL;
import { useAppDispatch, useAppSelector } from "../store/hook";
import { setLoading } from "../reduxSlices/song/songSlice";

const UploadPage: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [statusText, setStatusText] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const [alreadyExistingSongs, setAlreadyExistingSongs] = useState<string[]>(
    []
  );

  const loading = useAppSelector((state) => state.song.loading);

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

    const formData = new FormData();
    files.forEach((file) => formData.append("songs", file));
    dispatch(setLoading(true));
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
      setStatusText("Upload failed. Please try again."); // generic fallback
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
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-md mx-2 mt-8 p-4 border rounded-lg bg-white shadow-md">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="flex flex-col gap-4"
      >
        <div
          onClick={handleFileClick}
          className="border-2 border-dashed border-gray-400 rounded-md p-6 cursor-pointer text-center text-gray-600 hover:border-purple-600 transition-colors"
        >
          {files.length > 0 ? (
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">Selected files:</p>
              <ul className="text-sm text-gray-700 max-h-32 overflow-auto">
                {files.map((file, idx) => (
                  <li key={idx} className="truncate" title={file.name}>
                    {file.name}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                Click to change files
              </p>
            </div>
          ) : (
            <>
              <p className="text-lg font-semibold">
                Click here to select files
              </p>
              <p className="text-xs text-gray-400">
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

        {statusText && <p className="text-sm font-medium">{statusText}</p>}
        {alreadyExistingSongs.length > 0 && (
          <div className="bg-red-50 border border-red-300 p-3 rounded-md mt-2">
            <p className="text-red-700 font-semibold mb-1">
              Already existing songs:
            </p>
            <ul className="list-disc list-inside text-red-600 text-sm max-h-32 overflow-auto">
              {alreadyExistingSongs.map((title, idx) => (
                <li key={idx} title={title!} className="truncate">
                  {title}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-gray-700 text-sm">
          Click the logo to return to your music library.
        </p>

        {/* Upload duration info message */}
        <p className="text-gray-500 text-sm italic mb-2">
          Upload might take up to 2 minutes depending upon no. of songs, songs
          size and connection.
        </p>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
