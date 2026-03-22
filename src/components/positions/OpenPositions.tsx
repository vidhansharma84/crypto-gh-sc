"use client";

import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDateTime } from "@/lib/formatters";
import { X } from "lucide-react";

const COLUMNS = [
  "Symbol",
  "Type",
  "Volume",
  "Open Price",
  "Current",
  "S/L",
  "T/P",
  "P/L",
  "Swap",
  "Time",
  "",
];

export function OpenPositions() {
  const { positions } = useTradingStore();

  if (positions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-tertiary text-xs">
        No open positions
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
        {positions.map((pos) => (
          <tr
            key={pos.id}
            className="border-b border-border-secondary hover:bg-bg-hover transition-colors group"
          >
            <td className="px-2 py-1.5 font-medium text-text-primary">
              {pos.symbol}
            </td>
            <td
              className={cn(
                "px-2 py-1.5 uppercase font-medium",
                pos.side === "buy" ? "text-trading-green" : "text-trading-red"
              )}
            >
              {pos.side}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {pos.quantity.toFixed(2)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {pos.openPrice.toFixed(5)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {pos.currentPrice.toFixed(5)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-tertiary">
              {pos.stopLoss?.toFixed(5) ?? "—"}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-tertiary">
              {pos.takeProfit?.toFixed(5) ?? "—"}
            </td>
            <td
              className={cn(
                "px-2 py-1.5 font-mono font-medium",
                pos.profitLoss >= 0 ? "text-trading-green" : "text-trading-red"
              )}
            >
              {pos.profitLoss >= 0 ? "+" : ""}
              {formatCurrency(pos.profitLoss)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-tertiary">
              {pos.swap.toFixed(2)}
            </td>
            <td className="px-2 py-1.5 text-text-tertiary whitespace-nowrap">
              {formatDateTime(pos.openTime)}
            </td>
            <td className="px-2 py-1.5">
              <button className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-trading-red/20 transition-all">
                <X className="w-3 h-3 text-trading-red" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
