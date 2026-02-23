import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MusicPageHeaderProps {
  sortBy: sortByT;
  sortOrder: sortOrderT;
  HandleSortBy: (value: sortByT) => void;
  HandleSortOrder: (value: sortOrderT) => void;
}

const MusicHeader: React.FC<MusicPageHeaderProps> = ({
  sortBy,
  sortOrder,
  HandleSortBy,
  HandleSortOrder,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      {/* Title */}
      <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
        Music Collection
      </h2>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Sort By */}
        <Select
          value={sortBy}
          onValueChange={(val) => HandleSortBy(val as sortByT)}
        >
          <SelectTrigger className="h-9 w-40 text-sm flex items-center gap-2">
            <ArrowUpDown size={16} className="text-zinc-400" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="createdAt">Created At</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="playCount">Play Count</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {/* Sort Order */}
        <Select
          value={sortOrder}
          onValueChange={(val) => HandleSortOrder(val as sortOrderT)}
        >
          <SelectTrigger className="h-9 w-40 text-sm flex items-center gap-2">
            {sortOrder === "asc" ? (
              <ArrowUp size={16} className="text-zinc-400" />
            ) : (
              <ArrowDown size={16} className="text-zinc-400" />
            )}
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Order</SelectLabel>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MusicHeader;
