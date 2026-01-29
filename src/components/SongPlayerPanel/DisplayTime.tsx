import React from "react";
import { formatDuration } from "../formatDuration";
interface DisplayTimeProps {
  duration?: number;
  currentTime: number;
}
const DisplayTime: React.FC<DisplayTimeProps> = ({ duration, currentTime }) => {
  return (
    <span
      className="
              font-mono text-purple-300 text-right select-none
              w-10 text-xs lg:w-12 lg:text-sm
            "
    >
      {duration
        ? formatDuration(duration - currentTime)
        : formatDuration(currentTime)}
    </span>
  );
};

export default DisplayTime;
