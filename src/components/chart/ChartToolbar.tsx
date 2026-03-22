"use client";

import { useTradingStore } from "@/store/trading-store";
import { TIMEFRAMES, CHART_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CandlestickChart, LineChart, BarChart3 } from "lucide-react";
import type { ChartType } from "@/types/chart";

const chartTypeIcons: Record<ChartType, React.ComponentType<{ className?: string }>> = {
  candlestick: CandlestickChart,
  line: LineChart,
  bar: BarChart3,
};

export function ChartToolbar() {
  const {
    selectedInstrument,
    timeframe,
    setTimeframe,
    chartType,
    setChartType,
  } = useTradingStore();

  const decimals =
    selectedInstrument && selectedInstrument.pipSize < 0.01
      ? 5
      : selectedInstrument && selectedInstrument.pipSize < 1
        ? 2
        : 0;

  return (
    <div className="flex items-center justify-between px-2 sm:px-3 h-10 border-b border-border-primary bg-bg-secondary overflow-x-auto gap-2 flex-shrink-0">
      {/* Instrument Info */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {selectedInstrument && (
          <>
            <span className="font-semibold text-xs sm:text-sm text-text-primary whitespace-nowrap">
              {selectedInstrument.symbol}
            </span>
            <span className="font-mono text-[10px] sm:text-xs text-text-secondary whitespace-nowrap">
              {selectedInstrument.bid.toFixed(decimals)}
            </span>
            <span
              className={cn(
                "text-[10px] sm:text-xs font-mono whitespace-nowrap",
                selectedInstrument.changePercent >= 0
                  ? "text-trading-green"
                  : "text-trading-red"
              )}
            >
              {selectedInstrument.changePercent >= 0 ? "+" : ""}
              {selectedInstrument.changePercent.toFixed(2)}%
            </span>
          </>
        )}
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={cn(
              "px-1.5 sm:px-2 py-1 text-[10px] sm:text-[11px] rounded transition-colors whitespace-nowrap",
              timeframe === tf.value
                ? "bg-trading-blue text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
            )}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart Type Toggle */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {CHART_TYPES.map((ct) => {
          const Icon = chartTypeIcons[ct.value];
          return (
            <button
              key={ct.value}
              onClick={() => setChartType(ct.value)}
              className={cn(
                "p-1.5 rounded transition-colors",
                chartType === ct.value
                  ? "text-trading-blue bg-trading-blue/10"
                  : "text-text-tertiary hover:text-text-primary hover:bg-bg-hover"
              )}
              title={ct.label}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
