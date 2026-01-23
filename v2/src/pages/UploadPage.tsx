import axios from "axios";
import React, { useRef, useState } from "react";
const apiBase = import.meta.env.VITE_API_URL;

const UploadPage: React.FC = () => {
  type error = string | null;
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<error>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState<error[]>([]);
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMsg(null);
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("songs", file));

    setIsUploading(true);
    try {
      const res = await axios.post(`${apiBase}/song/upload`, formData, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (res.data.errors?.length > 0) {
        setErrors(res.data.errors);
      }
      setSuccessMsg("Upload successful!");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 409) {
          setError("Upload failed: File already exists.");
        } else {
          setError(
            `Upload failed: ${err.response.data?.message || "Unknown error"}`
          );
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsUploading(false);
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

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
        {successMsg && (
          <p className="text-green-600 text-sm font-medium">{successMsg}</p>
        )}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-300 p-3 rounded-md mt-2">
            <p className="text-red-700 font-semibold mb-1">
              Duplicate or existing songs:
            </p>
            <ul className="list-disc list-inside text-red-600 text-sm max-h-32 overflow-auto">
              {errors.map((errMsg, idx) => (
                <li key={idx} title={errMsg!} className="truncate">
                  {errMsg}
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
          Upload might take up to 2 minutes depending on file size and
          connection.
        </p>

        <button
          type="submit"
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <i className="ri-loader-2-line text-gray-400 text-6xl animate-spin" />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
