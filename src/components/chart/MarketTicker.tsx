"use client";

import { useTradingStore } from "@/store/trading-store";
import { forexInstruments } from "@/data/instruments/forex";
import { cryptoInstruments } from "@/data/instruments/crypto";
import { stockInstruments } from "@/data/instruments/stocks";
import { cn } from "@/lib/utils";

const tickerItems = [
  ...forexInstruments.slice(0, 6),
  ...cryptoInstruments.slice(0, 4),
  ...stockInstruments.slice(0, 4),
];

export function MarketTicker() {
  const { setSelectedInstrument } = useTradingStore();

  return (
    <div className="w-full bg-bg-secondary border-b border-border-primary overflow-hidden flex-shrink-0">
      <div className="flex animate-scroll gap-4 px-2 py-1.5 w-max">
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <button
            key={`${item.id}-${i}`}
            onClick={() => setSelectedInstrument(item)}
            className="flex items-center gap-2 flex-shrink-0 hover:bg-bg-hover px-1.5 py-0.5 rounded transition-colors"
          >
            <span className="text-[10px] font-medium text-text-primary whitespace-nowrap">
              {item.symbol}
            </span>
            <span className="text-[10px] font-mono text-text-secondary">
              {item.bid.toFixed(item.pipSize < 0.01 ? 5 : item.pipSize < 1 ? 2 : 0)}
            </span>
            <span
              className={cn(
                "text-[9px] font-mono",
                item.changePercent >= 0 ? "text-trading-green" : "text-trading-red"
              )}
            >
              {item.changePercent >= 0 ? "+" : ""}
              {item.changePercent.toFixed(2)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
