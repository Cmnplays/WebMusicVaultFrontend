import { useEffect, useState } from "react";
import { getSongsLength } from "../services/song.services";
import CountUp from "react-countup";

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 p-4 sm:p-6 flex flex-col gap-10 font-sans">
      {/* Header / App Name */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">WmV 🎵</h1>
        <p className="text-gray-600 mt-3 text-base sm:text-lg">
          WebMusicVault (WMV) is your personal music hub to upload, search,
          play, and download songs easily. Enjoy your music with different
          playback modes.
        </p>
        <p className="mt-4 inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold text-sm">
          Developed with ❤️ by Aaditya Chaurasiya
        </p>
      </div>

      {/* Stats and Hosting Cards */}
      <div className="flex flex-col md:flex-row md:justify-center md:gap-8 items-stretch max-w-5xl mx-auto">
        {/* Total Songs */}
        <div className="flex-1 p-6 rounded-2xl flex flex-col items-center justify-center mb-6 md:mb-0 bg-gradient-to-tr from-purple-200 to-purple-50 shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-4xl sm:text-5xl font-bold text-purple-600">
            {songsLength !== null ? (
              <CountUp end={songsLength} duration={2} />
            ) : (
              "Loading..."
            )}
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Total Songs</p>
        </div>

        {/* Hosting */}
        <div className="flex-1 p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-tr from-white to-purple-50 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3 text-center md:text-left">
            Hosting
          </h2>
          <ul className="space-y-2 text-gray-700 text-center md:text-left">
            <li>
              🌐 Frontend hosted on <strong>Vercel</strong>
            </li>
            <li>
              💻 Backend hosted on <strong>Render</strong>
            </li>
          </ul>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: "🎵", text: "Upload your own songs easily" },
          { icon: "🔍", text: "Search songs and play seamlessly" },
          { icon: "🔄", text: "Playback modes: Loop, Single Loop, Random" },
          { icon: "⬇️", text: "Download your favorite songs" },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-tr from-purple-50 to-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
          >
            <span className="text-purple-500 text-3xl">{feature.icon}</span>
            <p className="text-gray-700 font-medium">{feature.text}</p>
          </div>
        ))}
      </div>

      {/* Tech Stack & Coming Soon */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tech Stack */}
        <div className="bg-gradient-to-tr from-white to-purple-50 p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Tech Stack
          </h2>
          <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
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
              <strong>Language:</strong> TypeScript (frontend + backend)
            </li>
          </ul>
        </div>

        {/* Coming Soon */}
        <div className="bg-gradient-to-tr from-white to-purple-50 p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Coming Soon
          </h2>
          <ul className="text-gray-700 space-y-2 text-sm sm:text-base">
            <li>📁 Playlist creation and sharing</li>
            <li>📊 Song analytics and listening history</li>
            <li>👤 Account creation for a personalized experience</li>
          </ul>
        </div>
      </div>

      {/* Developer & Contact */}
      <div className="text-center text-gray-600">
        <p className="mt-2">
          Reach out at{" "}
          <a
            href="mailto:aadityabhai20@gmail.com"
            className="text-purple-600 font-semibold"
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
