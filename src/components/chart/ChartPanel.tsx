"use client";

import { useTradingStore } from "@/store/trading-store";
import { ChartToolbar } from "./ChartToolbar";
import { TradingChart } from "./TradingChart";
import { cn } from "@/lib/utils";

export function ChartPanel() {
  const { selectedInstrument } = useTradingStore();

  return (
    <div className="flex flex-col bg-bg-primary overflow-hidden">
      <ChartToolbar />
      <div className="flex-1 relative">
        {selectedInstrument ? (
          <TradingChart />
        ) : (
          <div className="flex items-center justify-center h-full text-text-tertiary text-sm">
            Select an instrument to view chart
          </div>
        )}
      </div>
    </div>
  );
}
