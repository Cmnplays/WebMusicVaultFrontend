"use client";
import { Skeleton } from "@/components/ui/skeleton";

const PlaylistCardSkeleton = () => (
  <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-white/10">
    <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
    <div className="flex flex-col flex-1 min-w-0 gap-2">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-1/3" />
    </div>
    <Skeleton className="w-4 h-4 rounded-full shrink-0" />
  </div>
);

const PlaylistSkeleton = () => {
  return (
    <main className="max-w-5xl mx-auto min-h-screen p-4 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Skeleton className="w-7 h-7 rounded-md" />
        <Skeleton className="h-7 w-36" />
        <Skeleton className="ml-auto h-4 w-20" />
      </div>

      {/* Default playlists */}
      <div className="flex flex-col gap-3 mb-6">
        <PlaylistCardSkeleton />
        <PlaylistCardSkeleton />
      </div>

      {/* Personal playlists section label */}
      <Skeleton className="h-3 w-24 mb-3" />

      {/* Personal playlists */}
      <div className="flex flex-col gap-3">
        <PlaylistCardSkeleton />
        <PlaylistCardSkeleton />
        <PlaylistCardSkeleton />
      </div>
    </main>
  );
};

export default PlaylistSkeleton;
