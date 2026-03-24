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
  HandleSortBy: (value: sortByT, isTemp: boolean) => void;
  HandleSortOrder: (value: sortOrderT, isTemp: boolean) => void;
  isTemp?: boolean
}

const MusicHeader: React.FC<MusicPageHeaderProps> = ({
  sortBy,
  sortOrder,
  HandleSortBy,
  HandleSortOrder,
  isTemp=false
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
    {!isTemp &&   <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
        Music Collection
      </h2>}

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          value={sortBy}
          onValueChange={(val) => HandleSortBy(val as sortByT, isTemp)}
        >
          <SelectTrigger className="h-9 flex-1 sm:w-40 text-sm flex items-center gap-2">
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

        <Select
          value={sortOrder}
          onValueChange={(val) => HandleSortOrder(val as sortOrderT, isTemp)}
        >
          <SelectTrigger className="h-9 flex-1 sm:w-40 text-sm flex items-center gap-2">
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
