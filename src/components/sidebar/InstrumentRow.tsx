"use client";

import { useTradingStore } from "@/store/trading-store";
import type { Instrument } from "@/types/instrument";
import { cn } from "@/lib/utils";

interface InstrumentRowProps {
  instrument: Instrument;
}

export function InstrumentRow({ instrument }: InstrumentRowProps) {
  const { selectedInstrument, setSelectedInstrument } = useTradingStore();
  const isSelected = selectedInstrument?.id === instrument.id;

  const decimals = instrument.pipSize < 0.01 ? 5 : instrument.pipSize < 1 ? 2 : 0;

  return (
    <div
      onClick={() => setSelectedInstrument(instrument)}
      className={cn(
        "flex items-center justify-between px-3 py-2 sm:py-1.5 cursor-pointer transition-colors text-[11px]",
        "hover:bg-bg-hover",
        isSelected && "bg-bg-active border-l-2 border-trading-blue"
      )}
    >
      <span className="font-medium text-text-primary w-[72px] truncate">
        {instrument.symbol}
      </span>
      <span className="font-mono text-text-secondary w-[60px] text-right">
        {instrument.bid.toFixed(decimals)}
      </span>
      <span className="font-mono text-text-secondary w-[60px] text-right hidden sm:inline">
        {instrument.ask.toFixed(decimals)}
      </span>
      <span
        className={cn(
          "font-mono w-[50px] text-right",
          instrument.changePercent >= 0 ? "text-trading-green" : "text-trading-red"
        )}
      >
        {instrument.changePercent >= 0 ? "+" : ""}
        {instrument.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}
