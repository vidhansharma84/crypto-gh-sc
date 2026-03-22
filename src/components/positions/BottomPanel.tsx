"use client";

import { useTradingStore } from "@/store/trading-store";
import { cn } from "@/lib/utils";
import { OpenPositions } from "./OpenPositions";
import { PendingOrders } from "./PendingOrders";
import { TradeHistory } from "./TradeHistory";
import { EconomicCalendar } from "./EconomicCalendar";

const TABS = [
  { id: "positions" as const, label: "Open Positions" },
  { id: "pending" as const, label: "Pending Orders" },
  { id: "history" as const, label: "Trade History" },
  { id: "calendar" as const, label: "Economic Calendar" },
];

export function BottomPanel() {
  const { activeBottomTab, setActiveBottomTab, positions, pendingOrders } =
    useTradingStore();

  return (
    <div className="col-span-2 bg-bg-secondary border-t border-border-primary flex flex-col overflow-hidden">
      {/* Tabs */}
      <div className="flex items-center border-b border-border-primary px-2 h-8 flex-shrink-0">
        {TABS.map((tab) => {
          const count =
            tab.id === "positions"
              ? positions.length
              : tab.id === "pending"
                ? pendingOrders.length
                : null;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveBottomTab(tab.id)}
              className={cn(
                "px-3 h-full text-[11px] transition-colors border-b-2 whitespace-nowrap",
                activeBottomTab === tab.id
                  ? "text-trading-blue border-trading-blue"
                  : "text-text-tertiary border-transparent hover:text-text-secondary"
              )}
            >
              {tab.label}
              {count !== null && (
                <span className="ml-1 text-[10px] text-text-tertiary">
                  ({count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeBottomTab === "positions" && <OpenPositions />}
        {activeBottomTab === "pending" && <PendingOrders />}
        {activeBottomTab === "history" && <TradeHistory />}
        {activeBottomTab === "calendar" && <EconomicCalendar />}
      </div>
    </div>
  );
}
