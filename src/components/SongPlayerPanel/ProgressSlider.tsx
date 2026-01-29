import React from "react";
interface ProgressSliderProps {
  duration: number;
  currentTime: number;
  handleSliderChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ProgressSlider: React.FC<ProgressSliderProps> = ({
  duration,
  currentTime,
  handleSliderChange,
}) => {
  return (
    <input
      type="range"
      min={0}
      max={Math.floor(duration)}
      value={Math.floor(currentTime)}
      onChange={handleSliderChange}
      className="
          w-full bg-purple-600/80 rounded-full appearance-none cursor-pointer
          accent-orange-400 hover:accent-orange-500 transition-colors duration-300
          h-2 lg:h-3 mb-3
        "
    />
  );
};

export default ProgressSlider;
