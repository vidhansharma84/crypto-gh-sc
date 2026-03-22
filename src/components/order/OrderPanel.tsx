"use client";

import { X } from "lucide-react";
import { useTradingStore } from "@/store/trading-store";
import { OrderForm } from "./OrderForm";

export function OrderPanel() {
  const { selectedInstrument, toggleOrderPanel } = useTradingStore();

  return (
    <div className="w-full h-full bg-bg-secondary border-l border-border-primary flex flex-col overflow-y-auto">
      {/* Mobile close button */}
      <div className="flex items-center justify-between px-3 py-2 lg:hidden border-b border-border-primary">
        <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">Order</span>
        <button onClick={toggleOrderPanel} className="p-1 rounded hover:bg-bg-hover transition-colors">
          <X className="w-4 h-4 text-text-secondary" />
        </button>
      </div>
      {selectedInstrument ? (
        <OrderForm />
      ) : (
        <div className="flex items-center justify-center h-full text-text-tertiary text-xs">
          Select an instrument
        </div>
      )}
    </div>
  );
}
