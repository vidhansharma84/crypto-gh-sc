"use client";

import { Bell, Settings, User } from "lucide-react";
import { useTradingStore } from "@/store/trading-store";
import { formatCurrency, formatPL } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const { account } = useTradingStore();

  const stats = [
    { label: "Balance", value: formatCurrency(account.balance) },
    { label: "Equity", value: formatCurrency(account.equity) },
    { label: "Margin", value: formatCurrency(account.margin) },
    { label: "Free Margin", value: formatCurrency(account.freeMargin) },
    { label: "Margin Level", value: `${account.marginLevel.toFixed(2)}%` },
    {
      label: "Unrealized P/L",
      value: formatPL(account.unrealizedPL),
      color: account.unrealizedPL >= 0 ? "text-trading-green" : "text-trading-red",
    },
  ];

  return (
    <div className="col-span-3 flex items-center justify-between px-4 bg-bg-secondary border-b border-border-primary h-12">
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <img src="/logo.png" alt="FNX Trading" width={32} height={32} />
        <span className="font-bold text-text-primary text-sm tracking-wide">
          FNX Trading
        </span>
      </div>

      {/* Account Stats */}
      <div className="flex items-center gap-1">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center px-3 py-1"
          >
            <span className="text-[10px] text-text-tertiary uppercase tracking-wider leading-none mb-0.5">
              {stat.label}
            </span>
            <span
              className={cn(
                "text-xs font-mono font-medium",
                stat.color || "text-text-primary"
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 min-w-[120px] justify-end">
        <button className="relative p-1.5 rounded hover:bg-bg-hover transition-colors">
          <Bell className="w-4 h-4 text-text-secondary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-trading-red rounded-full" />
        </button>
        <button className="p-1.5 rounded hover:bg-bg-hover transition-colors">
          <Settings className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="w-7 h-7 rounded-full bg-trading-blue/20 flex items-center justify-center">
          <User className="w-3.5 h-3.5 text-trading-blue" />
        </div>
      </div>
    </div>
  );
}
