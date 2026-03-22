"use client";

import { useTradingStore } from "@/store/trading-store";
import { OrderForm } from "./OrderForm";

export function OrderPanel() {
  const { selectedInstrument } = useTradingStore();

  return (
    <div className="bg-bg-secondary border-l border-border-primary flex flex-col overflow-y-auto">
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
