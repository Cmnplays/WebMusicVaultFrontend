import { useEffect, useState } from "react";
import { getSongsLength } from "../services/song.services";
const About = () => {
  const [songsLength, setSongsLength] = useState<number | null>(null);

  useEffect(() => {
    const fetchSongsLength = async () => {
      const length = await getSongsLength();
      setSongsLength(length);
    };
    fetchSongsLength();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-10 font-sans">
      {/* Header / App Name */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">WmV 🎵</h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          WebMusicVault (WMV) is your personal music platform to upload, search,
          listen, and download songs seamlessly. Enjoy your music collection
          with multiple playback modes like Loop, Single Loop, and Random.
        </p>
      </div>

      {/* Stats Card */}
      <div className="flex justify-center">
        <div className="text-center p-6 bg-white shadow-lg rounded-xl w-60">
          <h2 className="text-3xl font-bold text-purple-600">
            {songsLength !== null ? songsLength : "Loading..."}
          </h2>
          <p className="text-gray-500 mt-2">Total Songs</p>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Features</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-purple-500">🎵</span> Upload your own songs
            easily
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">🔍</span> Search songs and play
            seamlessly
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">🔄</span> Playback modes: Loop,
            Single Loop, Random
          </li>
          <li className="flex items-center gap-2">
            <span className="text-purple-500">⬇️</span> Download your favorite
            songs
          </li>
        </ul>
      </div>

      {/* Developer Section */}
      <div className="text-center text-gray-600">
        <p>
          Developed with ❤️ by{" "}
          <span className="font-semibold">Aaditya Chaurasiya</span>
        </p>
      </div>
      {/* Tech Stack Section */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Tech Stack
        </h2>
        <ul className="space-y-2 text-gray-700">
          <li>
            <strong>Frontend:</strong> React, Tailwind CSS, Redux, GSAP
          </li>
          <li>
            <strong>Backend:</strong> Node.js, Express, Multer
          </li>
          <li>
            <strong>Database:</strong> MongoDB
          </li>
          <li>
            <strong>Storage:</strong> Cloudinary for media hosting
          </li>
          <li>
            <strong>Language:</strong> TypeScript (used in both frontend and
            backend)
          </li>
        </ul>
      </div>

      {/* Roadmap Section */}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Coming Soon
        </h2>
        <ul className="space-y-3 text-gray-700">
          <li>📁 Playlist creation and sharing</li>
          <li>📊 Song analytics and listening history</li>
          <li>👤 Account creation for a personalized experience</li>
        </ul>
      </div>

      {/* Feedback Section */}
      <div className="text-center text-gray-600">
        <p>
          Feel free to reach out at{" "}
          <a
            href="mailto:aadityabhai20@gmail.com"
            className="text-purple-600 font-semibold block"
          >
            aadityabhai20@gmail.com
          </a>
        </p>
      </div>
      {/* Version Info */}
      <div className="text-center text-gray-400 text-sm">
        <p>WMV v2.0.0 – Last updated Oct 2025</p>
      </div>
    </div>
  );
};

export default About;
