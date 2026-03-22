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
    <div className="flex items-center justify-between px-3 h-10 border-b border-border-primary bg-bg-secondary">
      {/* Instrument Info */}
      <div className="flex items-center gap-3">
        {selectedInstrument && (
          <>
            <span className="font-semibold text-sm text-text-primary">
              {selectedInstrument.symbol}
            </span>
            <span className="font-mono text-xs text-text-secondary">
              {selectedInstrument.bid.toFixed(decimals)}
            </span>
            <span
              className={cn(
                "text-xs font-mono",
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
      <div className="flex items-center gap-0.5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={cn(
              "px-2 py-1 text-[11px] rounded transition-colors",
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
      <div className="flex items-center gap-0.5">
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
