"use client";
import { Skeleton } from "@/components/ui/skeleton";

const AccountSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#5520A5] pt-2 pb-6 px-4 md:px-8">
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-28" />
        </div>

        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/10 bg-gradient-to-tr from-purple-900/60 via-[#6b30c2]/40 to-purple-800/40">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        <div className="flex flex-col gap-4 p-5 rounded-xl border border-white/10 bg-[#6b30c2]/40">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-4 h-4 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 p-5 rounded-xl border border-white/10 bg-[#6b30c2]/40">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10"
            >
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountSkeleton;
