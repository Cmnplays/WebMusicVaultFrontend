const MusicHeader = ({
  handleSorting,
  sortOrder,
}: {
  handleSorting: () => void;
  sortOrder: "asc" | "desc";
}) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
        Music Collection
      </h2>
      <button
        onClick={handleSorting}
        className="inline-flex items-center justify-center p-1"
        aria-label="Sort toggle"
        title={`${sortOrder === "desc" ? "Sort order is Oldest First" : "Sort order is Newest First"}`}
      >
        {sortOrder == "desc" ? (
          <i className="ri-sort-desc text-3xl leading-none" />
        ) : (
          <i className="ri-sort-asc text-3xl leading-none" />
        )}
      </button>
    </div>
  );
};

export default MusicHeader;
