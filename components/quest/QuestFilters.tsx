 "use client";

import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type QuestFilter = "all" | "daily" | "side" | "epic" | "cleared";

interface QuestFiltersProps {
  value: string;
  onSearchChange: (value: string) => void;
  filter: QuestFilter;
  onFilterChange: (value: QuestFilter) => void;
}

const tabs: { key: QuestFilter; label: string }[] = [
  { key: "all", label: "All Quests" },
  { key: "daily", label: "Daily" },
  { key: "side", label: "Side Quests" },
  { key: "epic", label: "Epic" },
  { key: "cleared", label: "Cleared" },
];

export default function QuestFilters({
  value,
  onSearchChange,
  filter,
  onFilterChange,
}: QuestFiltersProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSearch = (newValue: string) => {
    setLocalValue(newValue);
    onSearchChange(newValue);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
      {/* Search Bar - Sci-fi HUD style */}
      <div className="relative flex-1 max-w-md group">
        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <div className="relative flex items-center">
          <Search className="absolute left-4 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search active missions..."
            value={localValue}
            onChange={(event) => handleSearch(event.target.value)}
            className="w-full bg-black/60 border border-blue-500/30 rounded-xl py-3 pl-12 pr-4 text-white placeholder-blue-400/70 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 font-medium transition-all backdrop-blur-md"
          />
        </div>
      </div>

      {/* Filter Tabs - RPG Inventory style */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <motion.button 
            key={tab.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(tab.key)}
            className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg font-bold text-[10px] sm:text-sm whitespace-nowrap transition-all shadow-[0_4px_0_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 ${
              filter === tab.key
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_4px_0_rgb(37,99,235)] border border-blue-400/50" 
              : "bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-400 hover:text-white"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
