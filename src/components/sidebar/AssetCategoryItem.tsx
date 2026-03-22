"use client";

import { ChevronDown, ChevronRight, DollarSign, Bitcoin, TrendingUp, Gem, BarChart3, PieChart } from "lucide-react";
import { useTradingStore } from "@/store/trading-store";
import { InstrumentRow } from "./InstrumentRow";
import type { AssetCategory, Instrument } from "@/types/instrument";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Bitcoin,
  TrendingUp,
  Gem,
  BarChart3,
  PieChart,
};

interface AssetCategoryItemProps {
  category: { id: AssetCategory; name: string; icon: string };
  instruments: Instrument[];
}

export function AssetCategoryItem({ category, instruments }: AssetCategoryItemProps) {
  const { expandedCategories, toggleCategory } = useTradingStore();
  const isExpanded = expandedCategories.includes(category.id);
  const Icon = iconMap[category.icon] || DollarSign;

  return (
    <div>
      <button
        onClick={() => toggleCategory(category.id)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors",
          "hover:bg-bg-hover border-b border-border-secondary",
          isExpanded ? "text-text-primary bg-bg-tertiary" : "text-text-secondary"
        )}
      >
        {isExpanded ? (
          <ChevronDown className="w-3 h-3 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
        )}
        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="flex-1 text-left">{category.name}</span>
        <span className="text-text-tertiary text-[10px]">{instruments.length}</span>
      </button>
      {isExpanded && (
        <div>
          {instruments.map((instrument) => (
            <InstrumentRow key={instrument.id} instrument={instrument} />
          ))}
        </div>
      )}
    </div>
  );
}
