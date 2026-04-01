"use client";

interface SongListSkeletonProps {
  rows?: number;
}

const SongListSkeleton: React.FC<SongListSkeletonProps> = ({ rows = 5 }) => {
  return (
    <div className="win-window overflow-hidden">
      {/* Column header row */}
      <div className="flex items-stretch bg-[#d4d0c8]" style={{ borderBottom: '2px solid #808080' }}>
        <div className="w-8 flex-shrink-0 win-raised bg-[#d4d0c8] px-1 py-0.5 text-[11px] text-black font-bold border-r border-[#808080]" />
        <div className="flex-1 win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold border-r border-[#808080]">Title</div>
        <div className="w-32 hidden sm:block win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold border-r border-[#808080]">Artist</div>
        <div className="w-14 flex-shrink-0 win-raised bg-[#d4d0c8] px-2 py-0.5 text-[11px] text-black font-bold text-right">Time</div>
      </div>

      {/* Skeleton rows */}
      <div className="win-sunken bg-white">
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center gap-0 border-b border-[#d4d0c8] last:border-b-0"
          >
            <div className="w-8 flex-shrink-0 py-1 px-1 border-r border-[#d4d0c8] flex items-center justify-center">
              <div className="w-4 h-4 bg-[#d4d0c8] animate-pulse" />
            </div>
            <div className="flex-1 py-1 px-2 border-r border-[#d4d0c8]">
              <div className="h-3 bg-[#e0e0e0] animate-pulse rounded" style={{ width: `${55 + (idx % 4) * 10}%` }} />
            </div>
            <div className="w-32 hidden sm:block py-1 px-2 border-r border-[#d4d0c8]">
              <div className="h-3 bg-[#e0e0e0] animate-pulse rounded w-20" />
            </div>
            <div className="w-14 flex-shrink-0 py-1 px-2 flex justify-end">
              <div className="h-3 bg-[#e0e0e0] animate-pulse rounded w-8" />
            </div>
          </div>
        ))}
      </div>

      {/* Status bar */}
      <div className="win-statusbar text-[11px] text-black px-2 py-0.5" style={{ borderTop: '1px solid #808080' }}>
        <div className="win-sunken px-2 py-0.5 flex-1">Loading...</div>
      </div>
    </div>
  );
};

export default SongListSkeleton;
