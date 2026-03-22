"use client";

import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/formatters";

const COLUMNS = [
  "Symbol",
  "Type",
  "Volume",
  "Open Price",
  "Close Price",
  "P/L",
  "Duration",
  "Close Time",
];

export function TradeHistory() {
  const { tradeHistory } = useTradingStore();

  if (tradeHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-tertiary text-xs">
        No trade history
      </div>
    );
  }

  return (
    <table className="w-full text-[11px]">
      <thead>
        <tr className="border-b border-border-secondary">
          {COLUMNS.map((col) => (
            <th
              key={col}
              className="px-2 py-1.5 text-left font-medium text-text-tertiary uppercase tracking-wider whitespace-nowrap"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tradeHistory.map((trade) => (
          <tr
            key={trade.id}
            className="border-b border-border-secondary hover:bg-bg-hover transition-colors"
          >
            <td className="px-2 py-1.5 font-medium text-text-primary">
              {trade.symbol}
            </td>
            <td
              className={cn(
                "px-2 py-1.5 uppercase font-medium",
                trade.side === "buy" ? "text-trading-green" : "text-trading-red"
              )}
            >
              {trade.side}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {trade.quantity.toFixed(2)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {trade.openPrice.toFixed(5)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {trade.closePrice.toFixed(5)}
            </td>
            <td
              className={cn(
                "px-2 py-1.5 font-mono font-medium",
                trade.profitLoss >= 0 ? "text-trading-green" : "text-trading-red"
              )}
            >
              {trade.profitLoss >= 0 ? "+" : ""}
              {formatCurrency(trade.profitLoss)}
            </td>
            <td className="px-2 py-1.5 text-text-tertiary">
              {trade.duration}
            </td>
            <td className="px-2 py-1.5 text-text-tertiary whitespace-nowrap">
              {formatDateTime(trade.closeTime)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
