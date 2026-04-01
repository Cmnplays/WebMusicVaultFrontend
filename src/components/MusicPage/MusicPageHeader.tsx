interface MusicPageHeaderProps {
  sortBy: sortByT;
  sortOrder: sortOrderT;
  HandleSortBy: (value: sortByT, isTemp: boolean) => void;
  HandleSortOrder: (value: sortOrderT, isTemp: boolean) => void;
  isTemp?: boolean;
}

const MusicHeader: React.FC<MusicPageHeaderProps> = ({
  sortBy,
  sortOrder,
  HandleSortBy,
  HandleSortOrder,
  isTemp = false,
}) => {
  return (
    <div className="mb-3">
      {/* Win2K group box toolbar */}
      <div className="win-raised bg-[#d4d0c8] p-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {!isTemp && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="#0000cd" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 2v8.27A3 3 0 1 0 8 13V5h3V2H6z"/>
            </svg>
            <span className="text-black font-bold text-xs tracking-wide">Music Collection</span>
          </div>
        )}

        {/* Separator */}
        {!isTemp && <div className="hidden sm:block w-px h-5 bg-[#808080] mx-1" />}

        {/* Sort controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-black">Sort by:</span>
          <div className="win-sunken bg-white relative">
            <select
              value={sortBy}
              onChange={(e) => HandleSortBy(e.target.value as sortByT, isTemp)}
              className="bg-transparent text-[11px] text-black px-2 py-0.5 pr-5 cursor-default appearance-none outline-none w-28"
            >
              <option value="createdAt">Created At</option>
              <option value="duration">Duration</option>
              <option value="title">Title</option>
              <option value="playCount">Play Count</option>
            </select>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-black pointer-events-none">▼</span>
          </div>

          <div className="win-sunken bg-white relative">
            <select
              value={sortOrder}
              onChange={(e) => HandleSortOrder(e.target.value as sortOrderT, isTemp)}
              className="bg-transparent text-[11px] text-black px-2 py-0.5 pr-5 cursor-default appearance-none outline-none w-24"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[9px] text-black pointer-events-none">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicHeader;
