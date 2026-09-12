"use client";
import { useAppDispatch } from "@/store/hook";
import { setMountDownloadConfirmation } from "@/reduxSlices/ui.slice";
import { Download } from "lucide-react";
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
      <Download
        size={30}
        className="transition-colors duration-300 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
      />
    </button>
  );
};

export default DownloadBtn;
