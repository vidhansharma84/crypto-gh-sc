"use client";

import { Search } from "lucide-react";
import { useTradingStore } from "@/store/trading-store";

export function AssetSearch() {
  const { searchQuery, setSearchQuery } = useTradingStore();

  return (
    <div className="p-2 border-b border-border-primary">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search instruments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs bg-bg-tertiary border border-border-primary rounded text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-trading-blue transition-colors"
        />
      </div>
    </div>
  );
}
