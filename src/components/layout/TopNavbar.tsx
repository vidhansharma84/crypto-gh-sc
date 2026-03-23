"use client";

import { Bell, Settings, User, Menu, ShoppingCart, LogOut } from "lucide-react";
import { useTradingStore } from "@/store/trading-store";
import { formatCurrency, formatPL } from "@/lib/formatters";
import { cn } from "@/lib/utils";

export function TopNavbar() {
  const { account, toggleSidebar, toggleOrderPanel, logout, isAuthenticated } = useTradingStore();

  const stats = [
    { label: "Balance", value: formatCurrency(account.balance), mobile: true },
    { label: "Equity", value: formatCurrency(account.equity) },
    { label: "Margin", value: formatCurrency(account.margin) },
    { label: "Free Margin", value: formatCurrency(account.freeMargin) },
    { label: "Margin Level", value: `${account.marginLevel.toFixed(2)}%` },
    {
      label: "Unrealized P/L",
      value: formatPL(account.unrealizedPL),
      color: account.unrealizedPL >= 0 ? "text-trading-green" : "text-trading-red",
      mobile: true,
    },
  ];

  return (
    <div className="flex items-center justify-between px-2 sm:px-4 bg-bg-secondary border-b border-border-primary h-14 sm:h-[100px] flex-shrink-0">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded hover:bg-bg-hover transition-colors"
        >
          <Menu className="w-5 h-5 text-text-secondary" />
        </button>
        <img src="/logo.png" alt="FNX Trading" className="h-8 sm:h-[80px] w-auto" />
      </div>

      {/* Account Stats - show all on desktop, only key ones on mobile */}
      <div className="hidden sm:flex items-center gap-1">
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

      {/* Mobile stats - only Balance and P/L */}
      <div className="flex sm:hidden items-center gap-2 min-w-0 flex-1 justify-center">
        {stats.filter((s) => s.mobile).map((stat) => (
          <div key={stat.label} className="flex flex-col items-center px-1">
            <span className="text-[8px] text-text-tertiary uppercase tracking-wider leading-none mb-0.5">
              {stat.label}
            </span>
            <span
              className={cn(
                "text-[10px] font-mono font-medium",
                stat.color || "text-text-primary"
              )}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1 sm:gap-3">
        <button
          onClick={toggleOrderPanel}
          className="lg:hidden p-2 rounded hover:bg-bg-hover transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-text-secondary" />
        </button>
        <button className="relative p-1.5 rounded hover:bg-bg-hover transition-colors hidden sm:block">
          <Bell className="w-4 h-4 text-text-secondary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-trading-red rounded-full" />
        </button>
        <button className="p-1.5 rounded hover:bg-bg-hover transition-colors hidden sm:block">
          <Settings className="w-4 h-4 text-text-secondary" />
        </button>
        <div className="w-7 h-7 rounded-full bg-trading-blue/20 flex items-center justify-center hidden sm:flex">
          <User className="w-3.5 h-3.5 text-trading-blue" />
        </div>
        {isAuthenticated && (
          <button
            onClick={logout}
            className="p-1.5 rounded hover:bg-trading-red/20 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-text-secondary hover:text-trading-red" />
          </button>
        )}
      </div>
    </div>
  );
}
