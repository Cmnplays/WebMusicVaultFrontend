"use client";
import { useAppDispatch } from "@/store/hook";
import { setMountDownloadConfirmation } from "@/reduxSlices/ui/uiSlice";
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
        className="transition-colors duration-300 hover:text-orange-400"
      />
    </button>
  );
};

export default DownloadBtn;
