"use client";

import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";

export function QuickTradeBar() {
  const { selectedInstrument, toggleOrderPanel } = useTradingStore();

  if (!selectedInstrument) return null;

  const decimals =
    selectedInstrument.pipSize < 0.01
      ? 5
      : selectedInstrument.pipSize < 1
        ? 2
        : 0;

  const spread = (selectedInstrument.ask - selectedInstrument.bid).toFixed(decimals);

  return (
    <div className="lg:hidden flex items-center justify-between px-2 py-1.5 bg-bg-secondary border-t border-border-primary flex-shrink-0">
      {/* Bid/Ask */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-text-tertiary uppercase">Bid</span>
          <span className="text-[11px] font-mono text-trading-red font-medium">
            {selectedInstrument.bid.toFixed(decimals)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-text-tertiary uppercase">Ask</span>
          <span className="text-[11px] font-mono text-trading-green font-medium">
            {selectedInstrument.ask.toFixed(decimals)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-text-tertiary uppercase">Spread</span>
          <span className="text-[11px] font-mono text-text-secondary">{spread}</span>
        </div>
      </div>

      {/* High/Low */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-text-tertiary uppercase">High</span>
          <span className="text-[10px] font-mono text-trading-green">
            {selectedInstrument.high24h.toFixed(decimals)}
          </span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[8px] text-text-tertiary uppercase">Low</span>
          <span className="text-[10px] font-mono text-trading-red">
            {selectedInstrument.low24h.toFixed(decimals)}
          </span>
        </div>
      </div>

      {/* Quick Trade Button */}
      <button
        onClick={toggleOrderPanel}
        className="px-3 py-1.5 bg-trading-blue text-white text-[10px] font-bold rounded hover:bg-trading-blue/90 transition-colors"
      >
        TRADE
      </button>
    </div>
  );
}
