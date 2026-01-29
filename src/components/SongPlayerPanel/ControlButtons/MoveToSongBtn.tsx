import React from "react";
interface MoveToSongProps {
  toNext?: boolean;
  moveToFunction: () => void;
}
const MoveToSong: React.FC<MoveToSongProps> = ({
  toNext = true,
  moveToFunction,
}) => {
  return (
    <button
      aria-label={toNext ? "Next" : "Previous"}
      className="
              flex items-center justify-center rounded-full
              bg-purple-700/90 hover:bg-purple-600/90 
              transition-transform shadow-md hover:shadow-lg active:scale-95
              w-10 h-10 lg:w-12 lg:h-12
            "
      onClick={moveToFunction}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="stroke-purple-200 w-5 h-5 lg:w-6 lg:h-6"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        {toNext ? (
          <>
            <path d="M13 5L20 12L13 19V5Z" />
            <rect x="8" y="5" width="2" height="14" rx="1" />
          </>
        ) : (
          <>
            <path d="M11 5L4 12L11 19V5Z" />
            <rect x="14" y="5" width="2" height="14" rx="1" />
          </>
        )}
      </svg>
    </button>
  );
};

export default MoveToSong;
