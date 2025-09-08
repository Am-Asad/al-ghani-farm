import { Search } from "lucide-react";
import React from "react";

type SearchbarProps = {
  search: string;
  setSearch: (search: string) => void;
  placeholder?: string;
};

const Searchbar = ({
  search,
  setSearch,
  placeholder = "Search items...",
}: SearchbarProps) => {
  return (
    <div className="relative max-w-xs w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="search"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 rounded-md border border-input bg-background focus:border-primary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default Searchbar;
