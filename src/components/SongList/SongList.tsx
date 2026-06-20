"use client";
import { useRef } from "react";
import type { Song } from "../../services/song.services";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import SongCard from "./SongCard";
import { useVirtualizer } from "@tanstack/react-virtual";
const SongList = ({
  songs,
  handlePlayClick,
  playingSong,
  playing,
  isTemp = false,
}: {
  songs: Song[];
  handlePlayClick: (song: Song) => void;
  playingSong: Song | null;
  playing: boolean;
  isTemp?: boolean;
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollableElemRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll({ isTemp, sentinelRef });

  // const dummySongs = Array.from({ length: 50 }, (_, i) => {
  //   const songId = i + 1;
  //   const songTitles = [
  //     "Tum Hi Ho",
  //     "Kesariya",
  //     "Raataan Lambiyan",
  //     "Channa Mereya",
  //     "Hawayein",
  //     "Bekhayali",
  //     "Shayad",
  //     "Tera Yaar Hoon Main",
  //     "Galliyan",
  //     "Kabira",
  //     "Ae Dil Hai Mushkil",
  //     "Gerua",
  //     "Illahi",
  //     "Agar Tum Saath Ho",
  //     "Janam Janam",
  //     "Tujhe Kitna Chahne Lage",
  //     "Bulleya",
  //     "Phir Le Aya Dil",
  //     "Ik Vaari Aa",
  //     "Pal",
  //     "Dil Dhadakne Do",
  //     "London Thumakda",
  //     "Param Sundari",
  //     "Malhari",
  //     "Zaalima",
  //     "Badtameez Dil",
  //     "Swag Se Swagat",
  //     "Kala Chashma",
  //     "Dilbar",
  //     "Ghungroo",
  //     "Kar Gayi Chull",
  //     "Slow Motion",
  //     "Radha",
  //     "Bom Diggy",
  //     "Aankh Marey",
  //     "Daaru Wargi",
  //     "Ve Maahi",
  //     "Raabta",
  //     "Pehla Nasha",
  //     "Kuch Kuch Hota Hai",
  //     "Suraj Hua Maddham",
  //     "Kabhi Khushi Kabhie Gham",
  //     "Bole Chudiyan",
  //     "Main Yahaan Hoon",
  //     "Tu Jaane Na",
  //     "Woh Lamhe",
  //     "Teri Meri",
  //     "Sajdaa",
  //     "Mile Ho Tum",
  //     "Zara Sa",
  //   ];

  //   const artists = [
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Jubin Nautiyal",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Sachet Tandon",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Ankit Tiwari",
  //     "Rekha Bhardwaj",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Amit Mishra",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Priyanka Chopra",
  //     "Labh Janjua",
  //     "Shreya Ghoshal",
  //     "Vishal Dadlani",
  //     "Arijit Singh",
  //     "Udit Narayan",
  //     "Vishal Dadlani",
  //     "Badshah",
  //     "Neha Kakkar",
  //     "Arijit Singh",
  //     "Fazilpuria",
  //     "Nakash Aziz",
  //     "Sunidhi Chauhan",
  //     "Zack Knight",
  //     "Mika Singh",
  //     "Guru Randhawa",
  //     "Arijit Singh",
  //     "Arijit Singh",
  //     "Udit Narayan",
  //     "Udit Narayan",
  //     "Sonu Nigam",
  //     "Udit Narayan",
  //     "Udit Narayan",
  //     "Udit Narayan",
  //     "Atif Aslam",
  //     "Atif Aslam",
  //     "Rahat Fateh Ali Khan",
  //     "Rahat Fateh Ali Khan",
  //     "Neha Kakkar",
  //     "KK",
  //   ];

  //   return {
  //     _id: String(songId),
  //     title: songTitles[i % 50],
  //     artist: artists[i % 50],
  //     duration: Math.floor(Math.random() * (300 - 180)) + 180,
  //     // Cloudinary URL: https://res.cloudinary.com/demo/image/upload/{transformations}/{public_id}
  //     // This matches your next.config remotePatterns for res.cloudinary.com
  //     coverImageUrl: `https://res.cloudinary.com/demo/image/upload/w_100,h_100,c_fill/v1/${songId}`,
  //     fileUrl: "",
  //     publicId: `song-${songId}`,
  //     isLiked: Math.random() > 0.6,
  //     playCount: Math.floor(Math.random() * 1000),
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //     __v: 0,
  //     owner: { _id: "1", username: "aaditya" },
  //   };
  // });

  const virtualizer = useVirtualizer({
    count: songs.length,
    estimateSize: () => 90,
    getScrollElement: () => scrollableElemRef.current,
    overscan: 3,
  });
  return (
    <div
      ref={scrollableElemRef}
      style={{
        overflow: "auto",
        height: "100%",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      <ul
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const song = songs[virtualItem.index];
          const isActive = playingSong?._id === song._id;

          return (
            <li
              key={song._id}
              data-index={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`, // Simpler transform
              }}
            >
              <SongCard
                handlePlayClick={handlePlayClick}
                song={song}
                isActive={isActive}
                isPlaying={isActive && playing}
              />
            </li>
          );
        })}
        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="h-px w-full bg-transparent"></div>
      </ul>
    </div>
  );
};

export default SongList;
