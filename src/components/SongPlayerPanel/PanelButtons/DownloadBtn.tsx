"use client";
import { useAppDispatch } from "@/store/hook";
import { setMountDownloadConfirmation } from "@/reduxSlices/song/songSlice";

interface DownloadBtnProps {
  downloading: boolean;
}
const DownloadBtn: React.FC<DownloadBtnProps> = ({ downloading }) => {
  const dispatch = useAppDispatch();
  const handleDownload = () => {
    dispatch(setMountDownloadConfirmation(true));
  };
  return (
    <button
      onClick={handleDownload}
      aria-label="Download song"
      disabled={downloading}
    >
      <i
        className={`
                   ri-download-line
                   ${
                     downloading
                       ? "text-gray-400"
                       : "text-white/90 hover:text-orange-400"
                   }
                   transition-colors duration-300
                   text-2xl lg:text-3xl
                 `}
      />
    </button>
  );
};

export default DownloadBtn;
