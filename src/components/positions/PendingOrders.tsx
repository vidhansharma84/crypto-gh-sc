"use client";

import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";
import { X } from "lucide-react";

const COLUMNS = [
  "Symbol",
  "Type",
  "Side",
  "Volume",
  "Target Price",
  "S/L",
  "T/P",
  "Created",
  "Expires",
  "",
];

export function PendingOrders() {
  const { pendingOrders } = useTradingStore();

  if (pendingOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-text-tertiary text-xs">
        No pending orders
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
    <table className="w-full text-[11px] min-w-[650px]">
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
        {pendingOrders.map((order) => (
          <tr
            key={order.id}
            className="border-b border-border-secondary hover:bg-bg-hover transition-colors group"
          >
            <td className="px-2 py-1.5 font-medium text-text-primary">
              {order.symbol}
            </td>
            <td className="px-2 py-1.5 text-trading-orange uppercase font-medium">
              {order.type}
            </td>
            <td
              className={cn(
                "px-2 py-1.5 uppercase font-medium",
                order.side === "buy" ? "text-trading-green" : "text-trading-red"
              )}
            >
              {order.side}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-secondary">
              {order.quantity.toFixed(2)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-primary">
              {order.targetPrice.toFixed(5)}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-tertiary">
              {order.stopLoss?.toFixed(5) ?? "—"}
            </td>
            <td className="px-2 py-1.5 font-mono text-text-tertiary">
              {order.takeProfit?.toFixed(5) ?? "—"}
            </td>
            <td className="px-2 py-1.5 text-text-tertiary whitespace-nowrap">
              {formatDateTime(order.createdAt)}
            </td>
            <td className="px-2 py-1.5 text-text-tertiary whitespace-nowrap">
              {order.expiresAt ? formatDateTime(order.expiresAt) : "GTC"}
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
    </div>
  );
}
