"use client";
import { useEffect, useState } from "react";
import { getSongsLength } from "@/services/song.services";
import CountUp from "react-countup";
import Navbar from "@/components/Navbar/Navbar";

const About = () => {
  const [songsLength, setSongsLength] = useState<number | null>(null);

  useEffect(() => {
    document.title = "About | WmV";
    const fetchSongsLength = async () => {
      const length = await getSongsLength();
      setSongsLength(length);
    };
    fetchSongsLength();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen p-4 sm:p-6 flex flex-col gap-10 font-sans text-purple-100 bg-[#5520A5]">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white drop-shadow-xl tracking-tight">
            WmV <span className="text-purple-400">🎵</span>
          </h1>

          <div className="space-y-4 text-purple-300/80 text-base leading-relaxed max-w-2xl mx-auto px-4">
            <p>
              WebMusicVault (WmV) is my first fullstack project which is live
              and can be used by people out there or at least me and my loved
              ones.
            </p>
            <p>
              Here anyone can upload, search, play, and download songs easily
              and enjoy my music taste with different playback modes.
            </p>

            <p>
              This is version 3 of this site which is yet not fully optimized
              and not even complete. But works for now. That&apos;s it. 🙂
            </p>

            <div className="pt-2 text-purple-200/70">
              <p className="font-medium">
                I am the daily user of this thing 😅.
              </p>
              <p className="text-pink-300 font-semibold mt-1 animate-pulse">
                Whoever is reading this, Love you💗!
              </p>
            </div>
          </div>

          <div className="pt-4">
            <p className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-purple-100 px-4 py-1.5 rounded-full font-semibold text-sm border border-white/10 shadow-lg hover:bg-white/20 transition-all cursor-default">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Developed with ❤️ by Aaditya! {"\n"} If you are reading this, you
              should know that {"\n"} I will always wait for you!
            </p>
          </div>
        </div>

        {/* Stats + Hosting */}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-8 items-stretch max-w-5xl mx-auto">
          {/* Total Songs */}
          <div className="flex-1 p-6 rounded-2xl flex flex-col items-center justify-center mb-6 md:mb-0 bg-white/10 backdrop-blur-md border border-white/10 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-4xl sm:text-5xl font-bold text-white drop-shadow">
              {songsLength !== null ? (
                <CountUp end={songsLength} duration={2} />
              ) : (
                <i className="ri-loader-2-line text-purple-300 inline-block text-4xl animate-spin" />
              )}
            </h2>
            <p className="text-purple-200 mt-2 text-lg">Total Songs</p>
          </div>

          {/* Hosting */}
          <div className="flex-1 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/10 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-white mb-3 text-center md:text-left">
              Hosting
            </h2>
            <ul className="space-y-2 text-purple-200 text-center md:text-left">
              <li>
                🌐 Frontend hosted on{" "}
                <strong className="text-white">Vercel</strong>
              </li>
              <li>
                💻 Backend hosted on{" "}
                <strong className="text-white">Render</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: "🎵", text: "Upload your own songs easily" },
            { icon: "🔍", text: "Search songs and play seamlessly" },
            { icon: "🔄", text: "Playback modes: Loop, Single Loop, Random" },
            { icon: "⬇️", text: "Download your favorite songs" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-4"
            >
              <span className="text-white text-3xl">{feature.icon}</span>
              <p className="text-purple-200 font-medium">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* Tech + Coming Soon */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tech Stack */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Tech Stack
            </h2>
            <ul className="text-purple-200 space-y-2 text-sm sm:text-base">
              <li>
                <strong className="text-white">Frontend:</strong> NextJs,
                Tailwind CSS, Redux, GSAP
              </li>
              <li>
                <strong className="text-white">Backend:</strong> Node.js,
                Express, Multer
              </li>
              <li>
                <strong className="text-white">Database:</strong> MongoDB
              </li>
              <li>
                <strong className="text-white">Storage:</strong> Cloudinary
              </li>
              <li>
                <strong className="text-white">Language:</strong> TypeScript
              </li>
            </ul>
          </div>

          {/* Coming Soon */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-white mb-3">
              Coming Soon
            </h2>
            <ul className="text-purple-200 space-y-2 text-sm sm:text-base">
              <li>📁 Playlist creation and sharing</li>
              <li>📊 Song analytics and listening history</li>
              <li>👤 Account creation for a personalized experience</li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center text-purple-200">
          <p className="mt-2">
            Reach out at{" "}
            <a
              href="mailto:aadityabhai20@gmail.com"
              className="text-white font-semibold underline"
            >
              aadityabhai20@gmail.com
            </a>
          </p>
        </div>

        {/* Version */}
        <div className="text-center text-purple-300 text-sm">
          <p>WMV v3.0.0 – Last updated August 2026</p>
        </div>
      </div>
    </>
  );
};

export default About;
