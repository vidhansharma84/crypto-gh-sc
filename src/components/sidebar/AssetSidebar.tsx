"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { AssetSearch } from "./AssetSearch";
import { AssetCategoryItem } from "./AssetCategoryItem";
import { ASSET_CATEGORIES } from "@/lib/constants";
import { useTradingStore } from "@/store/trading-store";
import { forexInstruments } from "@/data/instruments/forex";
import { cryptoInstruments } from "@/data/instruments/crypto";
import { stockInstruments } from "@/data/instruments/stocks";
import { commodityInstruments } from "@/data/instruments/commodities";
import { indexInstruments } from "@/data/instruments/indices";
import { etfInstruments } from "@/data/instruments/etfs";
import type { AssetCategory, Instrument } from "@/types/instrument";

const instrumentsByCategory: Record<AssetCategory, Instrument[]> = {
  forex: forexInstruments,
  crypto: cryptoInstruments,
  stocks: stockInstruments,
  commodities: commodityInstruments,
  indices: indexInstruments,
  etfs: etfInstruments,
};

export function AssetSidebar() {
  const { searchQuery, toggleSidebar } = useTradingStore();

  const filteredByCategory = useMemo(() => {
    if (!searchQuery.trim()) return instrumentsByCategory;

    const q = searchQuery.toLowerCase();
    const result: Record<string, Instrument[]> = {};

    for (const [category, instruments] of Object.entries(instrumentsByCategory)) {
      const filtered = instruments.filter(
        (i) =>
          i.symbol.toLowerCase().includes(q) ||
          i.displayName.toLowerCase().includes(q)
      );
      if (filtered.length > 0) {
        result[category] = filtered;
      }
    }

    return result as Record<AssetCategory, Instrument[]>;
  }, [searchQuery]);

  return (
    <div className="w-full h-full bg-bg-secondary border-r border-border-primary flex flex-col overflow-hidden">
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-3 py-2 lg:hidden border-b border-border-primary">
        <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Instruments</span>
        <button onClick={toggleSidebar} className="p-1 rounded hover:bg-bg-hover transition-colors">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      <AssetSearch />
      <div className="flex-1 overflow-y-auto">
        {ASSET_CATEGORIES.map((cat) => {
          const instruments = filteredByCategory[cat.id];
          if (!instruments || instruments.length === 0) return null;
          return (
            <AssetCategoryItem
              key={cat.id}
              category={cat}
              instruments={instruments}
            />
          );
        })}
      </div>
    </div>
  );
}
