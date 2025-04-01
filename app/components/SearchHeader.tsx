import GoBack from "./GoBack";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

export default function SearchHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  const [inputValue, setInputValue] = useState(searchQuery);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setSearchQuery(inputValue);
    }, 500); // 500ms debounce delay

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [inputValue, setSearchQuery]);

  return (
    <div className="w-full">
      <div className="py-4 px-6 flex items-center gap-4">
        <GoBack className="p-2 text-gray-600 bg-primary text-primary-foreground rounded-full cursor-pointer" />
        <div className="flex-1 relative">
          <label htmlFor="search">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </label>
          <input
            type="text"
            placeholder="Find products"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:border-gray-900"
            id="search"
          />
        </div>
      </div>
    </div>
  );
}
